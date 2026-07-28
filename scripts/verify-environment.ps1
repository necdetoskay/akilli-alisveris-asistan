[CmdletBinding()]
param(
    [switch] $SkipDocker
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-MajorVersion {
    param(
        [Parameter(Mandatory = $true)]
        [string] $VersionText
    )

    $match = [regex]::Match($VersionText, "\d+")
    if (-not $match.Success) {
        throw "Version could not be parsed from: $VersionText"
    }

    return [int]$match.Value
}

function Assert-Command {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Name
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command was not found: $Name"
    }
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$requiredFiles = @(
    "package.json",
    "pnpm-workspace.yaml",
    "turbo.json"
)

foreach ($relativePath in $requiredFiles) {
    $fullPath = Join-Path $repoRoot $relativePath
    if (-not (Test-Path $fullPath -PathType Leaf)) {
        throw "Required repository file is missing: $relativePath"
    }
}

Assert-Command "node"
Assert-Command "pnpm"
Assert-Command "git"

$nodeVersion = (& node --version).Trim()
$nodeMajor = Get-MajorVersion $nodeVersion
if ($nodeMajor -lt 22) {
    throw "Node.js 22 or newer is required. Found: $nodeVersion"
}

$pnpmVersion = (& pnpm --version).Trim()
if ([string]::IsNullOrWhiteSpace($pnpmVersion)) {
    throw "pnpm version could not be determined."
}

if (-not $SkipDocker) {
    Assert-Command "docker"

    & docker version *> $null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker is installed but the Docker engine is not available."
    }

    & docker compose version *> $null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose is not available."
    }
}

Push-Location $repoRoot
try {
    $isWorkTree = (& git rev-parse --is-inside-work-tree 2>$null).Trim()
    if ($isWorkTree -ne "true") {
        throw "The current directory is not a Git working tree."
    }

    $packageJson = Get-Content -Raw "package.json" | ConvertFrom-Json
    if ($packageJson.packageManager -ne "pnpm@10.15.1") {
        throw "Unexpected package manager declaration: $($packageJson.packageManager)"
    }
}
finally {
    Pop-Location
}

Write-Host "POC-00 environment verification passed." -ForegroundColor Green
Write-Host "Node.js: $nodeVersion"
Write-Host "pnpm: $pnpmVersion"
