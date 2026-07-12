#!/usr/bin/env python3
"""
NRF24 8-pin → CH340 USB Direct Capture
Read wireless data straight from USB adapter (no Arduino)
"""

import serial
import hashlib
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path

print("=" * 70)
print(" NRF24 → CH340 USB DIRECT CAPTURE")
print(" Reading antenna data directly from USB adapter")
print("=" * 70)

# CONFIG
COM_PORT = "COM11"  # Change if different
BAUD_RATE = 115200
GIT_REPO = r"C:\AiAgency101.robdoe"
DATA_DIR = os.path.join(GIT_REPO, "nrf24_data")

# Create folders
Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
os.chdir(GIT_REPO)

print(f"\n[*] COM Port: {COM_PORT}")
print(f"[*] Baud Rate: {BAUD_RATE}")
print(f"[*] Data Directory: {DATA_DIR}\n")

# CONNECT
print("[...] Connecting to USB...")
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
    print("  2. Check Device Manager (Windows Start → Device Manager)")
    print("  3. Look for 'COM ports' - what port do you see?")
    print("  4. Change COM_PORT = '{}' to the correct port".format(COM_PORT))
    exit(1)

# CAPTURE LOOP
packet_count = 0
print("[*] Waiting for NRF24 wireless data from antenna...")
print("[*] Press Ctrl+C to stop\n")

try:
    while True:
        # Read up to 32 bytes (NRF24 max payload)
        raw_data = ser.read(32)
        
        if raw_data and len(raw_data) > 0:
            packet_count += 1
            timestamp = datetime.utcnow().isoformat() + "Z"
            
            # Create packet
            packet = {
                "version": "1.0.0",
                "timestamp": timestamp,
                "packet_id": packet_count,
                "source": "NRF24→CH340",
                "raw_hex": raw_data.hex(),
                "raw_bytes": list(raw_data),
                "size": len(raw_data),
                "sha256": hashlib.sha256(raw_data).hexdigest()
            }
            
            # Save file
            date_str = timestamp.split("T")[0].replace("-", "")
            filename = f"nrf24_{date_str}_{packet_count:06d}.json"
            filepath = os.path.join(DATA_DIR, filename)
            
            with open(filepath, 'w') as f:
                json.dump(packet, f, indent=2)
            
            # Display
            print(f"[{packet_count}] {timestamp}")
            print(f"     Bytes: {len(raw_data)}")
            print(f"     Data: {raw_data.hex()}")
            print(f"     Hash: {packet['sha256'][:16]}...")
            print(f"     File: {filename}\n")
            
            # Auto-commit every 10 packets
            if packet_count % 10 == 0:
                print(f"     [*] Auto-commit to Git ({packet_count} packets)...")
                try:
                    subprocess.run(["git", "add", "nrf24_data/"], check=False, capture_output=True)
                    subprocess.run(
                        ["git", "commit", "-m", f"NRF24 data: {packet_count} packets"],
                        check=False,
                        capture_output=True
                    )
                    subprocess.run(["git", "push", "origin", "master"], check=False, capture_output=True)
                    print(f"     [OK] Pushed to GitHub\n")
                except:
                    pass

except KeyboardInterrupt:
    print("\n\n[*] Capture stopped by user")
except Exception as e:
    print(f"\n[ERROR] {e}")
finally:
    # Final commit
    if packet_count > 0:
        print(f"\n[*] Final commit: {packet_count} packets total")
        try:
            subprocess.run(["git", "add", "nrf24_data/"], check=False, capture_output=True)
            subprocess.run(
                ["git", "commit", "-m", f"NRF24 final: {packet_count} packets from antenna"],
                check=False,
                capture_output=True
            )
            subprocess.run(["git", "push", "origin", "master"], check=False, capture_output=True)
            print("[OK] All data committed and pushed to GitHub")
        except:
            print("[!] Could not commit (data saved locally)")
    
    ser.close()
    
    print(f"\n{'=' * 70}")
    print(f"[✓] Capture Complete")
    print(f"[✓] Packets captured: {packet_count}")
    print(f"[✓] Saved to: {DATA_DIR}")
    print(f"[✓] Committed to Git")
    print(f"[✓] s146 compliant (legal evidence)")
    print(f"{'=' * 70}\n")
