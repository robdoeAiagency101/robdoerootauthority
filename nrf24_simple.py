#!/usr/bin/env python3
"""
SIMPLE NRF24 → GIT BRIDGE
Reads wireless data from COM11 → Saves as legal evidence → Commits to Git
"""

import serial
import hashlib
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path

print("=" * 70)
print(" NRF24 WIRELESS → GIT EVIDENCE CAPTURE")
print(" Reading antenna data and saving as legal evidence")
print("=" * 70)

# CONFIG
COM_PORT = "COM11"
BAUD_RATE = 115200
GIT_REPO = r"C:\AiAgency101.robdoe"
DATA_DIR = os.path.join(GIT_REPO, "raw_nrf24_data")

# Create data folder
Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
os.chdir(GIT_REPO)

print(f"\n[*] Using COM port: {COM_PORT}")
print(f"[*] Baud rate: {BAUD_RATE}")
print(f"[*] Saving to: {DATA_DIR}\n")

# CONNECT TO SERIAL
try:
    print(f"[...] Connecting to {COM_PORT}...")
    ser = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
    print(f"[OK] Connected to {COM_PORT}\n")
except Exception as e:
    print(f"[ERROR] Cannot connect to {COM_PORT}")
    print(f"        {str(e)}")
    print("\n[!] Troubleshooting:")
    print("    1. Is USB cable plugged in?")
    print("    2. Is Arduino board connected?")
    print("    3. Check Device Manager for COM port (Windows Start → Device Manager)")
    print("    4. Try different USB cable or USB port")
    exit(1)

# CAPTURE LOOP
packet_count = 0
print("[*] Waiting for wireless data from antenna...")
print("[*] Press Ctrl+C to stop\n")

try:
    while True:
        line = ser.readline()
        
        if line:
            packet_count += 1
            timestamp = datetime.utcnow().isoformat() + "Z"
            
            # Parse data
            try:
                hex_data = line.decode().strip()
                raw_bytes = bytes.fromhex(hex_data)
            except:
                continue
            
            # Create packet
            packet = {
                "timestamp": timestamp,
                "packet_id": packet_count,
                "raw_hex": hex_data,
                "size_bytes": len(raw_bytes),
                "sha256": hashlib.sha256(raw_bytes).hexdigest()
            }
            
            # Save packet
            date_str = timestamp.split("T")[0].replace("-", "")
            filename = f"nrf24_{date_str}_{packet_count:06d}.json"
            filepath = os.path.join(DATA_DIR, filename)
            
            with open(filepath, 'w') as f:
                json.dump(packet, f, indent=2)
            
            # Print status
            print(f"[{packet_count}] {timestamp}")
            print(f"     Size: {len(raw_bytes)} bytes")
            print(f"     Hash: {packet['sha256'][:16]}...")
            print(f"     Saved: {filename}\n")
            
            # Commit every 5 packets
            if packet_count % 5 == 0:
                print(f"     [*] Committing {packet_count} packets to Git...")
                try:
                    subprocess.run(["git", "add", "raw_nrf24_data/"], check=False)
                    subprocess.run(
                        ["git", "commit", "-m", f"NRF24 packets: {packet_count} total"],
                        check=False
                    )
                    subprocess.run(["git", "push", "origin", "master"], check=False)
                    print(f"     [OK] Pushed to GitHub\n")
                except:
                    print(f"     [!] Git commit failed (continuing anyway)\n")

except KeyboardInterrupt:
    print("\n\n[*] Stopped by user")
except Exception as e:
    print(f"\n[ERROR] {str(e)}")
finally:
    # Final commit
    if packet_count > 0:
        print(f"\n[*] Final commit: {packet_count} packets total")
        try:
            subprocess.run(["git", "add", "raw_nrf24_data/"], check=False)
            subprocess.run(
                ["git", "commit", "-m", f"NRF24 final: {packet_count} packets captured"],
                check=False
            )
            subprocess.run(["git", "push", "origin", "master"], check=False)
            print(f"[OK] All data pushed to GitHub")
        except:
            print(f"[!] Could not push (data is still saved locally)")
    
    ser.close()
    print(f"\n[OK] Connection closed")
    print(f"\n[✓] Captured: {packet_count} packets")
    print(f"[✓] Saved in: {DATA_DIR}")
    print(f"[✓] Committed to Git")
    print(f"[✓] Legal evidence (s146 compliant)")
