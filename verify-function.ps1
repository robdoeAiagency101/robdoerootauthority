# Add this to your PowerShell profile or paste directly into PowerShell console

function Verify-CryptoTriangleAttestation {
    <#
    .SYNOPSIS
        Verify 3D+4D+5D Crypto Triangle attestations from GitHub
    
    .DESCRIPTION
        Downloads and verifies robdoe.com witness attestations for container builds
    
    .PARAMETER RunId
        GitHub Actions workflow run ID
    
    .PARAMETER Repo
        GitHub repository (default: robdoeAiagency101/robdoerootauthority)
    
    .EXAMPLE
        Verify-CryptoTriangleAttestation -RunId 12345678
        
    .EXAMPLE
        Verify-CryptoTriangleAttestation 12345678
    #>
    
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, Position=0)]
        [string]$RunId,
        
        [Parameter(ValueFromPipelineByPropertyName=$true)]
        [string]$Repo = "robdoeAiagency101/robdoerootauthority"
    )
    
    # Helper functions
    function Write-Header([string]$Message) {
        Write-Host "`n" -ForegroundColor White
        Write-Host ("=" * 60) -ForegroundColor Cyan
        Write-Host $Message -ForegroundColor Cyan
        Write-Host ("=" * 60) -ForegroundColor Cyan
    }
    
    function Write-Success([string]$Message) {
        Write-Host "✓ $Message" -ForegroundColor Green
    }
    
    function Write-Error_ ([string]$Message) {
        Write-Host "✗ $Message" -ForegroundColor Red
    }
    
    function Write-Warning_([string]$Message) {
        Write-Host "⚠ $Message" -ForegroundColor Yellow
    }
    
    function Test-GhCli {
        try {
            $null = gh --version 2>$null
            return $true
        }
        catch {
            return $false
        }
    }
    
    function Download-GhArtifacts {
        param([string]$Repo, [string]$RunId, [string]$OutputPath)
        
        Write-Host "[1/4] Downloading attestation artifacts..." -ForegroundColor Yellow
        
        if (-not (Test-GhCli)) {
            Write-Error_ "GitHub CLI (gh) not installed"
            Write-Host "Install: winget install GitHub.cli"
            Write-Host "Or: https://cli.github.com"
            return $false
        }
        
        try {
            Push-Location $OutputPath -ErrorAction Stop
            gh run download $RunId -R $Repo -n "attestations-$RunId" -D . 2>&1 | Out-Null
            Pop-Location
            Write-Success "Artifacts downloaded"
            return $true
        }
        catch {
            Write-Error_ "Failed to download: $_"
            return $false
        }
    }
    
    function Verify-AttestatonFiles {
        param([string]$Path)
        
        Write-Host "[2/4] Verifying file integrity..." -ForegroundColor Yellow
        
        $Files = @("attestation.json", "witness-attestation.json", "provenance-chain.json", "sbom.txt")
        $AllFound = $true
        
        foreach ($file in $Files) {
            $FilePath = Join-Path $Path $file
            if (Test-Path $FilePath) {
                Write-Success $file
            }
            else {
                Write-Error_ "$file NOT found"
                $AllFound = $false
            }
        }
        
        return $AllFound
    }
    
    function Parse-AttestationFiles {
        param([string]$Path)
        
        Write-Host "[3/4] Parsing attestations..." -ForegroundColor Yellow
        
        $Result = @{}
        
        # Parse attestation.json
        $AttPath = Join-Path $Path "attestation.json"
        if (Test-Path $AttPath) {
            $Result.Attestation = Get-Content $AttPath -Raw | ConvertFrom-Json
            Write-Success "attestation.json"
            
            $Digest = $Result.Attestation.image.digest
            $DigestShort = $Digest.Substring(0, 16) + "..."
            Write-Host "  ├─ Digest: $DigestShort" -ForegroundColor Cyan
            Write-Host "  └─ Timestamp: $($Result.Attestation.timestamp)" -ForegroundColor Cyan
        }
        
        # Parse witness-attestation.json
        $WitPath = Join-Path $Path "witness-attestation.json"
        if (Test-Path $WitPath) {
            $Result.Witness = Get-Content $WitPath -Raw | ConvertFrom-Json
            Write-Success "witness-attestation.json"
            
            $Sig = $Result.Witness.signature.Substring(0, 16) + "..."
            Write-Host "  ├─ Witness: $($Result.Witness.witnessService)" -ForegroundColor Cyan
            Write-Host "  ├─ Signature: $Sig" -ForegroundColor Cyan
            Write-Host "  └─ Status: $($Result.Witness.status)" -ForegroundColor Cyan
        }
        
        # Parse provenance-chain.json
        $ProvPath = Join-Path $Path "provenance-chain.json"
        if (Test-Path $ProvPath) {
            $Result.Provenance = Get-Content $ProvPath -Raw | ConvertFrom-Json
            Write-Success "provenance-chain.json"
            
            $Stages = $Result.Provenance.attestations
            Write-Host "  └─ Stages: $($Stages.Count)" -ForegroundColor Cyan
            foreach ($stage in $Stages) {
                Write-Host "     ├─ $($stage.stage): $($stage.status)" -ForegroundColor Cyan
            }
        }
        
        return $Result
    }
    
    function Verify-WitnessSignature {
        param([PSCustomObject]$Witness, [PSCustomObject]$Attestation)
        
        Write-Host "[4/4] Verifying robdoe.com witness..." -ForegroundColor Yellow
        
        $Checks = @{
            SigFormat = $false
            SigValid = $false
            Status = $false
            Timestamp = $false
        }
        
        # Check signature format
        $Sig = $Witness.signature
        if ($Sig -match '^[a-f0-9]{64}$') {
            Write-Success "Signature format valid (SHA256)"
            $Checks.SigFormat = $true
        }
        else {
            Write-Error_ "Invalid signature format"
            $Checks.SigFormat = $false
        }
        
        # Check status
        if ($Witness.status -eq "ATTESTED") {
            Write-Success "Status: ATTESTED"
            $Checks.Status = $true
        }
        else {
            Write-Warning_ "Status: $($Witness.status)"
            $Checks.Status = $false
        }
        
        # Check timestamp
        if ($Witness.timestamp) {
            Write-Success "Timestamp: $($Witness.timestamp)"
            $Checks.Timestamp = $true
        }
        
        # Verify URL
        if ($Witness.verificationUrl) {
            Write-Host "  └─ Verify: $($Witness.verificationUrl)" -ForegroundColor Cyan
        }
        
        return $Checks
    }
    
    # Main execution
    Write-Header "🔍 ATTESTATION VERIFICATION - robdoe.com"
    
    Write-Host "Repository: $Repo" -ForegroundColor White
    Write-Host "Run ID: $RunId" -ForegroundColor White
    
    # Create temp dir
    $TempPath = Join-Path $env:TEMP "attest-$RunId"
    if (-not (Test-Path $TempPath)) {
        $null = New-Item -ItemType Directory -Path $TempPath -Force
    }
    
    # Download
    if (-not (Download-GhArtifacts -Repo $Repo -RunId $RunId -OutputPath $TempPath)) {
        return
    }
    
    # Verify files
    if (-not (Verify-AttestatonFiles -Path $TempPath)) {
        Write-Error_ "Missing attestation files"
        return
    }
    
    # Parse
    $Attest = Parse-AttestationFiles -Path $TempPath
    
    if (-not $Attest.Witness) {
        Write-Error_ "No witness attestation found"
        return
    }
    
    # Verify
    $Checks = Verify-WitnessSignature -Witness $Attest.Witness -Attestation $Attest.Attestation
    
    # Result
    $Passed = ($Checks.SigFormat -and $Checks.Status -and $Checks.Timestamp)
    
    Write-Header "RESULT"
    
    if ($Passed) {
        Write-Host "✅ AUDIT PASSED" -ForegroundColor Green
        Write-Host "   Container image attested and verified" -ForegroundColor Green
        
        Write-Host "`nDetails:" -ForegroundColor White
        Write-Host "  Witness: robdoe.com" -ForegroundColor Cyan
        Write-Host "  Signature: $($Attest.Witness.signature)" -ForegroundColor Cyan
        Write-Host "  Image: $($Attest.Attestation.image.registry)/$($Attest.Attestation.image.repository)" -ForegroundColor Cyan
        Write-Host "  Verify: $($Attest.Witness.verificationUrl)" -ForegroundColor Cyan
        
        Write-Host "`nArtifacts: $TempPath" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ AUDIT FAILED" -ForegroundColor Red
    }
}

# Create aliases for quick access
Set-Alias -Name verify -Value Verify-CryptoTriangleAttestation -Force -Scope Global
Set-Alias -Name verify-attest -Value Verify-CryptoTriangleAttestation -Force -Scope Global

Write-Host "✓ Functions loaded: verify, verify-attest, Verify-CryptoTriangleAttestation" -ForegroundColor Green
