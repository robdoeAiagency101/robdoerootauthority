import serial
import time
import os

port = 'COM10'
baud = 115200
log_path = 'derived_data/robdoe_espVmark_telemetry.log'
os.makedirs(os.path.dirname(log_path), exist_ok=True)

print("┌───────────────────────────────────────────────────────────────────────┐")
print("│ 🌌 [GHOSTESP CORE] Live Chromatic Telemetry Scansta Core Engaged      │")
print("│ 🛰️  Target Identity: robdoe.espVmark.ghost                             │")
print("└───────────────────────────────────────────────────────────────────────┘")

try:
    s = serial.Serial(port, baud, timeout=0.1)
    while True:
        if s.in_waiting > 0:
            line = s.readline().decode('utf-8', errors='ignore').strip()
            if line:
                ts = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
                output = f"🛰️  [{ts}] [ghost-cli]> {line}"
                print(output)
                with open(log_path, 'a', encoding='utf-8') as f:
                    f.write(output + "\n")
        time.sleep(0.01)
except serial.SerialException as se:
    print(f"❌ Connection Blocked. Ensure serial windows are unlatched from {port}: {se}")
except KeyboardInterrupt:
    print("\n🛑 Telemetry scanner loop paused gracefully by Operator.")
