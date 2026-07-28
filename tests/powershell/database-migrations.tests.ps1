Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$migrateScript = Join-Path $repoRoot "scripts\database\migrate.ps1"
$verifyScript = Join-Path $repoRoot "scripts\database\verify-database.ps1"
$composeFile = Join-Path $repoRoot "docker-compose.yml"

. (Join-Path $repoRoot "scripts\database\database-tools.ps1")

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

    $before = Invoke-PostgresSql `
        -ComposeFile $composeFile `
        -TuplesOnly `
        -Sql "SELECT COUNT(*) FROM public.schema_migrations;"

    $beforeCount = [int]$before

    & $migrateScript -ComposeFile $composeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Second migration run failed."
    }

    $after = Invoke-PostgresSql `
        -ComposeFile $composeFile `
        -TuplesOnly `
        -Sql "SELECT COUNT(*) FROM public.schema_migrations;"

    $afterCount = [int]$after
    if ($beforeCount -ne $afterCount) {
        throw "Migration runner is not idempotent. Before: $beforeCount After: $afterCount"
    }

    Write-Host "Database migration integration tests passed." -ForegroundColor Green
}
finally {
    Pop-Location
}
