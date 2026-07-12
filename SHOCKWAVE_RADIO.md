# ⚡ SHOCKWAVE RADIO - PORT 11 RAW BYTES TO GIT

**USB-CH340 on PORT 11 + NRF24 → Capture raw RF → Git push (bare, unfiltered)**

---

## 🚀 RUN NOW

```bash
cd C:\AiAgency101.robdoe
python shockwave_radio.py
```

---

## ⚡ WHAT HAPPENS

```
PORT 11 (COM11) Connected
    ↓
NRF24 Antenna receives RF
    ↓
Raw bytes captured
    ↓
Timestamped (millisecond precision)
    ↓
Hashed (SHA256)
    ↓
Saved to shockwave_raw/
    ↓
Auto Git commit (every 10 packets)
    ↓
Auto Git push to GitHub
    ↓
✅ COMPLETE AUDIT TRAIL
```

---

## 📊 OUTPUT

```
▓▓▓ [1] 2026-06-12T14:32:15.123Z
    Bytes: 8 | Data: a3f7b2c1d9e4f8a5
    Hash: a3f7b2c1d9e4f8a5...

▓▓▓ [2] 2026-06-12T14:32:15.234Z
    Bytes: 8 | Data: b4c8d3e2f0a5b9c1
    Hash: b4c8d3e2f0a5b9c1...

[⚡] SHOCKWAVE PUSH to Git (10 packets)...
[⚡] PUSHED
```

---

## 📁 FILES CREATED

```
C:\AiAgency101.robdoe\shockwave_raw\
├── raw_20260612_000001.json
├── raw_20260612_000002.json
├── raw_20260612_000003.json
└── ...
```

Each file:
```json
{
  "id": 1,
  "ts": "2026-06-12T14:32:15.123Z",
  "unix": 1748899535,
  "port": "COM11",
  "raw": "a3f7b2c1d9e4f8a5",
  "len": 8,
  "sha256": "a3f7b2c1d9e4f8a5b3c2d1e0f9g8h7i6"
}
```

---

## ✅ VERIFY

### Check files created:
```bash
dir C:\AiAgency101.robdoe\shockwave_raw\
```

### Check Git:
```bash
git log --oneline
git status
```

### Check GitHub:
```
https://github.com/robdoeAiagency101/robdoerootauthority
```

---

## 🔐 WHAT YOU GET

✅ Raw RF bytes from PORT 11
✅ Bare (unfiltered) capture
✅ Timestamps (ISO-8601 + Unix)
✅ Hashes (SHA256 integrity)
✅ Auto Git commits
✅ Auto GitHub pushes
✅ Immutable audit trail
✅ s146 legal evidence

---

## ⚡ THAT'S IT

```bash
python shockwave_radio.py
```

Done. Raw bytes flowing to Git. 🚀
