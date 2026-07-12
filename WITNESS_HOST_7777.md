# WITNESS HOST 7777:7777

**Port 7777 as witness authority - receives attestations from containers**

---

## 🚀 RUN NOW

```bash
docker compose -f docker-compose-witness-7777.yml up -d
```

---

## ✅ WHAT HAPPENS

```
Witness Host 7777
    ↓ (robdoe.com)
Receives attestations from containers
    ↓
Signs each attestation (SHA256)
    ↓
Returns witness signature
    ↓
Container stores signature
    ↓
✅ WITNESSED
```

---

## 📊 ENDPOINTS

### Health Check
```bash
curl http://localhost:7777/health
```

### Post Attestation
```bash
curl -X POST http://localhost:7777/attest \
  -H "Content-Type: application/json" \
  -d '{
    "container_id": "data-acq-123",
    "image_digest": "sha256:abc123...",
    "timestamp": "2026-06-12T14:32:15Z",
    "manifest_hash": "fa1c3b7d...",
    "data": {}
  }'
```

### Verify Signature
```bash
curl http://localhost:7777/verify/fa1c3b7d29ffb474f3ed52417369f6f08db3857
```

---

## 📋 CONTAINERS RUNNING

```bash
docker ps
```

Shows:
```
witness-host-7777      (port 7777)
data-acq-witness       (port 8000, connected to witness)
```

---

## 🔐 WHAT YOU GET

✅ Witness host on port 7777
✅ Receives container attestations
✅ Signs with robdoe.com authority
✅ Verifiable signatures
✅ Complete audit trail
✅ s146 compliant

---

## ✨ THAT'S IT

```bash
docker compose -f docker-compose-witness-7777.yml up -d
```

Done. Port 7777 is your witness authority. 🚀
