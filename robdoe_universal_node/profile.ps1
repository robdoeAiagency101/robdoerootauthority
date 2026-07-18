# ==============================================================================
# ROBDOE MONOLITH ENGINE v1.0 — SELF-TRACKING / SELF-SAVING / SELF-FILING SYSTEM
# ==============================================================================

# --- CORE PATHS (LOCAL ONLY — NO ONEDRIVE) ---
$MonolithRoot   = "C:\RobDoe-Monolith"
$StateFolder    = "$MonolithRoot\state"
$LogFolder      = "$MonolithRoot\logs"
$AgentFolder    = "$MonolithRoot\agents"
$RunLogFile     = "$LogFolder\runlog.txt"
$StateFile      = "$StateFolder\monolith-state.json"

# --- ENSURE FOLDERS EXIST ---
$Folders = @($MonolithRoot, $StateFolder, $LogFolder, $AgentFolder)
foreach ($F in $Folders) {
    if (-not (Test-Path $F)) { New-Item -ItemType Directory -Path $F -Force | Out-Null }
}

# --- MONOLITH STATE OBJECT ---
$MonolithState = [ordered]@{
    User        = $env:USERNAME
    Host        = $env:COMPUTERNAME
    Timestamp   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Wallet      = "0x1ae2af702063d304f8ebac2153c91d79c62e381c"
    Domains     = @("robdoe.com","robertdoe.pw","aiagency101.pw","aiagency101.xyo")
    Engine      = "E14 ORACLE • T800-AiGC"
    Agents      = @(
        @{ ID="AGENT-01"; Role="Network Proxy Gateway"; Task="TLS ingress to 34.42.100.71" },
        @{ ID="AGENT-02"; Role="Sentinel Worker";       Task="Process @LadbotOneLad automation" },
        @{ ID="AGENT-03"; Role="Storage Guard";         Task="Verify Hyper-V .avhdx integrity" },
        @{ ID="AGENT-04"; Role="Consensus Engine";      Task="Validate aiagency101.xyo state" }
    )
}

# --- SAVE STATE TO JSON ---
$MonolithState | ConvertTo-Json -Depth 5 | Out-File -FilePath $StateFile -Encoding UTF8 -Force

# --- WRITE RUN LOG ENTRY ---
$RunEntry = "[RUN] $($MonolithState.Timestamp) :: $($MonolithState.User)@$($MonolithState.Host)"
Add-Content -Path $RunLogFile -Value $RunEntry

# --- RENDER MONOLITH FRAME ---
Clear-Host
Write-Host ""
Write-Host "                    ●     ●" -ForegroundColor Green
Write-Host "                  ●   ●   ●" -ForegroundColor Green
Write-Host "                    ●     ●" -ForegroundColor Green
Write-Host ""
Write-Host "        ❤  HEART (4D) — GREEN" -ForegroundColor Green
Write-Host "        🔵 THROAT (5D) — BLUE" -ForegroundColor Blue
Write-Host "        👁  THIRD EYE — INDIGO" -ForegroundColor DarkBlue
Write-Host "        👑  CROWN — VIOLET" -ForegroundColor Magenta
Write-Host ""
Write-Host "        ▲  RIGHT-ANGLE TRIAD: 3D • 4D • 5D (ONE)" -ForegroundColor Cyan
Write-Host ""
Write-Host "        ⛓  ON-CHAIN IDENTITY MARK: HARD-LOCKED" -ForegroundColor Yellow
Write-Host ""
Write-Host "        Wallet: $($MonolithState.Wallet)" -ForegroundColor Cyan
Write-Host "        Domains:" -ForegroundColor Cyan
foreach ($D in $MonolithState.Domains) {
    Write-Host "           • $D" -ForegroundColor Gray
}
Write-Host ""
Write-Host "        Engine: $($MonolithState.Engine)" -ForegroundColor Green
Write-Host ""
Write-Host "        🤖  LLaMA COPILOT: ACTIVE • llama3.2:1b INSTALLED" -ForegroundColor Magenta
Write-Host ""
Write-Host "        --- ACTIVE AGENTS ---" -ForegroundColor Cyan

foreach ($A in $MonolithState.Agents) {
    Write-Host ("        [+] {0} | {1,-28} | {2}" -f $A.ID, $A.Role, $A.Task) -ForegroundColor Green
}

Write-Host ""
Write-Host "        State File: $StateFile" -ForegroundColor Yellow
Write-Host "        Run Log   : $RunLogFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "        [MONOLITH ENGINE ONLINE]" -ForegroundColor Green

# --- CUSTOM PROMPT ---
function prompt { "RobDoe Ai PS C:\> " }

