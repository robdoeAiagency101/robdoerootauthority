import csv
import json
import os
import time
from datetime import datetime, timezone

PORT = 'COM10'
BAUDRATE = 115200
OUTPUT_DIR = "derived_data"
CSV_FILE = os.path.join(OUTPUT_DIR, "jubilee_telemetry_matrix.csv")

def initialise_storage_matrix():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    # Establish statutory append-only headers if file does not exist
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Timestamp", "Epoch", "Raw_Payload", "Length"])
        print(f"[+] Initialised immutable storage ledger at: {CSV_FILE}")

def run_persistence_loop():
    import serial
    initialise_storage_matrix()
    
    try:
        ser = serial.Serial(PORT, BAUDRATE, timeout=0.1)
        ser.flushInput()
        print(f"[+] Persistence recorder locked onto {PORT}. Documenting state transformations...")
    except Exception as e:
        print(f"[!] Target serial allocation error: {e}")
        return

    while True:
        try:
            if ser.in_waiting > 0:
                raw_chunk = ser.read(ser.in_waiting).decode('utf-8', errors='ignore').strip()
                if not raw_chunk:
                    continue
                
                # Compute exact temporal constraints
                now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                epoch_ticks = int(time.time())
                payload_len = len(raw_chunk)
                
                # Append atomic state record to physical storage disk
                with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    writer.writerow([now_utc, epoch_ticks, raw_chunk, payload_len])
                
                print(f"[Record Logged] Ticks: {epoch_ticks} | Block Size: {payload_len} bytes")
                
        except KeyboardInterrupt:
            print("\n[*] Safely unbinding disk recording hooks.")
            ser.close()
            break
        except Exception as fault:
            print(f"[!] Storage matrix variance encountered: {fault}")
            break

if __name__ == '__main__':
    run_persistence_loop()
