@echo off
REM Docker-based attestation verification (Windows)
REM Usage: verify-docker.bat <RUN_ID> [REPO]

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: verify-docker.bat ^<RUN_ID^> [REPO]
    echo.
    echo Example:
    echo   verify-docker.bat 12345678
    echo   verify-docker.bat 12345678 robdoeAiagency101/robdoerootauthority
    echo.
    exit /b 1
)

set RUN_ID=%1
set REPO=%2
if "%REPO%"=="" set REPO=robdoeAiagency101/robdoerootauthority

echo Building verification container...
docker build -f ./3d4d5d-crypto-core/Dockerfile.verify ^
    -t crypto-triangle-verifier:latest ^
    ./3d4d5d-crypto-core

if !errorlevel! neq 0 (
    echo Build failed
    exit /b 1
)

docker volume create attest-artifacts 2>nul || true

echo.
echo Running attestation verification...
docker run --rm ^
    -v attest-artifacts:/attestations ^
    -e REPO="%REPO%" ^
    crypto-triangle-verifier:latest ^
    %RUN_ID% %REPO%

if !errorlevel! equ 0 (
    echo.
    echo Attestation verified successfully
) else (
    echo.
    echo Verification failed
    exit /b 1
)
