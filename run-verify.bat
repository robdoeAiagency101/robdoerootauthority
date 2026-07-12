@echo off
REM Run verify-attestation-chain.ps1 with proper syntax
REM Usage: run-verify.bat <RUN_ID>

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo ============================================
    echo Verify Attestation Chain
    echo ============================================
    echo.
    echo Usage:
    echo   run-verify.bat ^<RUN_ID^>
    echo.
    echo Example:
    echo   run-verify.bat 12345678
    echo.
    echo Find RUN_ID:
    echo   1. Go to: https://github.com/robdoeAiagency101/robdoerootauthority/actions
    echo   2. Click the latest workflow run
    echo   3. Copy the run number from the URL
    echo.
    exit /b 1
)

set RUN_ID=%1
set REPO=robdoeAiagency101/robdoerootauthority
set SCRIPT_DIR=%~dp0
set SCRIPT_PATH=%SCRIPT_DIR%verify-attestation-chain.ps1

REM Check if script exists
if not exist "%SCRIPT_PATH%" (
    echo Error: verify-attestation-chain.ps1 not found in %SCRIPT_DIR%
    exit /b 1
)

REM Try PowerShell Core first (pwsh)
where pwsh >nul 2>&1
if !errorlevel! equ 0 (
    echo Running with PowerShell Core...
    pwsh -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%" -Repo "%REPO%" -RunId "%RUN_ID%"
    exit /b !errorlevel!
)

REM Fall back to Windows PowerShell (powershell)
where powershell >nul 2>&1
if !errorlevel! equ 0 (
    echo Running with Windows PowerShell...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%" -Repo "%REPO%" -RunId "%RUN_ID%"
    exit /b !errorlevel!
)

echo.
echo Error: PowerShell not found in PATH
echo.
echo Solution 1: Add PowerShell to PATH
echo   - Open Settings ^> System ^> About
echo   - Click "Advanced system settings"
echo   - Click "Environment Variables"
echo   - Add PowerShell installation directory to PATH
echo.
echo Solution 2: Install PowerShell Core
echo   - Download: https://github.com/PowerShell/PowerShell/releases
echo   - Or: winget install PowerShell
echo.
echo Solution 3: Run manually with full path
echo   powershell -ExecutionPolicy Bypass -File "%SCRIPT_PATH%" -Repo "%REPO%" -RunId "%RUN_ID%"
echo.
exit /b 1
