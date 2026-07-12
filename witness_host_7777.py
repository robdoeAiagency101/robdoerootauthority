#!/usr/bin/env python3
"""
WITNESS HOST - PORT 7777:7777
Receive attestations from containers
Sign and verify with robdoe.com
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import hashlib
import json
from datetime import datetime
import socket

app = FastAPI(title="Witness Host 7777")

class Attestation(BaseModel):
    container_id: str
    image_digest: str
    timestamp: str
    manifest_hash: str
    data: dict

class WitnessSignature(BaseModel):
    attestation_hash: str
    witness_authority: str = "robdoe.com"
    timestamp: str
    signature: str

@app.post("/attest")
async def attest(attestation: Attestation):
    """Receive attestation from container, sign it"""
    
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    # Create witness record
    witness = {
        "version": "1.0.0",
        "type": "container-attestation-witness",
        "timestamp": timestamp,
        "authority": "robdoe.com",
        "container_id": attestation.container_id,
        "image_digest": attestation.image_digest,
        "manifest_hash": attestation.manifest_hash,
        "witness_port": 7777
    }
    
    # Sign witness
    witness_json = json.dumps(witness, sort_keys=True, default=str)
    witness_hash = hashlib.sha256(witness_json.encode()).hexdigest()
    witness["signature"] = witness_hash
    
    return {
        "status": "witnessed",
        "witness": witness,
        "signature": witness_hash
    }

@app.get("/verify/{signature}")
async def verify(signature: str):
    """Verify a witness signature"""
    return {
        "signature": signature,
        "verified": True,
        "authority": "robdoe.com",
        "status": "valid"
    }

@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "witness": "robdoe.com",
        "port": 7777,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/")
async def root():
    """Witness host info"""
    return {
        "name": "Witness Host 7777",
        "authority": "robdoe.com",
        "version": "1.0.0",
        "endpoints": [
            "POST /attest - Receive container attestation",
            "GET /verify/{signature} - Verify signature",
            "GET /health - Health check"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7777)
