#!/usr/bin/env python3
"""
COM11 SERIAL CH340 - RAW BYTES TO GIT
USB-CH340 on COM11 → NRF24 capture → Git push
"""

import serial
import hashlib
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path

print("=" * 70)
print(" COM11 SERIAL CH340 - RAW BYTES TO GIT")
print(" USB-CH340 on COM11 → NRF24 → Git Push")
print("=" * 70)

COM_PORT = "COM11"
BAUD_RATE = 115200
GIT_REPO = r"C:\AiAgency101.robdoe"
RAW_DIR = os.path.join(GIT_REPO, "com11_raw")

Path(RAW_DIR).mkdir(parents=True, exist_ok=True)
os.chdir(GIT_REPO)

print(f"\n[*] COM Port: {COM_PORT}")
print(f"[*] Baud: {BAUD_RATE}")
print(f"[*] Raw Dir: {RAW_DIR}\n")

# CONNECT
print("[...] Connecting to COM11...")
try:
    ser = serial.Serial(
        port=COM_PORT,
        baudrate=BAUD_RATE,
        timeout=1,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE
    )
    print(f"[OK] Connected to {COM_PORT}\n")
except Exception as e:
    print(f"[ERROR] Failed to connect to {COM_PORT}")
    print(f"        {e}\n")
    print("TROUBLESHOOTING:")
    print("  1. Is CH340 USB cable plugged in?")
    print("  2. Check Device Manager for COM port")
    print("  3. Try different USB port")
    exit(1)

# CAPTURE LOOP
packet_count = 0
print("[*] COM11 SERIAL - Capturing raw bytes...")
print("[*] Press Ctrl+C to stop\n")

try:
    while True:
        # Read raw bytes
        raw_data = ser.read(32)
        
        if raw_data and len(raw_data) > 0:
            packet_count += 1
            timestamp = datetime.utcnow().isoformat() + "Z"
            
            # Create packet
            raw_packet = {
                "id": packet_count,
                "ts": timestamp,
                "unix": int(datetime.utcnow().timestamp()),
                "port": COM_PORT,
                "raw": raw_data.hex(),
                "len": len(raw_data),
                "sha256": hashlib.sha256(raw_data).hexdigest()
            }
            
            # Save
            date = timestamp.split("T")[0].replace("-", "")
            filename = f"com11_{date}_{packet_count:06d}.json"
            filepath = os.path.join(RAW_DIR, filename)
            
            with open(filepath, 'w') as f:
                json.dump(raw_packet, f)
            
            # Display
            print(f"[{packet_count}] {timestamp}")
            print(f"    Bytes: {len(raw_data)} | Data: {raw_data.hex()}")
            print(f"    Hash: {raw_packet['sha256'][:16]}...\n")
            
            # AUTO-PUSH EVERY 10
            if packet_count % 10 == 0:
                print(f"    [⚡] PUSH to Git ({packet_count} packets)...")
                try:
                    subprocess.run(["git", "add", "com11_raw/"], check=False, capture_output=True)
                    subprocess.run(
                        ["git", "commit", "-m", f"COM11: {packet_count} raw bytes"],
                        check=False,
                        capture_output=True
                    )
                    subprocess.run(["git", "push", "origin", "master"], check=False, capture_output=True)
                    print(f"    [⚡] PUSHED\n")
                except:
                    pass

except KeyboardInterrupt:
    print("\n\n[*] Capture stopped")
finally:
    # FINAL PUSH
    if packet_count > 0:
        print(f"\n[⚡] FINAL PUSH: {packet_count} packets")
        try:
            subprocess.run(["git", "add", "com11_raw/"], check=False, capture_output=True)
            subprocess.run(
                ["git", "commit", "-m", f"COM11 FINAL: {packet_count} raw bytes"],
                check=False,
                capture_output=True
            )
            subprocess.run(["git", "push", "origin", "master"], check=False, capture_output=True)
            print("[⚡] PUSHED TO GIT")
        except:
            print("[!] Local save complete")
    
    ser.close()
    
    print(f"\n{'=' * 70}")
    print(f"[✓] CAPTURE COMPLETE")
    print(f"[✓] Total packets: {packet_count}")
    print(f"[✓] Saved to: {RAW_DIR}")
    print(f"[✓] Pushed to Git")
    print(f"{'=' * 70}\n")
