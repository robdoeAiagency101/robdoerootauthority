import serial
import serial.tools.list_ports
import json
import os
import requests

# Framework Ingestion Targets (Matched to active firewall channels)
PORT = 'COM10'
BAUDRATE = 115200
INGEST_URL = "http://127.0.0" 

def establish_serial_conduit():
    print(f"[*] Binding to Hardware Link Layer on {PORT} at {BAUDRATE} baud...")
    try:
        ser = serial.Serial(PORT, BAUDRATE, timeout=1)
        ser.flushInput()
        print(f"[+] GhostESP Serial Interface Online. Ingesting active matrices.")
        return ser
    except Exception as e:
        print(f"[!] Core binding failure on {PORT}: {e}")
        return None

def process_stream():
    ser = establish_serial_conduit()
    if not ser:
        return

    while True:
        try:
            if ser.in_waiting > 0:
                raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
                if not raw_line:
                    continue
                
                print(f"[Raw ESP Node] -> {raw_line}")
                
                # Check for structural biometric matrices inside the console broadcast
                if "Biometric Input" in raw_line or "Calculated Anchor" in raw_line or raw_line.startswith("{"):
                    # Process and route pure raw structure to the local state engine directory
                    if raw_line.startswith("{"):
                        try:
                            structured_data = json.loads(raw_line)
                            # Route straight into the local engine port loop
                            response = requests.post(INGEST_URL, json=structured_data, timeout=2)
                            print(f"  +-- [Matrix Pushed] Engine Return State Code: {response.status_code}")
                        except Exception as log_err:
                            pass
                            
        except KeyboardInterrupt:
            print("\n[*] GhostESP interface connection cleanly detached by operator request.")
            ser.close()
            break
        except Exception as system_fault:
            print(f"[!] Active pipeline stream drop: {system_fault}")
            break

if __name__ == '__main__':
    # Verify pyserial driver layer is available
    try:
        import serial
    except ImportError:
        os.system('pip install pyserial requests')
    process_stream()
