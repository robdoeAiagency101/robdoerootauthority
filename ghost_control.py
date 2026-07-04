import sys
import time
import serial

print("========================================================================")
print(" 🌌 [GHOSTESP PROTOCOL ACTIVE] Writing Command Arrays down COM10 Layer...")
print("========================================================================")

try:
    # Initialize unmanaged direct serial pipe matching ghost-cli expectations
    ser = serial.Serial(port='COM10', baudrate=115200, timeout=1)
    time.sleep(2)  # Allow the C6 flasher stub to fully transition to bootloader execution
    
    # Target payload commands to stream directly down the micro-controller buffer
    commands = [
        "help wifi\n",
        "help ble\n",
        "help comm\n",
        "help attack\n"
    ]
    
    for cmd in commands:
        print(f"📡 Sending Command: {cmd.strip()}")
        ser.write(cmd.encode('utf-8'))
        ser.flush()
        time.sleep(1.5)  # Let the ghost-cli category index output render cleanly
        
        # Read the immediate text response matrix from the device RAM buffer
        while ser.in_waiting > 0:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line:
                print(f"   [ghost-cli]> {line}")
                # Save records locally to ensure Evidence Act Section 146 immutability
                with open("derived_data/robdoe_espVmark_telemetry.log", "a", encoding="utf-8") as f:
                    f.write(f"[{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}] {line}\n")

except serial.SerialException as se:
    print(f"❌ Core Interface Blocked. Ensure other terminal windows are unlatched from COM10. ({se})")
except KeyboardInterrupt:
    print("\n🛑 Stream monitoring paused gracefully by Operator.")
