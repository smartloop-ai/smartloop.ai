<#
.SYNOPSIS
    Smartloop uninstaller for Windows (PowerShell).

.DESCRIPTION
    Reverses install.ps1. Stops the background agent and removes the per-user
    scheduled task, deletes the install tree under %USERPROFILE%\.smartloop and
    the download cache under %USERPROFILE%\.cache\smartloop, and strips the
    launcher directory from the user PATH.

    This is the Windows counterpart of uninstall.sh. Run it one-click with:

        irm https://smartloop.ai/uninstall.ps1 | iex
#>

[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$BaseDir  = Join-Path $HOME '.smartloop'
$CacheDir = Join-Path $HOME '.cache\smartloop'
$TaskName = 'Smartloop Agent'

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
function Write-Info  { param([string]$Message) Write-Host "==> $Message" -ForegroundColor Blue }
function Die {
    param([string]$Message)
    Write-Host "Error: $Message" -ForegroundColor Red
    exit 1
}

function Uninstall-Smartloop {
    # Stop and remove the per-user scheduled task that keeps the agent running.
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($task) {
        Write-Info "Removing scheduled task '$TaskName'..."
        Stop-ScheduledTask  -TaskName $TaskName -ErrorAction SilentlyContinue
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
        Write-Info 'Scheduled task removed'
    }

    # Stop the running agent. The launcher execs into the bundled python running
    # "commands.cli", so match the recorded pid first, then any process whose
    # image lives under the install dir.
    Write-Info 'Stopping any running smartloop processes...'
    $pidFile = Join-Path $BaseDir 'server.pid'
    if (Test-Path $pidFile) {
        $recorded = Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($recorded) {
            try { Stop-Process -Id ([int]$recorded) -Force -ErrorAction Stop } catch { }
        }
    }
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -match 'commands\.cli' -or $_.ExecutablePath -like "$BaseDir*" } |
        ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch { } }

    # Wait for them to actually exit. While alive they keep recreating files
    # (server.port, logs) inside $BaseDir, racing the directory removal below.
    for ($i = 0; $i -lt 10; $i++) {
        $alive = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -match 'commands\.cli' -or $_.ExecutablePath -like "$BaseDir*" }
        if (-not $alive) { break }
        Start-Sleep -Milliseconds 500
    }

    # Remove the install directory (binaries, shim, version data, conversations).
    if (Test-Path $BaseDir) {
        Write-Info "Removing $BaseDir..."
        Remove-Item -LiteralPath $BaseDir -Recurse -Force -ErrorAction SilentlyContinue
        if (Test-Path $BaseDir) {
            $left = (Get-ChildItem -LiteralPath $BaseDir -Force -ErrorAction SilentlyContinue | ForEach-Object Name) -join ' '
            Die "Could not fully remove $BaseDir (still contains: $left). A process may still be writing to it - close any running 'slp', then delete the folder manually."
        }
    }

    # Remove the download cache.
    if (Test-Path $CacheDir) {
        Write-Info "Removing cache $CacheDir..."
        Remove-Item -LiteralPath $CacheDir -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Strip the launcher directory from the user PATH.
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($null -ne $userPath) {
        $target  = $BaseDir.TrimEnd('\')
        $kept    = $userPath -split ';' | Where-Object { $_ -and ($_.TrimEnd('\') -ne $target) }
        $newPath = $kept -join ';'
        if ($newPath -ne $userPath) {
            Write-Info "Removing $BaseDir from PATH..."
            [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
        }
    }
    # Drop it from the current session too.
    $env:Path = (($env:Path -split ';') | Where-Object { $_ -and ($_.TrimEnd('\') -ne $BaseDir.TrimEnd('\')) }) -join ';'

    Write-Host ''
    Write-Host 'Smartloop uninstalled successfully.' -ForegroundColor Green
    Write-Host 'Open a new terminal for the PATH change to take effect.' -ForegroundColor DarkGray
}

Uninstall-Smartloop
