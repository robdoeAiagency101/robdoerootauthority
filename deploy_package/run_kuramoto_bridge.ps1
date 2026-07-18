$comPort = "COM11"
$baudRate = 115200     # Locked transmission speed
$frequencyMHz = 40    # Physical substrate frequency
$outputChannel = "C:\SPACE\deploy_package\circulation_macro_015"

Write-Host "[KURAMOTO COUPLING]: Initializing phase-lock matrix on $comPort ($baudRate Baud @ $frequencyMHz MHz)..." -ForegroundColor Cyan

# Establish bare-metal connection to the physical USB-CH340 serial line
$port = New-Object System.IO.Ports.SerialPort $comPort, $baudRate, None, 8, one
try {
    $port.Open()
    Write-Host "[PHASE-LOCK ACTIVE]: Oscillators coupled cleanly. Absorbing raw radio signals..." -ForegroundColor Green
} catch {
    Write-Host "[COUPLING ERROR]: Port $comPort busy or disconnected. Verify physical substrate connection." -ForegroundColor Red
    exit
}

# The 0.05 micro-pulse absorption loop
while ($port.IsOpen) {
    if ($port.BytesToRead -gt 0) {
        $rawSignal = $port.ReadLine()
        $timestamp = (Get-Date -Format "yyyyMMdd_HHmmss_fff")
        $fileName = "phase_packet_$timestamp.raw"
        $targetFile = Join-Path $outputChannel $fileName
        
        # Capture raw coupled bytes direct to the macro circulation path
        $rawSignal | Out-File -FilePath $targetFile -Encoding ascii -Force
        Write-Host "[0.05 MICRO PULSE]: Absorbed coupled phase packet -> $fileName" -ForegroundColor Green
    }
    Start-Sleep -Milliseconds 50
}
