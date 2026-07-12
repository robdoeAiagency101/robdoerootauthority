# Windows Setup & Verification Guide

## Installation

### Prerequisites

- **GitHub CLI** (gh) — Required for downloading artifacts
- **PowerShell** — Windows 10+ or PowerShell Core 7+
- **Git** — For cloning and pushing

### Install GitHub CLI (Windows)

**Option 1: Chocolatey**
```powershell
choco install gh
```

**Option 2: Scoop**
```powershell
scoop install gh
```

**Option 3: Direct Download**
Download from https://cli.github.com and run installer

**Option 4: Winget**
```powershell
winget install GitHub.cli
```

### Verify Installation

```powershell
gh --version
```

### Authenticate

```powershell
gh auth login
```

Select:
- GitHub.com
- HTTPS
- Generate new token
- Copy to browser, authorize, paste token

## Usage

### Windows PowerShell (Recommended)

```powershell
# Set execution policy (one-time)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser

# Verify attestations
.\verify-attestation-chain.ps1 -Repo "robdoeAiagency101/robdoerootauthority" -RunId "12345678"
```

### Windows Command Prompt (cmd)

```cmd
# Simple batch wrapper
verify-attestation-chain.bat 12345678

# Or quick verify
quick-verify.bat 12345678
```

### PowerShell Core (Cross-Platform)

```pwsh
./verify-attestation-chain.ps1 -Repo "robdoeAiagency101/robdoerootauthority" -RunId "12345678"
```

## Finding Run ID

1. Go to: https://github.com/robdoeAiagency101/robdoerootauthority/actions
2. Click latest "Build → Attest → Push → Witness" workflow
3. Run ID is in the URL: `...runs/12345678`
4. Or use: `gh run list -R robdoeAiagency101/robdoerootauthority`

## Example Verification Session

```powershell
PS C:\robdoe> .\verify-attestation-chain.ps1 -Repo "robdoeAiagency101/robdoerootauthority" -RunId "12345678"

==================================================
🔍 ATTESTATION CHAIN VERIFICATION - robdoe.com Witness
==================================================

Repository: robdoeAiagency101/robdoerootauthority
Workflow Run: 12345678

[1/4] Downloading attestation artifacts from GitHub...
✓ Artifacts downloaded

[2/4] Verifying file integrity...
✓ attestation.json found
✓ witness-attestation.json found
✓ provenance-chain.json found
✓ sbom.txt found

[3/4] Parsing attestations...
✓ attestation.json parsed
  Image Digest: sha256:abcd1234...
  Timestamp: 2026-05-31T07:15:03Z
✓ witness-attestation.json parsed
  Witness: robdoe.com
  Signature: a1b2c3d4e5f6...
  Status: ATTESTED
✓ provenance-chain.json parsed
  Attestation stages: 3
    ├─ BUILD: COMPLETED
    ├─ PUSH: PUSHED
    ├─ WITNESS: ATTESTED

[4/4] Verifying robdoe.com witness attestation...
✓ Witness signature format valid (SHA256 hex)
✓ Attestation status: ATTESTED
✓ Timestamp: 2026-05-31T07:15:03Z
  Verify at: https://robdoe.com/verify/a1b2c3d4e5f6...

==================================================
✅ AUDIT PASSED - All attestations verified
   This container image is authentic, reproducible, and attested by robdoe.com

Summary:
  Witness: robdoe.com
  Signature: a1b2c3d4e5f6789...
  Image: ghcr.io/robdoeAiagency101/crypto-triangle
  Verify: https://robdoe.com/verify/a1b2c3d4e5f6789...

Artifacts available in: C:\Users\robdoe\AppData\Local\Temp\attestation-verify-12345678
Copy to your audit directory:
  Copy-Item 'C:\Users\robdoe\AppData\Local\Temp\attestation-verify-12345678/*' -Destination './attestations/' -Recurse
```

## Troubleshooting

### "gh not found" or "GitHub CLI not in PATH"

Install GitHub CLI (see Installation section above)

Verify:
```powershell
gh --version
```

### "Attestation files not found"

Run ID may be incorrect. List recent runs:
```powershell
gh run list -R robdoeAiagency101/robdoerootauthority
```

### "Execution Policy" Error

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
```

### "ConvertFrom-Json" Error

Update PowerShell:
```powershell
# Windows PowerShell 5.1+ required
$PSVersionTable.PSVersion

# Or install PowerShell Core 7+
winget install PowerShell
```

## Security Notes

1. **Verify Signature**: Always check signature matches robdoe.com witness
2. **Check Timestamps**: Ensure build and witness timestamps match
3. **Audit Trail**: Keep attestation artifacts for compliance
4. **Chain of Custody**: All stages (BUILD → PUSH → WITNESS) must complete
5. **Expiration**: Attestations valid for 1 year (8760 hours)

## Automation (Windows Task Scheduler)

Schedule daily attestation verification:

```powershell
# Create task
$Action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\path\to\verify-attestation-chain.ps1 -RunId `$(gh run list -R robdoeAiagency101/robdoerootauthority -L 1 --json databaseId -q '.[0].databaseId')"

$Trigger = New-ScheduledTaskTrigger -Daily -At 08:00am

Register-ScheduledTask -Action $Action -Trigger $Trigger -TaskName "Verify-Crypto-Triangle-Attestations"
```

## Files

- `verify-attestation-chain.ps1` — Main PowerShell verification script
- `verify-attestation-chain.bat` — Windows batch wrapper
- `quick-verify.bat` — One-command shortcut
- `WINDOWS_SETUP.md` — This guide
