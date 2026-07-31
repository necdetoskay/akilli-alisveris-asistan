[CmdletBinding()]
param(
    [string]$ComposeFile = "docker-compose.yml"
)

$ErrorActionPreference = "Stop"
$postgresUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "akilli_alisveris" }
$postgresDb = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "akilli_alisveris" }

$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$seedDirectory = Join-Path $repoRoot "database\seeds"

if (-not (Test-Path $seedDirectory)) {
    throw "Seed directory not found: $seedDirectory"
}

$files = Get-ChildItem -Path $seedDirectory -Filter "*.sql" | Sort-Object Name
if ($files.Count -eq 0) {
    throw "No seed files found in $seedDirectory"
}

Push-Location $repoRoot
try {
    foreach ($file in $files) {
        Write-Host "Applying seed $($file.Name)..."
        Get-Content -Raw -Encoding UTF8 $file.FullName | docker compose -f $ComposeFile exec -T postgres `
            psql -v ON_ERROR_STOP=1 -U $postgresUser -d $postgresDb

        if ($LASTEXITCODE -ne 0) {
            throw "Seed failed: $($file.Name)"
        }
    }
}
finally {
    Pop-Location
}
