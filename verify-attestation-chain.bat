@echo off
REM Attestation Verification Script (Windows Batch)
REM Wrapper for PowerShell verification

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo ============================================
    echo Attestation Chain Verification
    echo ============================================
    echo.
    echo Usage:
    echo   verify-attestation-chain.bat ^<RUN_ID^>
    echo.
    echo Example:
    echo   verify-attestation-chain.bat 12345678
    echo.
    echo Find RUN_ID from GitHub Actions:
    echo   https://github.com/robdoeAiagency101/robdoerootauthority/actions
    echo.
    exit /b 1
)

set RUN_ID=%1
set REPO=robdoeAiagency101/robdoerootauthority

REM Check if PowerShell is available
where pwsh >nul 2>&1
if !errorlevel! equ 0 (
    REM PowerShell Core 7+
    pwsh -NoProfile -ExecutionPolicy Bypass -File "%~dp0verify-attestation-chain.ps1" -Repo "%REPO%" -RunId "%RUN_ID%"
    exit /b !errorlevel!
)

where powershell >nul 2>&1
if !errorlevel! equ 0 (
    REM Windows PowerShell 5.1
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0verify-attestation-chain.ps1" -Repo "%REPO%" -RunId "%RUN_ID%"
    exit /b !errorlevel!
)

echo Error: PowerShell not found in PATH
echo Install PowerShell Core from: https://github.com/PowerShell/PowerShell
exit /b 1
