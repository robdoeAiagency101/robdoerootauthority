# 3D+4D+5D Crypto Triangle - Easy Setup (All Platforms)

## Fastest Setup (1 Command)

### Windows PowerShell / Core
```powershell
iex (irm https://raw.githubusercontent.com/robdoeAiagency101/robdoerootauthority/main/setup-verify.ps1)
```

### macOS / Linux
```bash
pwsh -c "iex (irm https://raw.githubusercontent.com/robdoeAiagency101/robdoerootauthority/main/setup-verify.ps1)"
```

### Or locally
```powershell
.\setup-verify.ps1
```

---

## What It Does

1. ✅ Checks GitHub CLI installed
2. ✅ Verifies authentication
3. ✅ Adds `verify` command to your shell
4. ✅ Lists recent workflow runs
5. ✅ Ready to use immediately

---

## After Setup

### List Recent Runs
```powershell
verify
```

Output shows:
```
📋 Recent workflow runs:
[12345678] Build → Attest → Push → Witness [completed]
[12345677] Build → Attest → Push → Witness [completed]
...
```

### Verify Specific Run
```powershell
verify 12345678
```

Output:
```
======================================================================
🔍 VERIFYING ATTESTATION
======================================================================

[1/5] Downloading artifacts...
✓ Downloaded

[2/5] Verifying files...
✓ attestation.json (2541 bytes)
✓ witness-attestation.json (856 bytes)
✓ provenance-chain.json (1200 bytes)
✓ sbom.txt (3421 bytes)

[3/5] Parsing attestations...
✓ All attestations parsed

[4/5] Build Information:
  Image Digest: sha256:abcd1234567890...
  Registry: ghcr.io
  Repository: robdoeAiagency101/crypto-triangle
  Tags: main-sha-abc123, latest
  Timestamp: 2026-05-31T07:15:03Z

[5/5] Verifying robdoe.com Witness:
  Witness Service: robdoe.com
  Signature: a1b2c3d4e5f6...
  Status: ATTESTED
  ✓ Signature valid (SHA256)
  ✓ Status: ATTESTED
  
  Provenance Chain:
    ✓ BUILD: COMPLETED
    ✓ PUSH: PUSHED
    ✓ WITNESS: ATTESTED
  
  ✓ SBOM: 8 dependencies

======================================================================
✅ ATTESTATION VERIFIED
   Container is authentic, reproducible, and attested by robdoe.com
======================================================================

Attest Details:
  Witness: robdoe.com
  Signature: a1b2c3d4e5f6789abcdef...
  Image: ghcr.io/robdoeAiagency101/crypto-triangle@sha256:abcd1234567890
  Verify: https://robdoe.com/verify/a1b2c3d4e5f6789abcdef...

Artifacts saved: C:\Users\robdoe\AppData\Local\Temp\attest-verify-12345678
```

---

## GitHub Enterprise Support

Automatically detects enterprise GitHub:

```powershell
$env:GITHUB_ENTERPRISE_URL = "https://github.company.com"
.\setup-verify.ps1
```

Or authenticate first:
```powershell
gh auth login --hostname github.company.com
```

---

## Requirements

- **GitHub CLI** (gh): https://cli.github.com
- **PowerShell 5.1+** (Windows) or **PowerShell Core 7+** (any OS)
- **Internet connection** (to download artifacts)

---

## Troubleshooting

### "GitHub CLI not found"
```powershell
winget install GitHub.cli
```

### "Not authenticated"
```powershell
gh auth login
```

### "Script execution disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Cannot find path"
Run from repo directory:
```powershell
cd C:\path\to\robdoerootauthority
.\setup-verify.ps1
```

---

## Files

- `setup-verify.ps1` — One-command setup script
- `EASY_SETUP.md` — This guide

---

## For Enterprise Teams

**Share this command in your team docs:**

```
Run this once:

pwsh -c "iex (irm https://raw.githubusercontent.com/robdoeAiagency101/robdoerootauthority/main/setup-verify.ps1)"

Then use:

verify 12345678
```

**For GitHub Enterprise:**

```
pwsh -c '$env:GITHUB_ENTERPRISE_URL = "https://your-github.com"; iex (irm https://raw.githubusercontent.com/robdoeAiagency101/robdoerootauthority/main/setup-verify.ps1)'
```

---

## What Gets Installed

- ✅ `verify` command (aliases: `verify-attest`)
- ✅ Function: `Verify-Attestation`
- ✅ PowerShell profile entry (persistent)
- ✅ Zero dependencies beyond GitHub CLI

No bloatware. No system changes. Just a command that works.

---

**Status**: Production Ready ✓
