[CmdletBinding()]
param(
    [string]$ComposeFile = "docker-compose.yml"
)

$ErrorActionPreference = "Stop"
. "$PSScriptRoot/database-tools.ps1"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Push-Location $repoRoot

try {
    Wait-PostgresReady -ComposeFile $ComposeFile

    $expectedTables = @(
        "offers",
        "price_observations",
        "product_variants",
        "products",
        "retailer_listings",
        "retailers"
    )

    $actualTables = Invoke-PostgresSql `
        -ComposeFile $ComposeFile `
        -TuplesOnly `
        -Sql "SELECT table_name FROM information_schema.tables WHERE table_schema = 'catalog' ORDER BY table_name;"

    $actualTableList = @($actualTables -split "\r?\n" | Where-Object { $_ })

    foreach ($table in $expectedTables) {
        if ($actualTableList -notcontains $table) {
            throw "Required table is missing: catalog.$table"
        }
    }

    $migrationCount = Invoke-PostgresSql `
        -ComposeFile $ComposeFile `
        -TuplesOnly `
        -Sql "SELECT COUNT(*) FROM public.schema_migrations;"

    if ([int]$migrationCount -lt 1) {
        throw "No applied migrations were recorded."
    }

    $health = Invoke-PostgresSql -ComposeFile $ComposeFile -TuplesOnly -Sql "SELECT 1;"
    if ($health -ne "1") {
        throw "Database health query failed."
    }

    Write-Host "Database verification passed." -ForegroundColor Green
}
finally {
    Pop-Location
}
