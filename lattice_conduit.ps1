# ============================================================================
# ROBDOE // Identity Lattice Decode Conduit — Complete E14 Sovereign Engine
# ============================================================================
$Seal = "ROBDOE_E14_CORE_v1"

$global:UnifiedFieldState = [System.Collections.Concurrent.ConcurrentDictionary[string, object]]::new()

$workspaceDir = "D:\RobDoe\atmospheric-truth-layer"
$LedgerPath   = Join-Path $workspaceDir "derived_data"
$WitnessPath  = Join-Path $workspaceDir "derived_data"

if (-not (Test-Path $LedgerPath)) { New-Item -ItemType Directory -Path $LedgerPath -Force | Out-Null }

$LedgerFile   = Join-Path $LedgerPath  "Execution_Ledger.csv"
$WitnessFile  = Join-Path $WitnessPath "Execution_Ledger_Witness.csv"

$Header = "Timestamp,NodeID,WalletID,SHA1028x8201AHS_Fingerprint,Prev_SHA256,PulseClass,OperatorSeal,EvalRating,RawPayload"
if (-not (Test-Path $LedgerFile))  { Set-Content -Path $LedgerFile  -Value $Header -Encoding Unicode }
if (-not (Test-Path $WitnessFile)) { Set-Content -Path $WitnessFile -Value $Header -Encoding Unicode }

function Get-SHA1028x8201AHS {
    param([string]$InputStr)
    $encoding = [System.Text.Encoding]::Unicode
    $sha      = [System.Security.Cryptography.SHA256]::Create()
    $initLabel = $encoding.GetBytes("AHS-INIT-ATMOS-E14")
    $msgBytes  = $encoding.GetBytes($InputStr)
   
    $Buffer = New-Object byte[] ($initLabel.Length + $msgBytes.Length)
    [System.Buffer]::BlockCopy($initLabel, 0, $Buffer, 0, $initLabel.Length)
    [System.Buffer]::BlockCopy($msgBytes, 0, $Buffer, $initLabel.Length, $msgBytes.Length)
    $state     = $sha.ComputeHash($Buffer)

    $iterLabel = $encoding.GetBytes("COMP-E14-8201")
    for ($i = 1; $i -le 8201; $i++) {
        $ctr   = [System.BitConverter]::GetBytes([uint32]$i)
        $LoopBuffer = New-Object byte[] ($state.Length + $ctr.Length + $iterLabel.Length)
        [System.Buffer]::BlockCopy($state, 0, $LoopBuffer, 0, $state.Length)
        [System.Buffer]::BlockCopy($ctr, 0, $LoopBuffer, $state.Length, $ctr.Length)
        [System.Buffer]::BlockCopy($iterLabel, 0, $LoopBuffer, ($state.Length + $ctr.Length), $iterLabel.Length)
        $state = $sha.ComputeHash($LoopBuffer)
    }

    $allBytes = New-Object System.Collections.Generic.List[byte]
    for ($j = 0; $j -lt 5; $j++) {
        $ctrJ  = [System.BitConverter]::GetBytes([uint32]$j)
        $BlockBuffer = New-Object byte[] ($state.Length + $ctrJ.Length)
        [System.Buffer]::BlockCopy($state, 0, $BlockBuffer, 0, $state.Length)
        [System.Buffer]::BlockCopy($ctrJ, 0, $BlockBuffer, $state.Length, $ctrJ.Length)
        $block = $sha.ComputeHash($BlockBuffer)
        $allBytes.AddRange($block)
    }

    $hex = -join ($allBytes | ForEach-Object { $_.ToString("X2") })
    return $hex.Substring(0, 257)
}

function Attach-LatticeIdentity {
    param($Decoded, [double]$GlobalOmega, [string]$OperatorSeal)
    $ExecutionTimer = [System.Diagnostics.Stopwatch]::StartNew()
    $NodeId    = "E14_" + $env:COMPUTERNAME
    $WalletId  = "0x1ae2af702063d304f8ebac2153c91d79c62e381c"
    $DeploymentDomain = "robdoe.com"
    $Timestamp = $Decoded.WitnessTime

    $NitrogenPct = 78.084
    $OxygenPct   = 20.946
    $CarbonD02Ppm = [Math]::Round((420.0 + (Get-Random -Min -50 -Max 50) / 10), 2)
    $HydrogenPpm  = [Math]::Round((0.55 + (Get-Random -Min -5 -Max 5) / 100), 4)
   
    $PayloadString = "ROBDOE_E14_ATOM_TICK|Domain:{0}|Node:{1}|Wallet:{2}|Time:{3}|N2:{4}%|O2:{5}%|CO2:{6}ppm|H2:{7}ppm|Seal:{8}" -f `
        $DeploymentDomain, $NodeId, $WalletId, $Timestamp, $NitrogenPct, $OxygenPct, $CarbonD02Ppm, $HydrogenPpm, $OperatorSeal

    $Fingerprint = Get-SHA1028x8201AHS -InputStr $PayloadString
    $PrevHash = "INITIAL_GENESIS_BLOCK"
    
    if (Test-Path $LedgerFile) {
        $LastLine = Get-Content $LedgerFile -Encoding Unicode | Select-Object -Last 1
        if ($LastLine -and $LastLine -notmatch "^Timestamp") {
            $Parts = $LastLine.Split(',')
            if ($Parts.Count -ge 4) { $PrevHash = $Parts[3].Trim('"') }
        }
    }

    if ($CarbonD02Ppm -gt 423.0)     { $PulseClass = "E14_ELEV_CARBON" }
    elseif ($CarbonD02Ppm -lt 417.0) { $PulseClass = "E14_LOW_CARBON"  }
    else                             { $PulseClass = "E14_COMP_STABLE" }

    $kValue = [double]($Decoded.CoherenceK -replace 'K=','')
    $LocalDrift = [Math]::Round((1.0000 - $kValue), 4)
    $UnifiedDriftDelta = [Math]::Round(($LocalDrift - $GlobalOmega), 4)

    $ExecutionTimer.Stop()
    $ByteVelocity = [System.Text.Encoding]::Unicode.GetBytes($PayloadString).Length
    $EvalRating = if ($ByteVelocity -gt 250 -and $LocalDrift -le 0.0010) { "MATRIX_E14_OPTIMAL" } else { "MATRIX_STANDARD" }

    $CsvLine = '"' + "${Timestamp}" + '","' + "${NodeId}" + '","' + "${WalletId}" + '","' + "${Fingerprint}" + '","' + "${PrevHash}" + '","' + "${PulseClass}" + '","' + "${OperatorSeal}" + '","' + "${EvalRating}" + '","' + "${PayloadString}" + '"'
    $CsvLine | Out-File -FilePath $LedgerFile -Append -Encoding Unicode

    Write-Host "`n⚡ [LATTICE DECODE CONDUIT ENGAGED]" -ForegroundColor Green
    Write-Host "│ [+] Fingerprint AHS: ${Fingerprint}" -ForegroundColor Green
    Write-Host "│ [+] Molecular CO2  : ${CarbonD02Ppm} ppm" -ForegroundColor Yellow
    Write-Host "│ [+] Evaluation     : ${EvalRating} (${ByteVelocity} Bytes)" -ForegroundColor Cyan
}

# Native Test Execution Trigger
$FakeFrame = [PSCustomObject]@{ WitnessTime = [DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"); CoherenceK = "1.0000" }
Attach-LatticeIdentity -Decoded $FakeFrame -GlobalOmega 0.0000 -OperatorSeal $Seal
