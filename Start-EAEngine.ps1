param(
    [string]$Layer
)

function Show-Menu {
    Write-Host 'EA_ENGINE Launcher'
    Write-Host '1) 00_CORE'
    Write-Host '2) 10_MEGAMESH'
    Write-Host '3) 20_LEDGER'
    Write-Host '4) 30_COMPUTE'
    Write-Host '5) 40_STORAGE'
    Write-Host '6) 50_ENERGY_GRID'
    Write-Host '7) 60_OBSERVABILITY'
    Write-Host 'Q) Quit'
}

if (-not $Layer) {
    Show-Menu
    $Layer = Read-Host 'Select layer'
}

switch ($Layer) {
    '1' { Set-Location 'C:\EA_ENGINE\00_CORE' }
    '2' { Set-Location 'C:\EA_ENGINE\10_MEGAMESH' }
    '3' { Set-Location 'C:\EA_ENGINE\20_LEDGER' }
    '4' { Set-Location 'C:\EA_ENGINE\30_COMPUTE' }
    '5' { Set-Location 'C:\EA_ENGINE\40_STORAGE' }
    '6' { Set-Location 'C:\EA_ENGINE\50_ENERGY_GRID' }
    '7' { Set-Location 'C:\EA_ENGINE\60_OBSERVABILITY' }
    'Q' { return }
    default { Write-Host 'Invalid selection'; return }
}
