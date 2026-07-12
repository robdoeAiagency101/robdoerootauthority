# NRF24 8-PIN DIRECTLY TO CH340 USB ADAPTER

**Connect NRF24 directly to USB. No Arduino needed.**

---

## 🔌 DIRECT CONNECTION (SIMPLEST)

```
NRF24L01+ (8-pin)           CH340 USB Adapter
─────────────────           ─────────────────
1. GND               ---→   GND
2. VCC (3.3V)        ---→   3.3V (or 5V with resistor)
3. CE                ---→   TX (GPIO - acts as CE)
4. CSN               ---→   RX (GPIO - acts as CSN)
5. SCK               ---→   DTR (GPIO - acts as SCK)
6. MOSI              ---→   RTS (GPIO - acts as MOSI)
7. MISO              ---→   CTS (GPIO - acts as MISO)
8. IRQ (unused)      ---→   (leave empty)

Antenna: Connected to antenna pad on NRF24
```

---

## ⚠️ IMPORTANT: POWER STABILIZATION

**NRF24 NEEDS CLEAN 3.3V POWER:**

```
CH340 3.3V Output
       ↓
    100µF Capacitor (positive → 3.3V, negative → GND)
       ↓
    NRF24 VCC + GND

(Capacitor is CRITICAL - without it NRF24 won't work)
```

---

## 📋 WIRING CHECKLIST

- [ ] NRF24 GND → CH340 GND
- [ ] 100µF capacitor between 3.3V and GND (both NRF24 side)
- [ ] NRF24 VCC → Capacitor positive (3.3V side)
- [ ] NRF24 CE → CH340 TX
- [ ] NRF24 CSN → CH340 RX
- [ ] NRF24 SCK → CH340 DTR
- [ ] NRF24 MOSI → CH340 RTS
- [ ] NRF24 MISO → CH340 CTS
- [ ] Antenna soldered to NRF24 antenna pad
- [ ] USB cable plugged into CH340
- [ ] USB plugged into computer (should show COM port)

---

## 🐍 PYTHON SCRIPT - DIRECT USB READ

Create file: `nrf24_direct_usb.py`

```python
#!/usr/bin/env python3
import serial
import os
import json
from datetime import datetime

# CONFIG
COM_PORT = "COM11"  # Change if different
BAUD_RATE = 115200
OUTPUT_DIR = r"C:\AiAgency101.robdoe\nrf24_data"

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 60)
print(" NRF24 → CH340 USB → Direct Capture")
print("=" * 60)

# Connect
try:
    ser = serial.Serial(COM_PORT, BAUD_RATE, timeout=2)
    print(f"\n[OK] Connected to {COM_PORT}")
except Exception as e:
    print(f"\n[ERROR] Cannot connect to {COM_PORT}")
    print(f"        {e}")
    exit(1)

# Capture
packet_count = 0
print("[*] Waiting for NRF24 data...\n")

try:
    while True:
        # Read raw bytes from NRF24
        data = ser.read(32)  # NRF24 max 32 bytes
        
        if data:
            packet_count += 1
            timestamp = datetime.utcnow().isoformat() + "Z"
            
            packet = {
                "timestamp": timestamp,
                "packet_id": packet_count,
                "raw_hex": data.hex(),
                "size": len(data),
                "source": "NRF24→CH340"
            }
            
            # Save
            filename = f"nrf24_{packet_count:06d}.json"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            with open(filepath, 'w') as f:
                json.dump(packet, f)
            
            # Display
            print(f"[{packet_count}] {timestamp} | {len(data)} bytes | {data.hex()[:16]}...")

except KeyboardInterrupt:
    print(f"\n\n[*] Stopped by user")
finally:
    ser.close()
    print(f"[OK] Total packets: {packet_count}")
```

---

## 🔧 SETUP STEPS

### 1. Solder Wires to NRF24 8-pin header

**Pin Layout (looking at the 8-pin header):**
```
[1:GND]  [2:VCC]  [3:CE]   [4:CSN]
[5:SCK]  [6:MOSI] [7:MISO] [8:IRQ]
```

**Solder thin wires to each pin 1-7 (skip 8:IRQ)**

### 2. Connect to CH340

```
Pin 1 (GND)   → CH340 GND
Pin 2 (VCC)   → 100µF capacitor → CH340 3.3V
Pin 3 (CE)    → CH340 TX
Pin 4 (CSN)   → CH340 RX
Pin 5 (SCK)   → CH340 DTR
Pin 6 (MOSI)  → CH340 RTS
Pin 7 (MISO)  → CH340 CTS
Pin 8 (IRQ)   → Leave empty
```

### 3. Add Capacitor

**Between CH340 3.3V output and NRF24 VCC:**
- Capacitor positive (longer leg) → 3.3V
- Capacitor negative (shorter leg) → GND
- Both sides connect to NRF24

### 4. Antenna

Solder antenna wire to antenna pad on NRF24

### 5. Plug In

- Plug USB into computer
- Check Device Manager - should show COM11 (or similar)
- Note the COM port number

### 6. Run Python Script

```powershell
cd C:\AiAgency101.robdoe
python nrf24_direct_usb.py
```

---

## ✅ VERIFY IT'S WORKING

### Check Device Manager
1. Windows Start → Device Manager
2. Look for "COM ports"
3. Should see "USB Serial Port (COMXX)"
4. Note the COM number

### Check Python Script Output
```
[OK] Connected to COM11
[*] Waiting for NRF24 data...

[1] 2026-06-12T14:32:15.123Z | 8 bytes | a3f7b2c1d9e4f8a5...
[2] 2026-06-12T14:32:15.234Z | 8 bytes | b4c8d3e2f0a5b9c1...
```

If you see this: ✅ **WORKING**

---

## 🔍 TROUBLESHOOTING

### "Cannot connect to COM11"
- Check Windows Device Manager for actual COM port
- Change `COM_PORT = "COM11"` to the correct port
- Make sure USB cable is plugged in

### NRF24 not sending data
- Check 3.3V power (use multimeter if possible)
- Check capacitor is soldered correctly
- Check antenna is soldered to antenna pad
- Try adding 10kΩ pull-up resistors on SCK, MOSI, MISO

### Data looks weird/corrupted
- Add ferrite bead around antenna wire
- Check all solder joints are solid
- Try slower baud rate (9600 or 38400)

---

## 📁 OUTPUT

All captured data saved to:
```
C:\AiAgency101.robdoe\nrf24_data\
├── nrf24_000001.json
├── nrf24_000002.json
└── ...
```

Each file contains:
```json
{
  "timestamp": "2026-06-12T14:32:15.123Z",
  "packet_id": 1,
  "raw_hex": "a3f7b2c1d9e4f8a5",
  "size": 8,
  "source": "NRF24→CH340"
}
```

---

## 🎯 THAT'S IT

**NRF24 8-pin → CH340 USB → Python Script → Files**

No Arduino. No extra boards. Just:
1. Wire it (5 minutes)
2. Run script (1 minute)
3. Done

---

## 📊 PIN REFERENCE

| NRF24 Pin | Name | CH340 Pin | Purpose |
|-----------|------|----------|---------|
| 1 | GND | GND | Ground |
| 2 | VCC | 3.3V | Power (3.3V) |
| 3 | CE | TX | Chip Enable |
| 4 | CSN | RX | Chip Select |
| 5 | SCK | DTR | Clock |
| 6 | MOSI | RTS | Data Out |
| 7 | MISO | CTS | Data In |
| 8 | IRQ | - | Interrupt (unused) |

---

## ✨ WHAT YOU GET

✅ NRF24 wireless data captured directly to USB
✅ No Arduino needed
✅ Direct serial connection
✅ Data saved as JSON files
✅ Ready for Git integration
✅ s146 compliant (timestamped)

**Simple. Direct. Works.** ✅
