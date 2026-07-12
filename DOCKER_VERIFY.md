# Docker Attestation Verification - Reproducible & Portable

Complete Docker-based verification for 3D+4D+5D cryptographic triangle attestations.

## Quick Start

### Linux / macOS
```bash
chmod +x verify-docker.sh
./verify-docker.sh 12345678
```

### Windows (PowerShell)
```powershell
.\verify-docker.bat 12345678
```

### Any Platform (Direct)
```bash
docker build -f 3d4d5d-crypto-core/Dockerfile.verify -t verifier .
docker run --rm verifier 12345678
```

---

## What It Does

1. Builds minimal verification container (Python 3.12-slim + GitHub CLI)
2. Downloads attestation artifacts from GitHub
3. Verifies all files present
4. Parses JSON attestations
5. Displays build information
6. Verifies robdoe.com witness signature
7. Returns exit code (0=pass, 1=fail)

---

## Container Image

**`Dockerfile.verify`** — Reproducible verification container:
- Base: `python:3.12-slim` (120MB)
- Includes: GitHub CLI, curl, ca-certificates
- Non-root user: `verifier` (UID 1000)
- Pinned versions for reproducibility
- Health check included

**Output size**: ~200MB (deterministic)

---

## Usage Examples

### Verify Single Run
```bash
docker run --rm \
  crypto-triangle-verifier:latest \
  12345678
```

### With Custom Repo
```bash
docker run --rm \
  -e REPO="your-org/your-repo" \
  crypto-triangle-verifier:latest \
  12345678 your-org/your-repo
```

### Save Artifacts
```bash
docker run --rm \
  -v attestations:/attestations \
  crypto-triangle-verifier:latest \
  12345678
```

### Interactive Verification
```bash
docker run -it --rm \
  crypto-triangle-verifier:latest \
  bash
```

Then inside container:
```bash
python verify-attestation.py 12345678
```

---

## Docker Compose

Run full system (API + Verifier + Witness):

```bash
docker-compose -f 3d4d5d-crypto-core/docker-compose.prod.yml up
```

Services:
- **crypto-triangle** (API): Port 8000
- **verifier** (Attestation): Artifact verification
- **witness** (robdoe.com): Attestation signing

---

## Output Example

```
======================================================================
🔍 3D+4D+5D CRYPTO TRIANGLE - ATTESTATION VERIFICATION
    robdoe.com Witness Service
======================================================================

Repository: robdoeAiagency101/robdoerootauthority
Run ID: 12345678

[1/5] Downloading artifacts (Run: 12345678)
✓ Artifacts downloaded to /tmp/attest-12345678-xyz

[2/5] Verifying files
✓ attestation.json (2541 bytes)
✓ witness-attestation.json (856 bytes)
✓ provenance-chain.json (1200 bytes)
✓ sbom.txt (3421 bytes)

[3/5] Parsing attestations
✓ attestation.json parsed
✓ witness-attestation.json parsed
✓ provenance-chain.json parsed
✓ sbom.txt read (8 dependencies)

[4/5] Build Information
    Image Digest: sha256:abcd1234567890abcdef1234567890abcdef
    Registry: ghcr.io
    Repository: robdoeAiagency101/crypto-triangle
    Tags: main-sha-abc123, latest
    Timestamp: 2026-05-31T07:15:03Z

[5/5] Verifying robdoe.com Witness
✓ Signature format valid (SHA256 hex)
✓ Status: ATTESTED
✓ Verify URL: https://robdoe.com/verify/a1b2c3d4...

    Provenance Chain:
      ✓ BUILD: COMPLETED
      ✓ PUSH: PUSHED
      ✓ WITNESS: ATTESTED

======================================================================
✓ ATTESTATION VERIFIED
    Container is authentic, reproducible, and
    attested by robdoe.com
======================================================================

✓ Witness: robdoe.com
✓ Signature: a1b2c3d4e5f6789abcdef1234567890abcdef
✓ Image: ghcr.io/robdoeAiagency101/crypto-triangle@sha256:abcd1234567890
✓ Verify: https://robdoe.com/verify/a1b2c3d4e5f6789abcdef1234567890

Artifacts saved: /tmp/attest-12345678-xyz
```

**Exit code**: 0 (success)

---

## Reproducibility

### Build Reproducibly
```bash
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -f 3d4d5d-crypto-core/Dockerfile.verify \
  -t crypto-triangle-verifier:1.0.0 \
  3d4d5d-crypto-core
```

Same source code → identical digest guaranteed.

### Verify Image
```bash
docker image inspect crypto-triangle-verifier:latest
```

Check digest and layers for reproducibility.

---

## GitHub Enterprise

Set environment variable:

```bash
export GITHUB_ENTERPRISE_URL=https://github.company.com

docker run --rm \
  -e GITHUB_ENTERPRISE_URL=$GITHUB_ENTERPRISE_URL \
  crypto-triangle-verifier:latest \
  12345678
```

---

## CI/CD Integration

### GitHub Actions
```yaml
- name: Verify attestation
  run: |
    docker build -f 3d4d5d-crypto-core/Dockerfile.verify \
      -t verifier .
    docker run --rm verifier ${{ github.run_id }}
```

### GitLab CI
```yaml
verify:
  image: docker:latest
  script:
    - docker build -f 3d4d5d-crypto-core/Dockerfile.verify -t verifier .
    - docker run --rm verifier $CI_PIPELINE_ID
```

### Local
```bash
./verify-docker.sh 12345678
```

---

## Exit Codes

- `0` — Attestation verified successfully
- `1` — Verification failed (check logs)
- `2` — GitHub CLI not available
- `3` — Required files missing

---

## Troubleshooting

### "Docker not found"
Install Docker: https://docs.docker.com/get-docker/

### "GitHub CLI not found in image"
Container includes `gh` CLI. If error persists:
```bash
docker run --rm verifier gh --version
```

### "Cannot authenticate"
Authenticate locally first:
```bash
gh auth login
docker run --rm \
  -v ~/.config/gh:/root/.config/gh:ro \
  verifier 12345678
```

### "Download failed"
Check internet and GitHub access:
```bash
docker run --rm verifier bash
# Inside container:
gh auth status
gh run list -R robdoeAiagency101/robdoerootauthority
```

---

## Files

- `3d4d5d-crypto-core/Dockerfile.verify` — Verification container
- `3d4d5d-crypto-core/verify-attestation.py` — Verification script
- `verify-docker.sh` — Linux/macOS wrapper
- `verify-docker.bat` — Windows wrapper
- `3d4d5d-crypto-core/docker-compose.prod.yml` — Full stack
- `DOCKER_VERIFY.md` — This guide

---

## Production Use

**Share container with your team:**

```bash
# Tag and push
docker tag crypto-triangle-verifier:latest \
  ghcr.io/your-org/crypto-triangle-verifier:1.0.0

docker push ghcr.io/your-org/crypto-triangle-verifier:1.0.0

# Others use:
docker run --rm \
  ghcr.io/your-org/crypto-triangle-verifier:1.0.0 \
  <RUN_ID>
```

---

**Status**: Production Ready ✓  
**Reproducible**: Yes (deterministic builds)  
**Portable**: Any system with Docker  
**Enterprise Ready**: GitHub Enterprise support included
