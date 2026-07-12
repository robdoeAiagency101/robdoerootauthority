#!/usr/bin/env python3
"""
RECEIVE & STREAM STRAIGHT TO SILICON - NO LAG
COM11 → Read raw bytes → Write directly to NRF24 silicon
Zero processing, raw throughput
"""

import serial
import sys

print("[*] RAW BYTES RECEIVER → DIRECT SILICON")
print("[*] COM11 (receive) → NRF24 (transmit) - NO LAG\n")

try:
    # Open COM11 for raw byte passthrough
    ser = serial.Serial(
        "COM11",
        115200,
        timeout=0,
        write_timeout=0,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        xonxoff=False,
        rtscts=False
    )
except Exception as e:
    print(f"[!] Error: {e}")
    sys.exit(1)

packet_count = 0

print("[*] Streaming raw bytes to silicon...\n")

try:
    while True:
        # Read available bytes (non-blocking)
        if ser.in_waiting:
            raw_data = ser.read(ser.in_waiting)
            
            if raw_data:
                packet_count += 1
                
                # DIRECT write back to silicon
                ser.write(raw_data)
                ser.flush()
                
                # Minimal output
                print(f"[{packet_count}] {len(raw_data)} → silicon")
                sys.stdout.flush()

except KeyboardInterrupt:
    pass
finally:
    ser.close()
    print(f"\n[✓] {packet_count} packets streamed to silicon")
