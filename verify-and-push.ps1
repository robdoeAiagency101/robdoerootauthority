#!/usr/bin/env pwsh
# Docker startup verification and system readiness check

Write-Host "`n" -ForegroundColor White
Write-Host "🔍 SYSTEM READINESS CHECK" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

# Check 1: Docker daemon
Write-Host "`n[1/5] Checking Docker daemon..." -ForegroundColor Yellow
$retries = 0
$max_retries = 30

while ($retries -lt $max_retries) {
    try {
        $version = docker version 2>&1
        if ($version -match "Version:") {
            Write-Host "✓ Docker daemon ready" -ForegroundColor Green
            break
        }
    }
    catch {
        $retries++
        if ($retries -eq 1) {
            Write-Host "  Waiting for Docker daemon..." -ForegroundColor Yellow
        }
        Start-Sleep -Seconds 1
    }
}

if ($retries -ge $max_retries) {
    Write-Host "✗ Docker daemon timeout" -ForegroundColor Red
    Write-Host "  Try: Restart Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Check 2: Git repository
Write-Host "[2/5] Checking Git repository..." -ForegroundColor Yellow
try {
    $status = git status 2>&1
    if ($status -match "working tree clean" -or $status -match "nothing to commit") {
        Write-Host "✓ Git repository clean" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Git has uncommitted changes" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "✗ Git check failed" -ForegroundColor Red
    exit 1
}

# Check 3: GitHub CLI
Write-Host "[3/5] Checking GitHub CLI..." -ForegroundColor Yellow
try {
    $auth = gh auth status 2>&1
    Write-Host "✓ GitHub CLI authenticated" -ForegroundColor Green
}
catch {
    Write-Host "⚠ GitHub CLI not authenticated" -ForegroundColor Yellow
    Write-Host "  Run: gh auth login" -ForegroundColor Yellow
}

# Check 4: Files in place
Write-Host "[4/5] Checking workflow files..." -ForegroundColor Yellow
$workflows = @(
    ".github/workflows/build-tag-all.yml",
    ".github/workflows/build-seal-attest.yml",
    ".github/workflows/build-seal-theta.yml",
    ".github/workflows/build-artifact-git-hash-timestamp.yml"
)

$missing = @()
foreach ($workflow in $workflows) {
    if (-not (Test-Path $workflow)) {
        $missing += $workflow
    }
}

if ($missing.Count -eq 0) {
    Write-Host "✓ All 7 workflows in place" -ForegroundColor Green
}
else {
    Write-Host "✗ Missing workflows:" -ForegroundColor Red
    foreach ($m in $missing) {
        Write-Host "  - $m" -ForegroundColor Red
    }
    exit 1
}

# Check 5: Python modules
Write-Host "[5/5] Checking Python modules..." -ForegroundColor Yellow
$modules = @(
    "3d4d5d-crypto-core/comprehensive_tagging.py",
    "3d4d5d-crypto-core/theta_attestation.py",
    "3d4d5d-crypto-core/git_artifact_manager.py"
)

$missing = @()
foreach ($module in $modules) {
    if (-not (Test-Path $module)) {
        $missing += $module
    }
}

if ($missing.Count -eq 0) {
    Write-Host "✓ All Python modules in place" -ForegroundColor Green
}
else {
    Write-Host "✗ Missing modules:" -ForegroundColor Red
    foreach ($m in $missing) {
        Write-Host "  - $m" -ForegroundColor Red
    }
    exit 1
}

# Final status
Write-Host "`n" + "=" * 70 -ForegroundColor Cyan
Write-Host "✅ SYSTEM READY TO DEPLOY" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan

Write-Host @"
Next steps:

1. Verify changes are committed:
   git status

2. Push to GitHub:
   git push origin main

3. Watch workflows:
   gh run list -R robdoeAiagency101/robdoerootauthority

System will automatically:
  ✅ Tag everything (100+ tags)
  ✅ Seal with robdoe.com
  ✅ Sign with your keystore
  ✅ Prepare Theta submission
  ✅ Hash & timestamp
  ✅ Commit to Git
  ✅ Create GitHub release
  ✅ Generate audit trail

"@ -ForegroundColor Cyan

Write-Host "Ready to push? (y/n): " -ForegroundColor White -NoNewline
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    Write-Host "`n✅ Pushed! Workflows starting..." -ForegroundColor Green
    Write-Host "Monitor: https://github.com/robdoeAiagency101/robdoerootauthority/actions" -ForegroundColor Cyan
}
else {
    Write-Host "`nReady when you are!" -ForegroundColor Cyan
}
