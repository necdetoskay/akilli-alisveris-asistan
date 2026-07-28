Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$migrateScript = Join-Path $repoRoot "scripts\database\migrate.ps1"
$verifyScript = Join-Path $repoRoot "scripts\database\verify-database.ps1"
$composeFile = Join-Path $repoRoot "docker-compose.yml"

Push-Location $repoRoot
try {
    & $migrateScript -ComposeFile $composeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Initial migration run failed."
    }

    & $verifyScript -ComposeFile $composeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Database verification failed after initial migration."
    }

    $settingsUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "akilli_alisveris" }
    $settingsDatabase = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "akilli_alisveris" }

    $before = docker compose -f $composeFile exec -T postgres `
        psql -U $settingsUser -d $settingsDatabase -t -A `
        -c "SELECT COUNT(*) FROM public.schema_migrations;"

    if ($LASTEXITCODE -ne 0) {
        throw "Could not read migration count before idempotency check."
    }

    & $migrateScript -ComposeFile $composeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Second migration run failed."
    }

    $beforeCount = [int](($before -join "").Trim())

    $after = docker compose -f $composeFile exec -T postgres `
        psql -U $settingsUser -d $settingsDatabase -t -A `
        -c "SELECT COUNT(*) FROM public.schema_migrations;"

    if ($LASTEXITCODE -ne 0) {
        throw "Could not read migration count after idempotency check."
    }

    $afterCount = [int](($after -join "").Trim())
    if ($beforeCount -ne $afterCount) {
        throw "Migration runner is not idempotent. Before: $beforeCount After: $afterCount"
    }

    Write-Host "Database migration integration tests passed." -ForegroundColor Green
}
finally {
    Pop-Location
}
