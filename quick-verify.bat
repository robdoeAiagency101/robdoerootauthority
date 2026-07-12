@echo off
REM Quick verification wrapper - one command
REM Usage: quick-verify.bat <RUN_ID>

if "%1"=="" (
    echo.
    echo Usage: quick-verify.bat ^<RUN_ID^>
    echo.
    echo Example: quick-verify.bat 12345678
    echo.
    exit /b 1
)

call "%~dp0verify-attestation-chain.bat" %1
exit /b !errorlevel!
