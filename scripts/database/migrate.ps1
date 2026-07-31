[CmdletBinding()]
param(
    [string]$ComposeFile = "docker-compose.yml"
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot/database-tools.ps1"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$migrationDirectory = Join-Path $repoRoot "database\migrations"

if (-not (Test-Path $migrationDirectory)) {
    throw "Migration directory not found: $migrationDirectory"
}

$files = @(Get-ChildItem -Path $migrationDirectory -Filter "*.sql" | Sort-Object Name)
if ($files.Count -eq 0) {
    throw "No migration files found in $migrationDirectory"
}

Push-Location $repoRoot
try {
    & docker compose -f $ComposeFile up -d postgres
    if ($LASTEXITCODE -ne 0) {
        throw "PostgreSQL container could not be started."
    }

    Wait-PostgresReady -ComposeFile $ComposeFile

    Invoke-PostgresSql `
        -ComposeFile $ComposeFile `
        -Sql "CREATE TABLE IF NOT EXISTS public.schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());" | Out-Null

    foreach ($file in $files) {
        $version = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $isApplied = Invoke-PostgresSql `
            -ComposeFile $ComposeFile `
            -TuplesOnly `
            -Sql "SELECT EXISTS (SELECT 1 FROM public.schema_migrations WHERE version = '$version');"

        if ($isApplied -eq "t") {
            Write-Host "Skipping applied migration $($file.Name)."
            continue
        }

        Write-Host "Applying migration $($file.Name)..."
        Invoke-PostgresSql -ComposeFile $ComposeFile -Sql (Get-Content -Raw $file.FullName) | Out-Null

        $recorded = Invoke-PostgresSql `
            -ComposeFile $ComposeFile `
            -TuplesOnly `
            -Sql "SELECT EXISTS (SELECT 1 FROM public.schema_migrations WHERE version = '$version');"

        if ($recorded -ne "t") {
            throw "Migration completed but was not recorded: $($file.Name)"
        }
    }
}
finally {
    Pop-Location
}
