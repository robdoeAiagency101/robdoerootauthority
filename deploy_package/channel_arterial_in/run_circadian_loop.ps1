$arterialPath = "C:\SPACE\deploy_package\channel_arterial_in"
$venousPath = "C:\SPACE\deploy_package\channel_venous_out"

Write-Host "Circadian rhythm clock synchronized. Monitoring circulation loops..." -ForegroundColor Cyan

while ($true) {
    # 1. Get the current system hour to track the circadian rhythm
    $currentHour = (Get-Date).Hour
    
    # 2. Define the rhythm cycle parameters based on time of day
    if ($currentHour -ge 6 -and $currentHour -lt 22) {
        # DAY PHASE (06:00 - 22:00): High-velocity circulation loop
        $delay = 100 # Fast processing (100 milliseconds)
        
        $signals = Get-ChildItem -Path $arterialPath -Filter "*.raw"
        foreach ($signal in $signals) {
            $targetPath = Join-Path $venousPath $signal.Name
            # Circulate raw signal down the channel instantly
            Move-Item -Path $signal.FullName -Destination $targetPath -Force
            Write-Host "[DAY CYCLE - ACTIVE CIRCULATION]: Channeled signal $($signal.Name)" -ForegroundColor Green
        }
    } else {
        # NIGHT PHASE (22:00 - 06:00): Maintenance, stabilization, and history compression
        $delay = 5000 # Low-energy pulse (5 seconds)
        Write-Host "[NIGHT CYCLE - REST & STABILIZATION]: Executing environment maintenance..." -ForegroundColor Blue
        
        # Automatically compress or clean any old logs resting in the venous out directory
        $oldLogs = Get-ChildItem -Path $venousPath -Filter "*.clean"
        foreach ($log in $oldLogs) {
            if ($log.LastWriteTime -lt (Get-Date).AddDays(-1)) {
                Remove-Item $log.FullName -Force
                Write-Host "Purged expired cellular data log: $($log.Name)" -ForegroundColor Yellow
            }
        }
    }
    
    Start-Sleep -Milliseconds $delay
}
