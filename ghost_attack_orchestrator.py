import sys
import time
import serial

print("========================================================================")
print(" 🌌 [GHOSTESP CORE] Initialising Scansta Hardware Interaction Matrix...")
print("========================================================================")

try:
    # Anchor onto active hardware line
    ser = serial.Serial(port='COM10', baudrate=115200, timeout=1)
    time.sleep(2)  # Allow interface state to clear
    
    # Cascade commands natively expected by the GhostESP partition logic
    attack_sequence = [
        "help attack\n",
        "attack deauth\n",
        "attack beacon\n",
        "help wifi\n",
        "scansta\n"
    ]
    
    for cmd in attack_sequence:
        print(f"📡 Injecting Execution Vector: {cmd.strip()}")
        ser.write(cmd.encode('utf-8'))
        ser.flush()
        time.sleep(2.0)  # Ensure RAM buffers capture output stream
        
        # Read the immediate text response matrix from the device RAM buffer
        while ser.in_waiting > 0:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line:
                print(f"   [ghost-cli]> {line}")
                with open("derived_data/robdoe_espVmark_telemetry.log", "a", encoding="utf-8") as f:
                    f.write(f"[{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}] {line}\n")

except serial.SerialException as se:
    print(f"❌ Connection Blocked. Free the port via Task Manager/Process Handles. ({se})")
except KeyboardInterrupt:
    print("\n🛑 Pipeline paused by Operator.")
