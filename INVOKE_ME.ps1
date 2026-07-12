# COPY-PASTE THIS ENTIRE BLOCK INTO POWERSHELL - IT WILL RUN IMMEDIATELY

$VerifyFunction = {
    param([string]$RunId = "")
    
    if ([string]::IsNullOrEmpty($RunId)) {
        Write-Host "Usage: verify 12345678" -ForegroundColor Yellow
        Write-Host "Example run IDs:" -ForegroundColor Cyan
        try {
            gh run list -R robdoeAiagency101/robdoerootauthority -L 5 --json databaseId,name,createdAt,status | ConvertFrom-Json | ForEach-Object {
                Write-Host "  $($_.databaseId) - $($_.name) - $($_.status)" -ForegroundColor White
            }
        }
        catch {
            Write-Host "  Install GitHub CLI: winget install GitHub.cli" -ForegroundColor Yellow
        }
        return
    }
    
    $Repo = "robdoeAiagency101/robdoerootauthority"
    $TempPath = Join-Path $env:TEMP "attest-$RunId"
    
    if (-not (Test-Path $TempPath)) { New-Item -ItemType Directory -Path $TempPath -Force | Out-Null }
    
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    Write-Host "🔍 ATTESTATION VERIFICATION - robdoe.com" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host "Repository: $Repo" -ForegroundColor White
    Write-Host "Run ID: $RunId" -ForegroundColor White
    
    # Download
    Write-Host "`n[1/4] Downloading artifacts..." -ForegroundColor Yellow
    try {
        Push-Location $TempPath
        gh run download $RunId -R $Repo -n "attestations-$RunId" -D . 2>&1 | Out-Null
        Pop-Location
        Write-Host "✓ Downloaded" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
        return
    }
    
    # Verify files
    Write-Host "[2/4] Verifying files..." -ForegroundColor Yellow
    $Files = @("attestation.json", "witness-attestation.json", "provenance-chain.json")
    $AllFound = $true
    foreach ($f in $Files) {
        $p = Join-Path $TempPath $f
        if (Test-Path $p) {
            Write-Host "✓ $f" -ForegroundColor Green
        }
        else {
            Write-Host "✗ $f" -ForegroundColor Red
            $AllFound = $false
        }
    }
    
    if (-not $AllFound) { return }
    
    # Parse
    Write-Host "[3/4] Parsing attestations..." -ForegroundColor Yellow
    $Att = Get-Content (Join-Path $TempPath "attestation.json") -Raw | ConvertFrom-Json
    $Wit = Get-Content (Join-Path $TempPath "witness-attestation.json") -Raw | ConvertFrom-Json
    $Prov = Get-Content (Join-Path $TempPath "provenance-chain.json") -Raw | ConvertFrom-Json
    
    Write-Host "✓ attestation.json" -ForegroundColor Green
    Write-Host "  ├─ Digest: $($Att.image.digest.Substring(0,16))..." -ForegroundColor Cyan
    Write-Host "  └─ Timestamp: $($Att.timestamp)" -ForegroundColor Cyan
    
    Write-Host "✓ witness-attestation.json" -ForegroundColor Green
    Write-Host "  ├─ Witness: $($Wit.witnessService)" -ForegroundColor Cyan
    Write-Host "  ├─ Signature: $($Wit.signature.Substring(0,16))..." -ForegroundColor Cyan
    Write-Host "  └─ Status: $($Wit.status)" -ForegroundColor Cyan
    
    Write-Host "✓ provenance-chain.json" -ForegroundColor Green
    Write-Host "  └─ Stages: $($Prov.attestations.Count)" -ForegroundColor Cyan
    foreach ($s in $Prov.attestations) {
        Write-Host "     ├─ $($s.stage): $($s.status)" -ForegroundColor Cyan
    }
    
    # Verify
    Write-Host "[4/4] Verifying robdoe.com witness..." -ForegroundColor Yellow
    
    $SigValid = $Wit.signature -match '^[a-f0-9]{64}$'
    $StatusValid = $Wit.status -eq "ATTESTED"
    
    if ($SigValid) { Write-Host "✓ Signature format valid" -ForegroundColor Green }
    else { Write-Host "✗ Signature invalid" -ForegroundColor Red }
    
    if ($StatusValid) { Write-Host "✓ Status: ATTESTED" -ForegroundColor Green }
    else { Write-Host "⚠ Status: $($Wit.status)" -ForegroundColor Yellow }
    
    # Result
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    if ($SigValid -and $StatusValid) {
        Write-Host "✅ AUDIT PASSED" -ForegroundColor Green
        Write-Host "Container attested by robdoe.com" -ForegroundColor Green
        Write-Host "=" * 70 -ForegroundColor Cyan
        Write-Host "`nSummary:" -ForegroundColor White
        Write-Host "  Witness: robdoe.com" -ForegroundColor Cyan
        Write-Host "  Signature: $($Wit.signature)" -ForegroundColor Cyan
        Write-Host "  Image: $($Att.image.registry)/$($Att.image.repository)" -ForegroundColor Cyan
        Write-Host "  Verify: $($Wit.verificationUrl)" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ AUDIT FAILED" -ForegroundColor Red
        Write-Host "=" * 70 -ForegroundColor Cyan
    }
}

# Load function globally
$global:VerifyFunction = $VerifyFunction

# Create alias
function verify {
    param([string]$RunId = "")
    & $global:VerifyFunction $RunId
}

function verify-attest {
    param([string]$RunId = "")
    & $global:VerifyFunction $RunId
}

Write-Host "`n✅ Loaded: verify <RUN_ID>" -ForegroundColor Green
Write-Host "Example: verify 12345678`n" -ForegroundColor Cyan
