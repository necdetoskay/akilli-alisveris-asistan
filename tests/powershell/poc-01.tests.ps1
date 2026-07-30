Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Push-Location $repoRoot
try {
    node .\scripts\poc-01\verify-fixtures.mjs
    if ($LASTEXITCODE -ne 0) { throw "POC-01 fixture verification failed." }

    $schema = Get-Content -Raw .\schemas\catalog-extraction.schema.json | ConvertFrom-Json
    if ($schema.title -ne "Catalog extraction") { throw "Unexpected schema title." }

    $gida = Get-Content -Raw .\fixtures\poc-01\expected\bim-2026-08-04-gida.expected.json | ConvertFrom-Json
    $aktuel = Get-Content -Raw .\fixtures\poc-01\expected\bim-2026-08-05-aktuel.expected.json | ConvertFrom-Json

    if ($gida.products.Count -ne 26) { throw "Expected 26 products in the food fixture." }
    if ($aktuel.products.Count -ne 13) { throw "Expected 13 products in the Aktuel fixture." }

    $dedupModule = Get-Content -Raw .\scripts\poc-01\lib\product-dedup.mjs
    if ($dedupModule -notmatch "mergeRegionalProducts") { throw "Regional deduplication module is missing." }

    $regionalScript = Get-Content -Raw .\scripts\poc-01\run-regional-benchmark.mjs
    if ($regionalScript -notmatch 'POC01_REGION_ROWS \?\? "2"') { throw "Regional benchmark must default to a 2x2 grid." }

    Write-Host "POC-01 contract tests passed." -ForegroundColor Green
}
finally {
    Pop-Location
}
