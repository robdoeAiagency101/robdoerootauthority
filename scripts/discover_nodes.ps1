Write-Host "[ MULTI-CHANNEL BIO-LATTICE DISPATCHER ]" -ForegroundColor Cyan

# Force fresh collection of all active Windows COM slots
$ComPorts = [System.IO.Ports.SerialPort]::GetPortNames()

if ($ComPorts.Count -eq 0) {
    Write-Host "? No active physical or virtual COM layers detected on this hardware bus." -ForegroundColor Red
    return
}

# Determine live circadian tracking state based on real-world time variables
$CurrentHour = (Get-Date).Hour
$PhaseCommand = "SET_PHASE_REST" # Default Muladhara/Root baseline

if ($CurrentHour -ge 6 -and $CurrentHour -lt 12) {
    $PhaseCommand = "SET_PHASE_REST" # Standard boot alignment sequence
} elseif ($CurrentHour -ge 12 -and $CurrentHour -lt 18) {
    $PhaseCommand = "SET_PHASE_PEAK" # Manipura / Solar Power peak
} elseif ($CurrentHour -ge 18) {
    $PhaseCommand = "SET_PHASE_DESCENT" # Vishuddha / Cyan expression
}

Write-Host "? Current Bio-Time Node Context: Hour $CurrentHour -> Emitting: $PhaseCommand" -ForegroundColor Yellow
Write-Host "? Pinging global hardware array: ($($ComPorts -join ', '))" -ForegroundColor Gray

# Stream the target state across every discovered terminal interface simultaneously
foreach ($Port in $ComPorts) {
    $Serial = New-Object System.IO.Ports.SerialPort($Port, 115200, "None", 8, "One")
    $Serial.ReadTimeout = 1000
    $Serial.WriteTimeout = 1000

    try {
        $Serial.Open()
        Start-Sleep -Milliseconds 200
        
        # Flash the targeted circadian command string down the live pipeline
        $Serial.WriteLine($PhaseCommand)
        Start-Sleep -Milliseconds 100
        
        # Interrogate the hardware slot for verification telemetry
        $Response = $Serial.ReadExisting()
        if ($Response) {
            Write-Host "? [SUCCESS] Transaction accepted on interface $Port" -ForegroundColor Green
            $Response.Split("`n") | ? { $_.Trim() } | % { Write-Host "  + Node Broadcast: $_" -ForegroundColor DarkCyan }
        } else {
            Write-Host "? [BLIND FLASH] Dispatched state matrix to unverified port $Port" -ForegroundColor DarkGreen
        }
        $Serial.Close()
    } catch {
        Write-Host "  [-] Connection to endpoint $Port refused or locked by parallel sub-system." -ForegroundColor DarkGray
        if ($Serial.IsOpen) { $Serial.Close() }
    }
}
Write-Host "[ DISPATCH SEQUENCE SOLVED ]" -ForegroundColor Cyan
