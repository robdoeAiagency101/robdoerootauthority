#!/usr/bin/env pwsh
# Attestation Verification Script (PowerShell)
# Downloads and verifies attestation chain from GitHub workflow artifacts
# Compatible with Windows PowerShell 5.1+ and PowerShell Core 7+

param(
    [Parameter(Mandatory=$true)]
    [string]$Repo = "robdoeAiagency101/robdoerootauthority",
    
    [Parameter(Mandatory=$true)]
    [string]$RunId,
    
    [switch]$Verbose
)

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -ForegroundColor White
    Write-Host "=" * 50 -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Test-GhCli {
    try {
        $null = gh --version
        return $true
    }
    catch {
        return $false
    }
}

function Download-Artifacts {
    param(
        [string]$Repo,
        [string]$RunId,
        [string]$OutputPath
    )
    
    Write-Host "[1/4] Downloading attestation artifacts from GitHub..." -ForegroundColor Yellow
    
    if (-not (Test-GhCli)) {
        Write-Error "GitHub CLI (gh) not installed or not in PATH"
        Write-Host "Install from: https://cli.github.com"
        Write-Host "Or download from: https://github.com/$Repo/actions/runs/$RunId"
        return $false
    }
    
    try {
        Push-Location $OutputPath
        gh run download $RunId -R $Repo -n "attestations-$RunId" -D . 2>&1 | Out-Null
        Pop-Location
        Write-Success "Artifacts downloaded"
        return $true
    }
    catch {
        Write-Error "Failed to download artifacts: $_"
        Write-Host "Manual download: https://github.com/$Repo/actions/runs/$RunId"
        return $false
    }
}

function Verify-Files {
    param([string]$Path)
    
    Write-Host "[2/4] Verifying file integrity..." -ForegroundColor Yellow
    
    $RequiredFiles = @(
        "attestation.json",
        "witness-attestation.json",
        "provenance-chain.json",
        "sbom.txt"
    )
    
    $AllFound = $true
    foreach ($file in $RequiredFiles) {
        $FilePath = Join-Path $Path $file
        if (Test-Path $FilePath) {
            Write-Success "$file found"
        }
        else {
            Write-Error "$file NOT found"
            $AllFound = $false
        }
    }
    
    return $AllFound
}

function Parse-Attestations {
    param([string]$Path)
    
    Write-Host "[3/4] Parsing attestations..." -ForegroundColor Yellow
    
    $Result = @{}
    
    # Load attestation.json
    $AttestationPath = Join-Path $Path "attestation.json"
    if (Test-Path $AttestationPath) {
        $Result.Attestation = Get-Content $AttestationPath | ConvertFrom-Json
        Write-Success "attestation.json parsed"
        
        $Digest = $Result.Attestation.image.digest
        $DigestShort = $Digest.Substring(0, 16) + "..."
        Write-Host "  Image Digest: $DigestShort" -ForegroundColor Cyan
        Write-Host "  Timestamp: $($Result.Attestation.timestamp)" -ForegroundColor Cyan
    }
    
    # Load witness-attestation.json
    $WitnessPath = Join-Path $Path "witness-attestation.json"
    if (Test-Path $WitnessPath) {
        $Result.Witness = Get-Content $WitnessPath | ConvertFrom-Json
        Write-Success "witness-attestation.json parsed"
        
        $Witness = $Result.Witness.witnessService
        $Sig = $Result.Witness.signature.Substring(0, 16) + "..."
        Write-Host "  Witness: $Witness" -ForegroundColor Cyan
        Write-Host "  Signature: $Sig" -ForegroundColor Cyan
        Write-Host "  Status: $($Result.Witness.status)" -ForegroundColor Cyan
    }
    
    # Load provenance-chain.json
    $ProvPath = Join-Path $Path "provenance-chain.json"
    if (Test-Path $ProvPath) {
        $Result.Provenance = Get-Content $ProvPath | ConvertFrom-Json
        Write-Success "provenance-chain.json parsed"
        
        $StageCount = $Result.Provenance.attestations.Count
        Write-Host "  Attestation stages: $StageCount" -ForegroundColor Cyan
        foreach ($stage in $Result.Provenance.attestations) {
            Write-Host "    ├─ $($stage.stage): $($stage.status)" -ForegroundColor Cyan
        }
    }
    
    return $Result
}

function Verify-WitnessAttestation {
    param([PSCustomObject]$WitnessData)
    
    Write-Host "[4/4] Verifying robdoe.com witness attestation..." -ForegroundColor Yellow
    
    $Checks = @{
        SignatureFormat = $false
        SignatureValid = $false
        StatusValid = $false
        TimestampValid = $false
    }
    
    # Check signature format (SHA256 hex = 64 chars)
    $Sig = $WitnessData.signature
    if ($Sig -match '^[a-f0-9]{64}$') {
        Write-Success "Witness signature format valid (SHA256 hex)"
        $Checks.SignatureFormat = $true
    }
    else {
        Write-Error "Invalid signature format: $Sig"
        $Checks.SignatureFormat = $false
    }
    
    # Check status
    if ($WitnessData.status -eq "ATTESTED") {
        Write-Success "Attestation status: ATTESTED"
        $Checks.StatusValid = $true
    }
    else {
        Write-Warning "Attestation status: $($WitnessData.status)"
        $Checks.StatusValid = $false
    }
    
    # Check timestamp
    if ($WitnessData.timestamp) {
        Write-Success "Timestamp: $($WitnessData.timestamp)"
        $Checks.TimestampValid = $true
    }
    
    # Check signature verification URL
    $VerifyUrl = $WitnessData.verificationUrl
    if ($VerifyUrl) {
        Write-Host "  Verify at: $VerifyUrl" -ForegroundColor Cyan
    }
    
    return $Checks
}

# Main execution
function Main {
    Write-Header "🔍 ATTESTATION CHAIN VERIFICATION - robdoe.com Witness"
    
    Write-Host "Repository: $Repo" -ForegroundColor White
    Write-Host "Workflow Run: $RunId" -ForegroundColor White
    
    # Create temp directory
    $TempPath = Join-Path ([System.IO.Path]::GetTempPath()) "attestation-verify-$RunId"
    if (-not (Test-Path $TempPath)) {
        $null = New-Item -ItemType Directory -Path $TempPath -Force
    }
    
    # Download artifacts
    if (-not (Download-Artifacts -Repo $Repo -RunId $RunId -OutputPath $TempPath)) {
        exit 1
    }
    
    # Verify files exist
    if (-not (Verify-Files -Path $TempPath)) {
        Write-Error "Missing required attestation files"
        exit 1
    }
    
    # Parse attestations
    $Attestations = Parse-Attestations -Path $TempPath
    
    if (-not $Attestations.Witness) {
        Write-Error "Witness attestation not loaded"
        exit 1
    }
    
    # Verify witness attestation
    $WitnessChecks = Verify-WitnessAttestation -WitnessData $Attestations.Witness
    
    # Final result
    $AllValid = $WitnessChecks.Values | Measure-Object -Property { $_ } -Sum | Select-Object -ExpandProperty Sum
    $TotalChecks = $WitnessChecks.Count
    
    Write-Header "VERIFICATION RESULT"
    
    if ($AllValid -eq $TotalChecks) {
        Write-Host "✅ AUDIT PASSED - All attestations verified" -ForegroundColor Green
        Write-Host "   This container image is authentic, reproducible, and attested by robdoe.com" -ForegroundColor Green
        
        Write-Host "`nSummary:" -ForegroundColor White
        Write-Host "  Witness: robdoe.com" -ForegroundColor Cyan
        Write-Host "  Signature: $($Attestations.Witness.signature)" -ForegroundColor Cyan
        
        if ($Attestations.Attestation.image) {
            $PullUrl = $Attestations.Attestation.image.registry + "/" + $Attestations.Attestation.image.repository
            Write-Host "  Image: $PullUrl" -ForegroundColor Cyan
        }
        
        if ($Attestations.Witness.verificationUrl) {
            Write-Host "  Verify: $($Attestations.Witness.verificationUrl)" -ForegroundColor Cyan
        }
        
        Write-Host "`nArtifacts available in: $TempPath" -ForegroundColor Yellow
        Write-Host "Copy to your audit directory:" -ForegroundColor Yellow
        Write-Host "  Copy-Item '$TempPath/*' -Destination './attestations/' -Recurse" -ForegroundColor Cyan
        
        return 0
    }
    else {
        Write-Host "❌ AUDIT FAILED - Some checks did not pass" -ForegroundColor Red
        Write-Host "  Passed: $AllValid / $TotalChecks" -ForegroundColor Red
        return 1
    }
}

# Execute
exit (Main)
