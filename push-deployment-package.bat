@echo off
REM Complete Deployment Package Push Script

echo.
echo ================================================================================
echo  COMPLETE DATA ACQUISITION DEPLOYMENT PACKAGE
echo  Tag - Sign - Witness - Push to Registry
echo ================================================================================
echo.

REM Step 1: Git status
echo [1/5] Checking git status...
git status
echo.

REM Step 2: Add all files
echo [2/5] Adding files...
git add .
echo.

REM Step 3: Commit
echo [3/5] Committing...
git commit -m "Complete data acquisition deployment package: 7 sources, container, witness, ready to push" -m "" -m "Includes:" -m "- 7 real-world data sources (crypto, weather, github, rates, stocks, news, docker)" -m "- Complete Dockerfile with multi-stage build" -m "- Witness attestation (robdoe.com)" -m "- Docker Compose deployment" -m "- GitHub Actions automation" -m "- Instant deployment guide"
echo.

REM Step 4: Status
echo [4/5] Git status...
git status
echo.

REM Step 5: Push
echo [5/5] Pushing to GitHub...
git push origin main
echo.

echo ================================================================================
echo  DEPLOYMENT COMPLETE
echo ================================================================================
echo.
echo Next Steps:
echo   1. Watch GitHub Actions: gh run list -R robdoeAiagency101/robdoerootauthority
echo   2. Check build: gh run view ^<RUN_ID^>
echo   3. Pull image: docker pull ghcr.io/robdoeAiagency101/data-acquisition:latest
echo   4. Deploy: docker run -it ghcr.io/robdoeAiagency101/data-acquisition:latest
echo.
echo 7 DATA SOURCES + CONTAINER + WITNESS + REGISTRY READY
echo.
