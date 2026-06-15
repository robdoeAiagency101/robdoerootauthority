import time
import requests
from engine_core.lucy.lucy_interface import ask_lucy

def get_json(url):
    try:
        r = requests.get(url, timeout=3)
        r.raise_for_status()
        return r.json()
    except:
        return {"status": "unavailable"}

def tick():
    snapshot = {
        "ehf": get_json("http://localhost:9001/api/ehf/status"),
        "tron": get_json("http://localhost:9000/api/tron/status"),
        "zha": get_json("http://localhost:9000/api/zha/status"),
    }

    reply = ask_lucy(
        intent="what should I do next?",
        context="engine_agent_tick"
    )

    print("\\n[ENGINE-AGENT] TICK")
    print("-" * 40)
    print(reply)
    print("-" * 40)

def main():
    print("[ENGINE-AGENT] running (Ctrl+C to stop)")
    while True:
        tick()
        time.sleep(300)

if __name__ == "__main__":
    main()
