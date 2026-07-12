# PowerShell Quick Commands

Add these to your PowerShell profile for instant access.

## Option 1: Add Alias to PowerShell Profile

Open PowerShell and run:
```powershell
# Open profile in editor
notepad $PROFILE
```

Add these lines at the end:
```powershell
# 3D+4D+5D Attestation Verification
function Verify-Attestation {
    param(
        [Parameter(Mandatory=$true)]
        [string]$RunId,
        
        [string]$Repo = "robdoeAiagency101/robdoerootauthority"
    )
    
    & "$PSScriptRoot\..\verify-attestation-chain.ps1" -Repo $Repo -RunId $RunId
}

# Quick alias
Set-Alias -Name verify -Value Verify-Attestation -Force
Set-Alias -Name verify-attest -Value Verify-Attestation -Force
```

Save and reload PowerShell.

Then use:
```powershell
verify 12345678
verify-attest 12345678
```

## Option 2: Direct Command (Windows Command Prompt)

From the repo directory:
```cmd
run-verify.bat 12345678
```

Or from anywhere (if repo in PATH):
```cmd
run-verify 12345678
```

## Option 3: Direct PowerShell Command

From repo directory:
```powershell
.\verify-attestation-chain.ps1 -RunId 12345678
```

With full path:
```powershell
C:\path\to\verify-attestation-chain.ps1 -RunId 12345678
```

## Option 4: Add to System PATH (Permanent)

### Windows 10/11 GUI

1. Open Settings → System → About
2. Scroll down, click "Advanced system settings"
3. Click "Environment Variables..."
4. Under "User variables", click "New..."
5. Variable name: `REPO_PATH`
6. Variable value: `C:\path\to\robdoerootauthority`
7. Click OK, OK, OK
8. Restart PowerShell

Then use (from anywhere):
```cmd
%REPO_PATH%\run-verify.bat 12345678
```

### Command Line (Admin)

```cmd
setx PATH "%PATH%;C:\path\to\robdoerootauthority"
```

## Fastest Method

**Save this as `C:\Users\YourUsername\verify-robdoe.bat`:**

```batch
@echo off
cd /d "C:\path\to\robdoerootauthority"
call run-verify.bat %1
```

Then from anywhere:
```cmd
verify-robdoe.bat 12345678
```

Or create shortcut on Desktop pointing to it.

## Complete One-Liner (Copy-Paste Ready)

From your repo directory, open Command Prompt and paste:

```cmd
powershell -ExecutionPolicy Bypass -File verify-attestation-chain.ps1 -Repo "robdoeAiagency101/robdoerootauthority" -RunId 12345678
```

Replace `12345678` with your actual run ID.

## Finding Run ID Examples

### Using GitHub CLI
```cmd
gh run list -R robdoeAiagency101/robdoerootauthority
```

Output shows recent runs with their IDs.

### Using Browser
1. Navigate to: https://github.com/robdoeAiagency101/robdoerootauthority/actions
2. Click the latest "Build → Attest → Push → Witness" run
3. URL: `...runs/12345678` ← this is the Run ID

## Troubleshooting

**"PowerShell is not recognized"**
- Install from: https://github.com/PowerShell/PowerShell/releases
- Or: `winget install PowerShell`

**"Execution Policy Blocked"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**"GitHub CLI not found"**
```cmd
winget install GitHub.cli
```

Then authenticate:
```cmd
gh auth login
```

## Quickest Setup (5 minutes)

1. Install GitHub CLI: `winget install GitHub.cli`
2. Authenticate: `gh auth login`
3. Clone repo: `git clone https://github.com/robdoeAiagency101/robdoerootauthority.git`
4. Change directory: `cd robdoerootauthority`
5. Run verification:
   ```cmd
   run-verify.bat <YOUR_RUN_ID>
   ```

Done! Attestations verified.
