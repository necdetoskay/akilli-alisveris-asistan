Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. "$PSScriptRoot/../../deploy/remote-port-tools.ps1"

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)] $Expected,
        [Parameter(Mandatory = $true)] $Actual,
        [Parameter(Mandatory = $true)] [string] $Message
    )

    if ("$Expected" -ne "$Actual") {
        throw "$Message Expected: $Expected Actual: $Actual"
    }
}

$ports = Get-PublishedDockerPorts -DockerPortLines @(
    "0.0.0.0:40000->3100/tcp, [::]:40000->3100/tcp",
    "127.0.0.1:40500->8080/tcp",
    "5432/tcp"
)

Assert-Equal "40000 40500" "$ports" "Published ports should be parsed and deduplicated."

$selected = Find-AvailablePort -UsedPorts @(40000, 40001, 40003) -StartPort 40000 -EndPort 40005
Assert-Equal 40002 $selected "The first free port should be selected."

$threw = $false
try {
    Find-AvailablePort -UsedPorts @(40000, 40001) -StartPort 40000 -EndPort 40001 | Out-Null
} catch {
    $threw = $true
}
Assert-Equal $true $threw "An exhausted range should throw."

$tempFile = Join-Path ([System.IO.Path]::GetTempPath()) "akilli-alisveris-env-$([guid]::NewGuid()).txt"

try {
    Set-EnvironmentFileValue -Path $tempFile -Key "API_PUBLIC_PORT" -Value "40010"
    Set-EnvironmentFileValue -Path $tempFile -Key "API_PUBLIC_PORT" -Value "40011"
    Set-EnvironmentFileValue -Path $tempFile -Key "REMOTE_DOCKER_HOST" -Value "172.41.42.51"

    $content = Get-Content $tempFile
    Assert-Equal 2 $content.Count "Environment file should contain one entry per key."
    Assert-Equal "API_PUBLIC_PORT=40011" $content[0] "Existing values should be replaced."
    Assert-Equal "REMOTE_DOCKER_HOST=172.41.42.51" $content[1] "New values should be appended."
} finally {
    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
}

Write-Host "Remote deployment helper tests passed." -ForegroundColor Green
