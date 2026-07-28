Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-DatabaseSettings {
    [CmdletBinding()]
    param()

    [pscustomobject]@{
        User = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "akilli_alisveris" }
        Database = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "akilli_alisveris" }
    }
}

function Invoke-PostgresSql {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string] $Sql,
        [string] $ComposeFile = "docker-compose.yml",
        [switch] $TuplesOnly
    )

    $settings = Get-DatabaseSettings
    $arguments = @(
        "compose", "-f", $ComposeFile, "exec", "-T", "postgres",
        "psql", "-v", "ON_ERROR_STOP=1", "-U", $settings.User, "-d", $settings.Database
    )

    if ($TuplesOnly) {
        $arguments += @("-t", "-A")
    }

    $output = $Sql | & docker @arguments
    if ($LASTEXITCODE -ne 0) {
        throw "PostgreSQL command failed."
    }

    return ($output -join [Environment]::NewLine).Trim()
}

function Wait-PostgresReady {
    [CmdletBinding()]
    param(
        [string] $ComposeFile = "docker-compose.yml",
        [int] $Attempts = 30,
        [int] $DelaySeconds = 2
    )

    $settings = Get-DatabaseSettings

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        & docker compose -f $ComposeFile exec -T postgres `
            pg_isready -U $settings.User -d $settings.Database *> $null

        if ($LASTEXITCODE -eq 0) {
            return
        }

        Start-Sleep -Seconds $DelaySeconds
    }

    throw "PostgreSQL did not become ready after $Attempts attempts."
}
