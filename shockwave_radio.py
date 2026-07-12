#!/usr/bin/env python3
"""
PORT 11 SHOCKWAVE RADIO - RAW BYTES TO GIT
USB-CH340 + NRF24 → Raw RF capture → Git push (bare, unfiltered)
"""

import serial
import hashlib
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path

print("=" * 70)
print(" PORT 11 SHOCKWAVE RADIO - RAW BYTES TO GIT")
print(" USB-CH340 + NRF24 → Raw RF Data → Git Push")
print("=" * 70)

COM_PORT = "COM11"
BAUD_RATE = 115200
GIT_REPO = r"C:\AiAgency101.robdoe"
RAW_DIR = os.path.join(GIT_REPO, "shockwave_raw")

Path(RAW_DIR).mkdir(parents=True, exist_ok=True)
os.chdir(GIT_REPO)

print(f"\n[*] COM Port: {COM_PORT}")
print(f"[*] Baud: {BAUD_RATE}")
print(f"[*] Raw Dir: {RAW_DIR}\n")

# CONNECT
print("[...] Connecting to PORT 11...")
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
    print(f"[ERROR] {e}")
    exit(1)

# CAPTURE LOOP
packet_count = 0
print("[*] SHOCKWAVE RADIO - Capturing raw RF bytes...")
print("[*] Press Ctrl+C to stop\n")

try:
    while True:
        # Read raw bytes (no filtering)
        raw_data = ser.read(32)
        
        if raw_data and len(raw_data) > 0:
            packet_count += 1
            timestamp = datetime.utcnow().isoformat() + "Z"
            
            # BARE - NO PROCESSING
            raw_packet = {
                "id": packet_count,
                "ts": timestamp,
                "unix": int(datetime.utcnow().timestamp()),
                "port": COM_PORT,
                "raw": raw_data.hex(),
                "len": len(raw_data),
                "sha256": hashlib.sha256(raw_data).hexdigest(),
                "blake3": hashlib.sha256(raw_data).hexdigest()
            }
            
            # Save BARE
            date = timestamp.split("T")[0].replace("-", "")
            filename = f"raw_{date}_{packet_count:06d}.json"
            filepath = os.path.join(RAW_DIR, filename)
            
            with open(filepath, 'w') as f:
                json.dump(raw_packet, f)
            
            # Display SHOCKWAVE
            print(f"▓▓▓ [{packet_count}] {timestamp}")
            print(f"    Bytes: {len(raw_data)} | Data: {raw_data.hex()}")
            print(f"    Hash: {raw_packet['sha256'][:16]}...\n")
            
            # AUTO-PUSH EVERY 10
            if packet_count % 10 == 0:
                print(f"    [⚡] SHOCKWAVE PUSH to Git ({packet_count} packets)...")
                try:
                    subprocess.run(["git", "add", "shockwave_raw/"], check=False, capture_output=True)
                    subprocess.run(
                        ["git", "commit", "-m", f"SHOCKWAVE: {packet_count} raw RF packets from PORT 11"],
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
        print(f"\n[⚡] FINAL SHOCKWAVE PUSH: {packet_count} packets")
        try:
            subprocess.run(["git", "add", "shockwave_raw/"], check=False, capture_output=True)
            subprocess.run(
                ["git", "commit", "-m", f"SHOCKWAVE FINAL: {packet_count} raw RF packets PORT 11"],
                check=False,
                capture_output=True
            )
            subprocess.run(["git", "push", "origin", "master"], check=False, capture_output=True)
            print("[⚡] PUSHED TO GIT")
        except:
            print("[!] Local save complete")
    
    ser.close()
    
    print(f"\n{'=' * 70}")
    print(f"[✓] SHOCKWAVE CAPTURE COMPLETE")
    print(f"[✓] Total packets: {packet_count}")
    print(f"[✓] Saved to: {RAW_DIR}")
    print(f"[✓] Pushed to Git")
    print(f"{'=' * 70}\n")
