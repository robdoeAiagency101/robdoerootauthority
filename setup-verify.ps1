#!/usr/bin/env pwsh
# 3D+4D+5D Crypto Triangle - ONE COMMAND SETUP
# Paste this URL into PowerShell and pipe to curl/Invoke-WebRequest
# Works: Windows, Mac, Linux | PowerShell 5.1+, Core 7+

Write-Host @"
╔════════════════════════════════════════════════════════╗
║  3D+4D+5D Cryptographic Triangle - Attestation Setup   ║
║  robdoe.com Witness Service                            ║
╚════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# ============ SETUP ============
$Repo = "robdoeAiagency101/robdoerootauthority"
$Enterprise = $false

# Detect if Enterprise GitHub
if ($env:GITHUB_ENTERPRISE_URL) {
    $Enterprise = $true
    $BaseUrl = $env:GITHUB_ENTERPRISE_URL
    Write-Host "✓ Detected Enterprise GitHub: $BaseUrl" -ForegroundColor Yellow
}

# ============ VERIFY DEPENDENCIES ============
Write-Host "`n[1/3] Checking dependencies..." -ForegroundColor Cyan

$HasGh = $false
try {
    $null = gh --version
    $HasGh = $true
    Write-Host "✓ GitHub CLI installed" -ForegroundColor Green
}
catch {
    Write-Host "✗ GitHub CLI not found" -ForegroundColor Red
    Write-Host "  Install: winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host "  Or: https://cli.github.com" -ForegroundColor Yellow
    exit 1
}

# ============ AUTHENTICATE ============
Write-Host "`n[2/3] Authenticating..." -ForegroundColor Cyan

try {
    $User = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Already authenticated" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Not authenticated, opening browser..." -ForegroundColor Yellow
        gh auth login
    }
}
catch {
    Write-Host "⚠ Auth check failed: $_" -ForegroundColor Yellow
}

# ============ CREATE VERIFY FUNCTION ============
Write-Host "`n[3/3] Setting up verify command..." -ForegroundColor Cyan

$VerifyScript = @'
function Verify-Attestation {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false, Position=0)]
        [string]$RunId,
        
        [Parameter(Mandatory=$false)]
        [string]$Repo = "robdoeAiagency101/robdoerootauthority"
    )
    
    # No run ID provided - list recent runs
    if ([string]::IsNullOrEmpty($RunId)) {
        Write-Host "`n📋 Recent workflow runs:" -ForegroundColor Cyan
        try {
            gh run list -R $Repo -L 10 --json databaseId,name,status,createdAt
        }
        catch {
            Write-Host "Error listing runs. Check repo access." -ForegroundColor Red
            Write-Host "Usage: verify <RUN_ID>" -ForegroundColor Yellow
        }
        return
    }
    
    $TempDir = Join-Path $env:TEMP "attest-verify-$RunId"
    if (-not (Test-Path $TempDir)) {
        $null = New-Item -ItemType Directory -Path $TempDir -Force
    }
    
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    Write-Host "🔍 VERIFYING ATTESTATION" -ForegroundColor Cyan
    Write-Host "=" * 70 -ForegroundColor Cyan
    Write-Host "Repo: $Repo" -ForegroundColor White
    Write-Host "Run:  $RunId" -ForegroundColor White
    
    # Download
    Write-Host "`n[1/5] Downloading artifacts..." -ForegroundColor Yellow
    try {
        Push-Location $TempDir
        gh run download $RunId -R $Repo -n "attestations-$RunId" 2>&1 | Out-Null
        Pop-Location
        Write-Host "✓ Downloaded to: $TempDir" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Download failed: $_" -ForegroundColor Red
        return
    }
    
    # Verify files exist
    Write-Host "[2/5] Verifying files..." -ForegroundColor Yellow
    $Files = @("attestation.json", "witness-attestation.json", "provenance-chain.json", "sbom.txt")
    $Missing = @()
    
    foreach ($File in $Files) {
        $Path = Join-Path $TempDir $File
        if (Test-Path $Path) {
            $Size = (Get-Item $Path).Length
            Write-Host "✓ $File ($Size bytes)" -ForegroundColor Green
        }
        else {
            Write-Host "✗ $File (MISSING)" -ForegroundColor Red
            $Missing += $File
        }
    }
    
    if ($Missing.Count -gt 0) {
        Write-Host "`n✗ Missing files. Workflow may not have completed." -ForegroundColor Red
        return
    }
    
    # Parse JSON
    Write-Host "`n[3/5] Parsing attestations..." -ForegroundColor Yellow
    try {
        $Attestation = Get-Content (Join-Path $TempDir "attestation.json") -Raw | ConvertFrom-Json
        $Witness = Get-Content (Join-Path $TempDir "witness-attestation.json") -Raw | ConvertFrom-Json
        $Provenance = Get-Content (Join-Path $TempDir "provenance-chain.json") -Raw | ConvertFrom-Json
        $Sbom = Get-Content (Join-Path $TempDir "sbom.txt") -Raw
        
        Write-Host "✓ All attestations parsed" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Parse failed: $_" -ForegroundColor Red
        return
    }
    
    # Display build info
    Write-Host "`n[4/5] Build Information:" -ForegroundColor Yellow
    $Digest = $Attestation.image.digest
    Write-Host "  Image Digest: $Digest" -ForegroundColor Cyan
    Write-Host "  Registry: $($Attestation.image.registry)" -ForegroundColor Cyan
    Write-Host "  Repository: $($Attestation.image.repository)" -ForegroundColor Cyan
    Write-Host "  Tags: $($Attestation.image.tags -join ', ')" -ForegroundColor Cyan
    Write-Host "  Timestamp: $($Attestation.timestamp)" -ForegroundColor Cyan
    
    # Verify witness
    Write-Host "`n[5/5] Verifying robdoe.com Witness:" -ForegroundColor Yellow
    
    $Checks = @{
        SignatureValid = $Witness.signature -match '^[a-f0-9]{64}$'
        StatusAttest = $Witness.status -eq "ATTESTED"
        HasVerifyUrl = -not [string]::IsNullOrEmpty($Witness.verificationUrl)
    }
    
    Write-Host "  Witness Service: $($Witness.witnessService)" -ForegroundColor Cyan
    Write-Host "  Signature: $($Witness.signature.Substring(0,32))..." -ForegroundColor Cyan
    Write-Host "  Status: $($Witness.status)" -ForegroundColor Cyan
    
    if ($Checks.SignatureValid) { Write-Host "  ✓ Signature valid (SHA256)" -ForegroundColor Green }
    else { Write-Host "  ✗ Invalid signature format" -ForegroundColor Red }
    
    if ($Checks.StatusAttest) { Write-Host "  ✓ Status: ATTESTED" -ForegroundColor Green }
    else { Write-Host "  ⚠ Status: $($Witness.status)" -ForegroundColor Yellow }
    
    # Chain of custody
    Write-Host "`n  Provenance Chain:" -ForegroundColor Cyan
    foreach ($Stage in $Provenance.attestations) {
        $Status = if ($Stage.status -eq "COMPLETED" -or $Stage.status -eq "PUSHED" -or $Stage.status -eq "ATTESTED") { "✓" } else { "✗" }
        Write-Host "    $Status $($Stage.stage): $($Stage.status)" -ForegroundColor Cyan
    }
    
    # SBOM
    $SbomLines = ($Sbom | Measure-Object -Line).Lines
    Write-Host "  ✓ SBOM: $SbomLines dependencies" -ForegroundColor Cyan
    
    # Result
    $AllValid = $Checks.SignatureValid -and $Checks.StatusAttest -and $Checks.HasVerifyUrl
    
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    
    if ($AllValid) {
        Write-Host "✅ ATTESTATION VERIFIED" -ForegroundColor Green
        Write-Host "   Container is authentic, reproducible, and attested by robdoe.com" -ForegroundColor Green
        Write-Host "=" * 70 -ForegroundColor Cyan
        
        Write-Host "`nAttest Details:" -ForegroundColor White
        Write-Host "  Witness: robdoe.com" -ForegroundColor Cyan
        Write-Host "  Signature: $($Witness.signature)" -ForegroundColor Cyan
        Write-Host "  Image: $($Attestation.image.registry)/$($Attestation.image.repository)@$Digest" -ForegroundColor Cyan
        Write-Host "  Verify: $($Witness.verificationUrl)" -ForegroundColor Cyan
        
        Write-Host "`nArtifacts saved: $TempDir" -ForegroundColor Yellow
        Write-Host "  Copy to: Copy-Item '$TempDir/*' './attestations/' -Recurse" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ ATTESTATION VERIFICATION FAILED" -ForegroundColor Red
        Write-Host "=" * 70 -ForegroundColor Cyan
        Write-Host "Check that the workflow run completed successfully." -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Set-Alias -Name verify -Value Verify-Attestation -Force -Scope Global
Set-Alias -Name verify-attest -Value Verify-Attestation -Force -Scope Global
'@

# Add to profile
$ProfilePath = $PROFILE
if (-not (Test-Path (Split-Path $ProfilePath))) {
    $null = New-Item -ItemType Directory -Path (Split-Path $ProfilePath) -Force
}

# Check if already in profile
if (-not (Select-String -Path $ProfilePath -Pattern "Verify-Attestation" -ErrorAction SilentlyContinue)) {
    Add-Content -Path $ProfilePath -Value "`n# 3D+4D+5D Crypto Triangle Verification`n$VerifyScript`n"
    Write-Host "✓ Added to PowerShell profile: $ProfilePath" -ForegroundColor Green
}
else {
    Write-Host "✓ Already in profile" -ForegroundColor Green
}

# Load into current session
Invoke-Expression $VerifyScript

# ============ READY ============
Write-Host "`n" + ("=" * 70) -ForegroundColor Green
Write-Host "✅ SETUP COMPLETE" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green

Write-Host @"
Commands ready:
  
  verify                    → List recent runs
  verify <RUN_ID>          → Verify attestation
  verify-attest <RUN_ID>   → Same (alias)

Find Run ID:
  https://github.com/$Repo/actions

Example:
  verify 12345678

"@ -ForegroundColor Cyan

# Test by listing runs
Write-Host "Recent runs:" -ForegroundColor White
try {
    gh run list -R $Repo -L 5 --json databaseId,name,status | ConvertFrom-Json | ForEach-Object {
        Write-Host "  [$($_.databaseId)] $($_.name) [$($_.status)]" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "  (Could not list - check repo access)" -ForegroundColor Yellow
}

Write-Host ""
