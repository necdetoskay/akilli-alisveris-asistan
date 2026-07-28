[CmdletBinding()]
param(
    [string]$RemoteHost = "172.41.42.51",
    [int]$PortRangeStart = 40000,
    [int]$PortRangeEnd = 40999
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepositoryRoot = Split-Path -Parent $ScriptDirectory

$RemoteEnvPath = Join-Path $ScriptDirectory ".env.remote"

function Write-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Assert-CommandExists {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command
    )

    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        throw "Gerekli komut bulunamadı: $Command"
    }
}

function Get-ComposeFile {
    $Candidates = @(
        (Join-Path $ScriptDirectory "docker-compose.remote.yml"),
        (Join-Path $ScriptDirectory "compose.remote.yml"),
        (Join-Path $RepositoryRoot "docker-compose.yml"),
        (Join-Path $RepositoryRoot "compose.yml"),
        (Join-Path $RepositoryRoot "compose.yaml")
    )

    foreach ($Candidate in $Candidates) {
        if (Test-Path $Candidate -PathType Leaf) {
            return $Candidate
        }
    }

    throw @"
Docker Compose dosyası bulunamadı.

Kontrol edilen yollar:
$($Candidates -join [Environment]::NewLine)
"@
}

function Get-PublishedDockerPorts {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $false)]
        [AllowNull()]
        [AllowEmptyString()]
        [AllowEmptyCollection()]
        [string[]]$DockerPortLines = @()
    )

    $PublishedPorts = New-Object System.Collections.Generic.List[int]

    foreach ($Line in @($DockerPortLines)) {
        if ([string]::IsNullOrWhiteSpace($Line)) {
            continue
        }

        # Örnek Docker çıktıları:
        # 0.0.0.0:40001->3000/tcp
        # 127.0.0.1:40001->3000/tcp
        # [::]:40001->3000/tcp
        # :::40001->3000/tcp
        $Matches = [regex]::Matches(
            $Line,
            '(?:0\.0\.0\.0|127\.0\.0\.1|\[::\]|::):(?<port>\d+)->'
        )

        foreach ($Match in $Matches) {
            $Port = [int]$Match.Groups["port"].Value

            if (-not $PublishedPorts.Contains($Port)) {
                $PublishedPorts.Add($Port)
            }
        }
    }

    return @($PublishedPorts | Sort-Object)
}

function Get-FreePort {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$UsedPorts,

        [Parameter(Mandatory = $true)]
        [int]$StartPort,

        [Parameter(Mandatory = $true)]
        [int]$EndPort
    )

    if ($StartPort -lt 1 -or $EndPort -gt 65535) {
        throw "Port aralığı 1-65535 arasında olmalıdır."
    }

    if ($StartPort -gt $EndPort) {
        throw "Başlangıç portu bitiş portundan büyük olamaz."
    }

    for ($Port = $StartPort; $Port -le $EndPort; $Port++) {
        if ($UsedPorts -notcontains $Port) {
            return $Port
        }
    }

    throw "$StartPort-$EndPort aralığında boş port bulunamadı."
}

function Set-EnvironmentValue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

    if (Test-Path $Path -PathType Leaf) {
        $Content = [System.IO.File]::ReadAllText($Path)
    }
    else {
        $Content = ""
    }

    $Pattern = "(?m)^\s*$([regex]::Escape($Name))\s*=.*$"
    $NewLine = "$Name=$Value"

    if ([regex]::IsMatch($Content, $Pattern)) {
        $Content = [regex]::Replace($Content, $Pattern, $NewLine)
    }
    else {
        if (
            -not [string]::IsNullOrEmpty($Content) -and
            -not $Content.EndsWith("`n")
        ) {
            $Content += [Environment]::NewLine
        }

        $Content += $NewLine + [Environment]::NewLine
    }

    [System.IO.File]::WriteAllText(
        $Path,
        $Content,
        $Utf8NoBom
    )
}

function Invoke-DockerCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    & docker @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw "Docker komutu başarısız oldu: docker $($Arguments -join ' ')"
    }
}

Push-Location $RepositoryRoot

try {
    Write-Step "Gerekli araçlar kontrol ediliyor"

    Assert-CommandExists -Command "docker"

    $ComposeFile = Get-ComposeFile

    Write-Host "Repository root : $RepositoryRoot"
    Write-Host "Compose file    : $ComposeFile"
    Write-Host "Environment file: $RemoteEnvPath"

    Write-Step "Docker bağlantısı kontrol ediliyor"

    $ActiveContext = (& docker context show 2>$null | Out-String).Trim()

    if ($LASTEXITCODE -ne 0) {
        throw "Aktif Docker context okunamadı."
    }

    Write-Host "Active Docker context: $ActiveContext"

    & docker info --format "{{.Name}} | {{.OSType}} | {{.OperatingSystem}}"

    if ($LASTEXITCODE -ne 0) {
        throw @"
Docker sunucusuna bağlanılamadı.

Aktif context: $ActiveContext

Önce şu komutları kontrol edin:
docker context ls
docker context show
docker info
"@
    }

    Write-Step "Yayımlanmış Docker portları okunuyor"

    # Hiç container yoksa docker ps boş çıktı döndürebilir.
    # Boş satırları fonksiyona göndermiyoruz.
    $PublishedPortLines = @(
        & docker ps --format "{{.Ports}}" 2>$null |
            Where-Object {
                -not [string]::IsNullOrWhiteSpace($_)
            }
    )

    if ($LASTEXITCODE -ne 0) {
        throw "Docker container portları okunamadı."
    }

    if ($PublishedPortLines.Count -eq 0) {
        $PublishedPorts = @()
        Write-Host "Yayımlanmış Docker portu bulunamadı."
    }
    else {
        $PublishedPorts = @(
            Get-PublishedDockerPorts `
                -DockerPortLines $PublishedPortLines
        )

        if ($PublishedPorts.Count -gt 0) {
            Write-Host "Kullanılan portlar: $($PublishedPorts -join ', ')"
        }
        else {
            Write-Host "Docker çıktısında yayımlanmış host portu bulunamadı."
        }
    }

    Write-Step "API için boş port seçiliyor"

    $ApiPort = Get-FreePort `
        -UsedPorts $PublishedPorts `
        -StartPort $PortRangeStart `
        -EndPort $PortRangeEnd

    Write-Host "Seçilen API portu: $ApiPort" -ForegroundColor Green

    Write-Step "Remote environment dosyası güncelleniyor"

    Set-EnvironmentValue `
        -Path $RemoteEnvPath `
        -Name "API_PORT" `
        -Value $ApiPort

    Write-Host "API_PORT=$ApiPort"

    Write-Step "Docker Compose deployment başlatılıyor"

    $ComposeArguments = @(
        "compose",
        "--env-file",
        $RemoteEnvPath,
        "-f",
        $ComposeFile,
        "up",
        "-d",
        "--build",
        "--remove-orphans"
    )

    Invoke-DockerCommand -Arguments $ComposeArguments

    Write-Step "Container durumu"

    Invoke-DockerCommand -Arguments @(
        "compose",
        "--env-file",
        $RemoteEnvPath,
        "-f",
        $ComposeFile,
        "ps"
    )

    Write-Host ""
    Write-Host "Deployment tamamlandı." -ForegroundColor Green
    Write-Host "API adresi: http://${RemoteHost}:${ApiPort}" -ForegroundColor Green
    Write-Host "Health adresi: http://${RemoteHost}:${ApiPort}/health" -ForegroundColor Green
}
finally {
    Pop-Location
}