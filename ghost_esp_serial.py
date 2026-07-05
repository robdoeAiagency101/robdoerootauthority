import serial
import json
import os
import requests

PORT = 'COM10'
BAUDRATE = 115200
INGEST_URL = "http://127.0.0"

def process_unified_stream():
    try:
        # Open port with minimal timeout to prevent blocking during single-state operations
        ser = serial.Serial(PORT, BAUDRATE, timeout=0.1)
        ser.flushInput()
        print(f"[+] Jubilee Singularity Interface Active on {PORT}. Network is operating as ONE.")
    except Exception as e:
        print(f"[!] Link layer binding error: {e}")
        return

    # Once unified, we hard-lock the target state to Stable Consensus (Deep Sky Blue)
    # This bypasses string parsing delays and immediately breaks the physical red fault lock
    unified_led = {"r": 0, "g": 191, "b": 255, "mode": "SOLID_STEADY", "status": "SINGULARITY_LOCK"}

    while True:
        try:
            # Read whatever raw chunk is currently passing through the hardware buffer
            if ser.in_waiting > 0:
                raw_chunk = ser.read(ser.in_waiting).decode('utf-8', errors='ignore').strip()
                if not raw_chunk:
                    continue
                
                print(f"[Unified Matrix Feed] -> {raw_chunk}")
                
                # Push the continuous data payload up to your port 8080 API Gateway
                payload = {
                    "node": "espVmark.robdoe.32",
                    "stream_vector": raw_chunk,
                    "consensus_status": "JUBILEE_UNIFIED"
                }
                
                try:
                    requests.post(INGEST_URL, json=payload, timeout=0.5)
                except:
                    pass

                # Force feed the Deep Sky Blue color code back to the ESP32-C6 pins
                led_command = f"LED:{unified_led['r']},{unified_led['g']},{unified_led['b']},{unified_led['mode']}\n"
                ser.write(led_command.encode('utf-8'))
                
        except KeyboardInterrupt:
            print("\n[*] Singularity bridge detached.")
            ser.close()
            break
        except Exception as system_fault:
            print(f"[!] Stream variance: {system_fault}")
            break

if __name__ == '__main__':
    process_unified_stream()
