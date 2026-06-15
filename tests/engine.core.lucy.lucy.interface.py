import requests
import json
from typing import Dict, Any

PROMPT_PATH = "engine_core/lucy/lucy_prompt.txt"


def _safe_get(url: str) -> Dict[str, Any]:
    """Fetch JSON safely from local ENGINE services."""
    try:
        r = requests.get(url, timeout=3)
        r.raise_for_status()
        return r.json()
    except Exception:
        return {"status": "unavailable"}


def build_lucy_packet() -> Dict[str, Any]:
    """Unify EHF + TRON + ZHA + MESH into one structured packet."""
    ehf = _safe_get("http://localhost:9001/api/ehf/status")
    tron = _safe_get("http://localhost:9000/api/tron/status")
    zha  = _safe_get("http://localhost:9000/api/zha/status")
    mesh = _safe_get("http://localhost:9000/api/mesh/status")

    return {
        "ehf": {
            "performance_score": ehf.get("performance_score"),
            "circadian_phase": ehf.get("circadian_phase"),
            "cognitive_state": ehf.get("cognitive_state"),
            "optimal_frequency": ehf.get("optimal_frequency"),
            "readiness_level": ehf.get("readiness", {}).get("status"),
            "biomarkers": ehf.get("biomarkers", {})
        },
        "tron": tron,
        "zha": zha,
        "mesh": mesh
    }


def load_prompt() -> str:
    with open(PROMPT_PATH, "r", encoding="utf-8") as f:
        return f.read()


def call_model(prompt: str, packet: Dict[str, Any]) -> str:
    """
    Placeholder for your LLM endpoint.
    You wire this to your model server.
    """
    raise NotImplementedError("Implement call_model() to your LLM endpoint.")


def ask_lucy(intent: str, context: str = "") -> str:
    """Main entrypoint for Lucy."""
    packet = build_lucy_packet()
    packet["operator"] = {"intent": intent, "context": context}

    prompt = load_prompt()
    return call_model(prompt, packet)
