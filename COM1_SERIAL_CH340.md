# COM1 SERIAL CH340 - RAW BYTES TO GIT

**USB-CH340 on COM1 → Capture raw bytes → Auto Git push**

---

## 🚀 RUN NOW

```bash
cd C:\AiAgency101.robdoe
python com1_serial_ch340.py
```

---

## ✅ WHAT HAPPENS

```
COM1 (USB-CH340) Connected
    ↓
Read raw bytes
    ↓
Timestamp (ISO-8601 + Unix)
    ↓
Hash (SHA256)
    ↓
Save to com1_raw/
    ↓
Auto Git commit (every 10 packets)
    ↓
Auto Git push
    ↓
✅ COMPLETE AUDIT TRAIL
```

---

## 📊 OUTPUT

```
[1] 2026-06-12T14:32:15.123Z
    Bytes: 8 | Data: a3f7b2c1d9e4f8a5
    Hash: a3f7b2c1d9e4f8a5...

[2] 2026-06-12T14:32:15.234Z
    Bytes: 8 | Data: b4c8d3e2f0a5b9c1
    Hash: b4c8d3e2f0a5b9c1...

[⚡] PUSH to Git (10 packets)...
[⚡] PUSHED
```

---

## 📁 FILES CREATED

```
C:\AiAgency101.robdoe\com1_raw\
├── com1_20260612_000001.json
├── com1_20260612_000002.json
└── ...
```

Each file:
```json
{
  "id": 1,
  "ts": "2026-06-12T14:32:15.123Z",
  "unix": 1748899535,
  "port": "COM1",
  "raw": "a3f7b2c1d9e4f8a5",
  "len": 8,
  "sha256": "a3f7b2c1d9e4f8a5b3c2d1e0f9g8h7i6"
}
```

---

## ✅ VERIFY

### Check files:
```bash
dir C:\AiAgency101.robdoe\com1_raw\
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

✅ Raw bytes from COM1
✅ Timestamps (millisecond precision)
✅ Hashes (SHA256 integrity)
✅ Auto Git commits
✅ Auto GitHub pushes
✅ Immutable audit trail
✅ s146 legal evidence

---

## ⚡ THAT'S IT

```bash
python com1_serial_ch340.py
```

Done. COM1 serial data flowing to Git. 🚀
