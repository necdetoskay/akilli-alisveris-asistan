Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$scriptPath = Join-Path $repoRoot "scripts\verify-environment.ps1"

if (-not (Test-Path $scriptPath -PathType Leaf)) {
    throw "Environment verification script was not found."
}

$scriptText = Get-Content -Raw $scriptPath
$requiredChecks = @(
    'Assert-Command "node"',
    'Assert-Command "pnpm"',
    'Assert-Command "git"',
    '$nodeMajor -lt 22',
    'pnpm@10.15.1',
    'docker compose version'
)

foreach ($check in $requiredChecks) {
    if (-not $scriptText.Contains($check)) {
        throw "Expected verification rule is missing: $check"
    }
}

& $scriptPath -SkipDocker
if ($LASTEXITCODE -ne 0) {
    throw "Environment verification failed."
}

Write-Host "POC-00 verification tests passed." -ForegroundColor Green
