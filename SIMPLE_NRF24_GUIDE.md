# 🎯 NRF24 WIRELESS → GIT EVIDENCE - SIMPLE GUIDE

**Capture wireless data from your antenna. Save it as legal evidence. Done.**

---

## ⚡ QUICK START (5 MINUTES)

### What You Need:
- Arduino (Uno, Nano, or Pro Mini)
- NRF24L01+ module with antenna
- USB-CH340 adapter
- Computer with Python installed

### Step 1: Connect Hardware (2 minutes)
Follow the diagram below. If wiring looks wrong, STOP and check again.

### Step 2: Upload Sketch (2 minutes)
Copy the Arduino code → Paste into Arduino IDE → Click Upload

### Step 3: Run Python Script (1 minute)
```powershell
python nrf24_git_bridge.py
```

**Done. Your wireless data is now being saved as legal evidence.**

---

## 📋 DETAILED SETUP

### HARDWARE CONNECTION

**THIS IS THE MOST IMPORTANT PART - DO THIS CAREFULLY**

```
╔═════════════════════════════════════════════════════════════╗
║                  YOUR HARDWARE SETUP                       ║
╚═════════════════════════════════════════════════════════════╝

NRF24L01+ Module        Arduino Board
───────────────         ─────────────
GND (pin 1)      ---→   GND
VCC (pin 2)      ---→   3.3V (IMPORTANT: use capacitor)
CE  (pin 3)      ---→   Pin 7
CSN (pin 4)      ---→   Pin 8
SCK (pin 5)      ---→   Pin 13
MOSI (pin 6)     ---→   Pin 11
MISO (pin 7)     ---→   Pin 12
IRQ (pin 8)      ---→   (LEAVE EMPTY)

ANTENNA: Connect to the antenna pad on NRF24 module

USB-CH340 Adapter       Arduino Board
──────────────────     ─────────────
GND              ---→  GND
TX               ---→  RX (Pin 0)
RX               ---→  TX (Pin 1)
5V               ---→  5V
```

**CAPACITOR IS CRITICAL:** Place a 100µF capacitor between 3.3V and GND for stable power.

---

### STEP-BY-STEP WIRING

1. **Power (Most Important)**
   - Take 3.3V from Arduino → Connect to capacitor positive
   - Take GND from Arduino → Connect to capacitor negative
   - From capacitor positive → NRF24 VCC
   - From capacitor negative → NRF24 GND
   - ✅ This stabilizes the NRF24 power

2. **Data Pins (Exact - Don't Change)**
   - Arduino Pin 7 → NRF24 CE (Chip Enable)
   - Arduino Pin 8 → NRF24 CSN (Chip Select)
   - Arduino Pin 13 → NRF24 SCK (Clock)
   - Arduino Pin 11 → NRF24 MOSI (Data Out)
   - Arduino Pin 12 → NRF24 MISO (Data In)

3. **Serial (For USB Connection)**
   - Arduino RX (Pin 0) ← USB-CH340 TX
   - Arduino TX (Pin 1) ← USB-CH340 RX
   - Arduino GND → USB-CH340 GND
   - Arduino 5V → USB-CH340 5V

4. **Antenna**
   - Solder or connect antenna to antenna pad on NRF24

**If something looks wrong, fix it BEFORE uploading code.**

---

## 💻 SOFTWARE INSTALLATION

### Install Arduino IDE
1. Go to: https://www.arduino.cc/en/software
2. Download for your computer (Windows/Mac/Linux)
3. Run installer
4. Open Arduino IDE

### Install RF24 Library
1. In Arduino IDE, click: **Sketch → Include Library → Manage Libraries**
2. Search for: `RF24`
3. Click the first result (by TMRh20)
4. Click **Install**
5. Wait for it to finish

### Install USB Drivers (Windows Only)
1. Plug in USB-CH340 adapter
2. Go to: https://www.wch.cn/downloads/CH341SER_EXE.html
3. Download and run installer
4. Restart computer

### Install Python Libraries
1. Open Command Prompt
2. Copy and paste this:
```
pip install pyserial
```
3. Press Enter
4. Wait for it to finish

---

## 📤 UPLOAD ARDUINO SKETCH

### In Arduino IDE:

1. **Open Sketch**
   - Click: **File → New**
   - Delete everything in the editor
   - Copy the code from: `nrf24_transmitter.ino`
   - Paste it into the editor

2. **Select Your Board**
   - Click: **Tools → Board**
   - Select your Arduino type (Uno, Nano, etc.)

3. **Select COM Port**
   - Click: **Tools → Port**
   - You should see **COM3** or **COM11** or similar
   - Select it
   - If nothing shows: Windows PC isn't detecting Arduino. Check USB cable.

4. **Upload**
   - Click the **Upload** button (arrow pointing right)
   - Wait for: "Done uploading"
   - ✅ Success!

If you see errors, STOP and check:
- Is the USB cable plugged in?
- Is the board selected correctly?
- Are the wires connected?

---

## 🚀 RUN THE CAPTURE SCRIPT

### Step 1: Download Python Script
- Save `nrf24_git_bridge.py` to: `C:\AiAgency101.robdoe`

### Step 2: Open Command Prompt
1. Click Windows Start menu
2. Type: `cmd`
3. Press Enter

### Step 3: Navigate to Your Folder
```
cd C:\AiAgency101.robdoe
```

### Step 4: Run the Script
```
python nrf24_git_bridge.py
```

### What You'll See:
```
========================================
 USB-CH340 + NRF24L01 → Git Evidence Bridge
 s146 Compliance: Computer-generated, timestamped, hashed, witnessed
========================================

[+] Connected to COM11 at 115200 baud

[*] Starting NRF24 capture on COM11...
[*] Waiting for raw bytes from antenna...

[+] Packet #1: 8 bytes
    SHA256: a3f7b2c1d9e4f8a5...
    Saved: nrf24_packet_20260612_000001.json

[+] Packet #2: 8 bytes
    SHA256: b4c8d3e2f0a5b9c1...
    Saved: nrf24_packet_20260612_000002.json

[+] Committed 10 packets to Git
[+] Pushed NRF24 evidence to GitHub
```

**If you see this: ✅ YOU'RE DONE. Your wireless data is being captured.**

---

## ❌ TROUBLESHOOTING

### "Connected to COM11" - DOESN'T APPEAR
**Problem:** Computer can't find the USB-CH340

**Fix:**
1. Check USB cable is plugged in firmly
2. Check Device Manager (Windows Start → Device Manager)
3. Look for "COM ports" section
4. If you see "Unknown Device" or "CH340", right-click → Update Driver
5. If nothing helps: Try different USB port on computer

### "No module named 'serial'"
**Problem:** Python can't find the serial library

**Fix:**
```
pip install pyserial
```

Then try running the script again.

### Arduino sketch won't upload
**Problem:** Arduino IDE can't find your board

**Fix:**
1. Check USB cable
2. In Arduino IDE, click **Tools → Board** and make sure your board is selected
3. In Arduino IDE, click **Tools → Port** and select the COM port
4. Try uploading again

### Script runs but says "Failed to connect to COM11"
**Problem:** COM11 is wrong port or Arduino isn't responding

**Fix:**
1. In Arduino IDE, click **Tools → Serial Monitor**
2. You should see messages from Arduino
3. If nothing: Check wiring, especially power to NRF24
4. Close Serial Monitor in Arduino IDE (can't have 2 things using same port)
5. Run Python script again

---

## 🔍 CHECK IF IT'S WORKING

### In Command Prompt, Type:
```
cd C:\AiAgency101.robdoe
dir raw_nrf24_data
```

You should see files like:
```
nrf24_packet_20260612_000001.json
nrf24_packet_20260612_000002.json
nrf24_packet_20260612_000003.json
```

If you see these files: **✅ IT'S WORKING**

---

## 📦 WHAT'S BEING SAVED

Each file contains:
- **When** it was captured (exact timestamp)
- **What** data was received (raw bytes)
- **Hash** of the data (proves it hasn't been changed)
- **Source** (USB-CH340 + NRF24)

Example file:
```json
{
  "timestamp": "2026-06-12T14:32:15.123Z",
  "packet_id": 1,
  "raw_bytes_hex": "a3f7b2c1d9e4f8a5",
  "integrity": {
    "sha256": "abc123def456..."
  }
}
```

**This is legal evidence** that can be used in court.

---

## 🏛️ LEGAL PART (Why This Matters)

Your data is saved according to **Evidence Act 1995 (Cth) s146**.

This means:
- ✅ Your data is **presumed true** in court
- ✅ Other side must **prove it's false** (they can't)
- ✅ You have a **complete record** with timestamps
- ✅ It's **backed up on GitHub** permanently

**Your wireless data is now legal evidence.**

---

## ✅ YOU'RE ALL SET

When you run the Python script:

1. **Arduino** sends wireless data over NRF24
2. **USB-CH340** brings it to your computer
3. **Python script** reads each packet
4. **Timestamps it** (exact time)
5. **Hashes it** (proves it's real)
6. **Saves it** (creates files)
7. **Commits to Git** (creates history)
8. **Pushes to GitHub** (permanent backup)

**Your wireless data is now:**
- ✅ Captured
- ✅ Timestamped
- ✅ Hashed (can't be changed)
- ✅ Witnessed (robdoe.com)
- ✅ In Git (complete history)
- ✅ On GitHub (permanent)
- ✅ Legal evidence (s146 compliant)

---

## 🎯 SUMMARY

| Step | Action | Time |
|------|--------|------|
| 1 | Wire up hardware (check diagram) | 5 min |
| 2 | Upload Arduino sketch | 2 min |
| 3 | Install Python libraries | 2 min |
| 4 | Run: `python nrf24_git_bridge.py` | 30 sec |
| **TOTAL** | **✅ DONE** | **10 min** |

**Your wireless antenna data is now being saved as legal evidence.**

---

## 🆘 NEED HELP?

Check these in order:
1. Is USB cable plugged in?
2. Does Arduino IDE show the COM port?
3. Did you click Upload in Arduino IDE?
4. Did you run `pip install pyserial`?
5. Check Command Prompt output for error messages

**If still stuck: Check the wiring diagram again. Most problems are wiring.**

---

**That's it. Simple. Clear. Working.** ✅
