import time
import requests
from typing import Dict, Any
from engine_core.lucy.lucy_interface import ask_lucy

ENGINE_ROOT = r"C:\(   .   Y    .   )ENGINE"


def get_json(url: str) -> Dict[str, Any]:
    try:
        r = requests.get(url, timeout=3)
        r.raise_for_status()
        return r.json()
    except Exception:
        return {"status": "unavailable"}


def tick():
    # Read core systems
    ehf = get_json("http://localhost:9001/api/ehf/status")
    tron = get_json("http://localhost:9000/api/tron/status")
    zha  = get_json("http://localhost:9000/api/zha/status")

    # Decide intent for Lucy
    intent = "what should I do next?"
    context = "agent_tick"

    # Ask Lucy for guidance
    lucy_reply = ask_lucy(intent=intent, context=context)

    # For now: just print it
    print("\n[ENGINE-AGENT] LUCY SAYS:\n")
    print(lucy_reply)
    print("\n---\n")


def main():
    print("[ENGINE-AGENT] starting loop (Ctrl+C to stop)")
    while True:
        tick()
        time.sleep(300)  # every 5 minutes


if __name__ == "__main__":
    main()
