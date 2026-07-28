Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-PublishedDockerPorts {
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $DockerPortLines
    )

    $ports = [System.Collections.Generic.HashSet[int]]::new()

    foreach ($line in $DockerPortLines) {
        foreach ($match in [regex]::Matches($line, "(?:(?:\d{1,3}\.){3}\d{1,3}|\[[^\]]+\]|:::):(?<port>\d+)->")) {
            [void] $ports.Add([int] $match.Groups["port"].Value)
        }
    }

    return @($ports | Sort-Object)
}

function Find-AvailablePort {
    param(
        [Parameter(Mandatory = $true)]
        [int[]] $UsedPorts,

        [int] $StartPort = 40000,

        [int] $EndPort = 40999
    )

    if ($StartPort -lt 1024 -or $EndPort -gt 65535 -or $StartPort -gt $EndPort) {
        throw "Port range must be between 1024 and 65535 and start must not exceed end."
    }

    $used = [System.Collections.Generic.HashSet[int]]::new()

    foreach ($port in $UsedPorts) {
        [void] $used.Add($port)
    }

    for ($candidate = $StartPort; $candidate -le $EndPort; $candidate++) {
        if (-not $used.Contains($candidate)) {
            return $candidate
        }
    }

    throw "No available port found in range $StartPort-$EndPort."
}

function Set-EnvironmentFileValue {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path,

        [Parameter(Mandatory = $true)]
        [string] $Key,

        [Parameter(Mandatory = $true)]
        [string] $Value
    )

    $lines = if (Test-Path $Path) {
        @(Get-Content -Path $Path)
    } else {
        @()
    }

    $updated = $false
    $result = foreach ($line in $lines) {
        if ($line -match "^$([regex]::Escape($Key))=") {
            $updated = $true
            "$Key=$Value"
        } else {
            $line
        }
    }

    if (-not $updated) {
        $result = @($result) + "$Key=$Value"
    }

    $directory = Split-Path -Parent $Path

    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    Set-Content -Path $Path -Value $result -Encoding utf8
}

