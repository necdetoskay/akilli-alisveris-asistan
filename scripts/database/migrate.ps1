[CmdletBinding()]
param(
    [string]$ComposeFile = "docker-compose.yml"
)

$ErrorActionPreference = "Stop"
$postgresUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "akilli_alisveris" }
$postgresDb = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "akilli_alisveris" }

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$migrationDirectory = Join-Path $repoRoot "database\migrations"

if (-not (Test-Path $migrationDirectory)) {
    throw "Migration directory not found: $migrationDirectory"
}

$files = Get-ChildItem -Path $migrationDirectory -Filter "*.sql" | Sort-Object Name
if ($files.Count -eq 0) {
    throw "No migration files found in $migrationDirectory"
}

Push-Location $repoRoot
try {
    docker compose -f $ComposeFile up -d postgres
    if ($LASTEXITCODE -ne 0) { throw "PostgreSQL container could not be started." }

    foreach ($file in $files) {
        Write-Host "Applying migration $($file.Name)..."
        Get-Content -Raw $file.FullName | docker compose -f $ComposeFile exec -T postgres `
            psql -v ON_ERROR_STOP=1 -U $postgresUser -d $postgresDb

        if ($LASTEXITCODE -ne 0) {
            throw "Migration failed: $($file.Name)"
        }
    }
}
finally {
    Pop-Location
}
