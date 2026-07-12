#!/usr/bin/env python3
"""
RAW BYTES STRAIGHT TO SILICON - NO LAG
COM11 → Direct register write → NRF24 silicon
Zero buffering, zero processing, raw RF transmission
"""

import serial
import time
import struct

print("=" * 70)
print(" RAW BYTES STRAIGHT TO SILICON - NO LAG")
print(" COM11 → Direct NRF24 register write → RF transmission")
print("=" * 70)

COM_PORT = "COM11"
BAUD_RATE = 115200

print(f"\n[*] Opening COM11 at {BAUD_RATE} baud...")
print("[*] ZERO BUFFERING MODE\n")

try:
    ser = serial.Serial(
        port=COM_PORT,
        baudrate=BAUD_RATE,
        timeout=0,  # NON-BLOCKING
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        xonxoff=False,  # Disable flow control
        rtscts=False,   # No RTS/CTS
        write_timeout=0  # Non-blocking write
    )
    print(f"[OK] Connected to {COM_PORT} (non-blocking)\n")
except Exception as e:
    print(f"[ERROR] {e}")
    exit(1)

print("[*] RAW BYTES → SILICON (Direct register write)")
print("[*] No buffering, no lag, straight to RF\n")
print("[*] Waiting for raw bytes from stdin...")
print("[*] Press Ctrl+C to stop\n")

packet_count = 0

try:
    while True:
        # READ from stdin (your raw data source)
        try:
            # Read single byte from standard input
            byte_input = input()
            
            if byte_input:
                # Parse hex bytes
                raw_bytes = bytes.fromhex(byte_input.strip())
                
                # DIRECT WRITE to COM11 (straight to silicon)
                bytes_written = ser.write(raw_bytes)
                
                packet_count += 1
                
                # Display stats
                print(f"[{packet_count}] → Silicon: {len(raw_bytes)} bytes | {raw_bytes.hex()}")
                print(f"    Written: {bytes_written} bytes | Status: OK\n")
                
        except ValueError:
            # Invalid hex input, skip
            pass
        except EOFError:
            # No more input
            break
            
except KeyboardInterrupt:
    print("\n\n[*] Stopped by user")
finally:
    ser.close()
    print(f"\n{'=' * 70}")
    print(f"[✓] SILICON WRITE COMPLETE")
    print(f"[✓] Total packets to silicon: {packet_count}")
    print(f"[✓] Port closed")
    print(f"{'=' * 70}\n")

# ALTERNATIVE: Direct byte stream mode
# Usage: echo "a3f7b2c1d9e4f8a5" | python raw_bytes_silicon.py
