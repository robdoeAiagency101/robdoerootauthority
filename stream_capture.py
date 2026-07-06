import csv, os, sys, time
from datetime import datetime
try:
    import serial
    from serial.tools import list_ports
except ImportError:
    print("[-] Missing dependency. Run: pip install pyserial", file=sys.stderr)
    sys.exit(1)

TARGET_DIR = r"D:\RobDoe\atmospheric-truth-layer"
LOG_FILE = os.path.join(TARGET_DIR, "serial_latch_stream.csv")
BAUD_RATE = 115200

if not os.path.exists(TARGET_DIR): os.makedirs(TARGET_DIR)
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, "w", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow(["Timestamp", "Epoch", "Raw_Payload", "Length"])

ports = list(list_ports.comports())
com_port = next((p.device for p in ports if "CP210" in p.description or "CH340" in p.description), ports[0].device if ports else None)

if not com_port:
    print("[-] No active serial devices found.", file=sys.stderr)
    sys.exit(1)

print(f"[+] Latching onto device interface: {com_port} @ {BAUD_RATE}")
try:
    with serial.Serial(com_port, BAUD_RATE, timeout=1) as ser:
        ser.reset_input_buffer()
        while True:
            if ser.in_waiting > 0:
                raw_line = ser.readline()
                timestamp = datetime.utcnow().isoformat()
                decoded_line = raw_line.decode("utf-8", errors="ignore").strip()
                if not decoded_line: continue
                print(f"[{timestamp}] -> {decoded_line}")
                with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
                    csv.writer(f).writerow([timestamp, int(time.time()), decoded_line, len(raw_line)])
            time.sleep(0.001)
except KeyboardInterrupt:
    print("\n[+] Stream pipeline closed cleanly.")
except Exception as e:
    print(f"[-] Error: {e}", file=sys.stderr)
