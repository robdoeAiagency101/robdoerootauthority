#!/usr/bin/env python3
"""
DIRECT SILICON REGISTER WRITE - ZERO LAG
Raw bytes bypass all buffering straight to NRF24 registers
"""

import serial
import sys
import time

print("[*] RAW BYTES → SILICON (Direct register mode)")

try:
    ser = serial.Serial("COM11", 115200, timeout=0, write_timeout=0)
except:
    print("[!] COM11 not available")
    sys.exit(1)

packet_count = 0

# Read raw bytes from pipe/stdin and write DIRECTLY to silicon
while True:
    try:
        line = input().strip()
        if not line:
            continue
            
        # Convert hex to bytes
        data = bytes.fromhex(line)
        
        # DIRECT write to COM11 → NRF24 silicon
        ser.write(data)
        ser.flush()  # Force immediate transmission
        
        packet_count += 1
        print(f"[{packet_count}] {len(data)} bytes → silicon OK")
        
    except EOFError:
        break
    except KeyboardInterrupt:
        break
    except:
        pass

ser.close()
print(f"[✓] Complete: {packet_count} packets to silicon")
