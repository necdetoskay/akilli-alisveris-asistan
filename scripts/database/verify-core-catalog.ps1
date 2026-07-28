[CmdletBinding()]
param(
    [string]$ComposeFile = "docker-compose.yml"
)

$ErrorActionPreference = "Stop"
$postgresUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "akilli_alisveris" }
$postgresDb = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "akilli_alisveris" }
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

$query = @"
SELECT
  to_regclass('catalog.retailers') IS NOT NULL AS retailers,
  to_regclass('catalog.products') IS NOT NULL AS products,
  to_regclass('catalog.product_variants') IS NOT NULL AS product_variants,
  to_regclass('catalog.retailer_listings') IS NOT NULL AS retailer_listings,
  to_regclass('catalog.offers') IS NOT NULL AS offers,
  to_regclass('catalog.price_observations') IS NOT NULL AS price_observations;
"@

Push-Location $repoRoot
try {
    $query | docker compose -f $ComposeFile exec -T postgres `
        psql -v ON_ERROR_STOP=1 -U $postgresUser -d $postgresDb

    if ($LASTEXITCODE -ne 0) {
        throw "Core catalog verification failed."
    }
}
finally {
    Pop-Location
}
