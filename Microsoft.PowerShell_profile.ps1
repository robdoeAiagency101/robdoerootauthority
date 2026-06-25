# --- ROBDOE LEDGER DEED HYBRID (BTC TRUE + UNISWAP + THETA) ---

$cfgPath = "C:\robdoerootauthority\.robdoe\mesh-config.json"
$cfg     = Get-Content $cfgPath -Raw | ConvertFrom-Json

$CorporateEntity   = $cfg.CorporateEntity
$OpCommander       = $cfg.OpCommander
$BitcoinDeedAnchor = $cfg.BitcoinDeedAnchor
$HybridWallets     = $cfg.HybridWallets -join ", "
$UniswapEVM        = $cfg.UniswapEVM
$UniswapSol        = $cfg.UniswapSol
$ThetaLiquidDeed   = $cfg.ThetaLiquidDeed
$MeshNodeId        = $cfg.MeshNodeId
$LatticeId         = $cfg.LatticeId
$SecRegistry       = $cfg.SecRegistry

$PayloadString = "${CorporateEntity}:${OpCommander}:${SecRegistry}:${MeshNodeId}:${LatticeId}:${BitcoinDeedAnchor}:${ThetaLiquidDeed}:${UniswapEVM}:${UniswapSol}"

Write-Host ""
Write-Host "Executing RobDoe Ledger Deed Hybrid Layer..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Entity:            $CorporateEntity" -ForegroundColor Yellow
Write-Host "  Commander:         $OpCommander"
Write-Host "  Mesh Node:         $MeshNodeId"
Write-Host "  Lattice ID:        $LatticeId"
Write-Host "  Sec Registry:      $SecRegistry"
Write-Host ""
Write-Host "  Bitcoin Deed:      $BitcoinDeedAnchor" -ForegroundColor Green
Write-Host "  Hybrid Wallets:    $HybridWallets"
Write-Host ""
Write-Host "  Uniswap (EVM):     $UniswapEVM"
Write-Host "  Uniswap (Solana):  $UniswapSol"
Write-Host "  Theta Liquid Deed: $ThetaLiquidDeed"
Write-Host ""
Write-Host "  Payload:           $PayloadString"
Write-Host ""

Write-Host "--- UNLOCKED SYSTEM HARDWARE ENTITIES ---" -ForegroundColor Yellow

try {
    Get-PnpDevice | Where-Object {
        $_.Status -eq "OK" -and ($_.InstanceId -like "PCI*" -or $_.InstanceId -like "USB*")
    } | ForEach-Object {
        $id     = $_.InstanceId
        $status = $_.Status
        $name   = $_.FriendlyName
        Write-Host "  -> Node ID: $id | Status: $status | Name: $name"
    }
}
catch {
    Write-Host "  -> Hardware enumeration unavailable in this context." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Operational Rule: BTC deed anchor binds Uniswap liquidity, Theta liquid deed, hybrid wallets, and physical mesh immutably." -ForegroundColor Green
Write-Host ""
