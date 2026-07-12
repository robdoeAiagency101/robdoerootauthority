"""
REST API Server for 3D+4D+5D Cryptographic Triangle
FastAPI-based production endpoint
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import json

from main import CryptoTriangleCore

app = FastAPI(
    title="3D+4D+5D Cryptographic Triangle",
    description="Immutable Pythagorean triple validator with Merkle tree integrity",
    version="1.0.0"
)

# Global core instance
core = CryptoTriangleCore()


@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    core.initialize()


class TriangleValidationRequest(BaseModel):
    a: int
    b: int
    c: int


class HealthResponse(BaseModel):
    alive: bool
    status: str


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health and integrity check"""
    check = core.health_check()
    return HealthResponse(
        alive=check["alive"],
        status="operational" if all([
            check["canonical_valid"],
            check["merkle_integrity"]
        ]) else "degraded"
    )


@app.post("/validate")
async def validate_triangle(req: TriangleValidationRequest) -> Dict:
    """Validate Pythagorean triple and record transaction"""
    is_valid, tx = core.validate_transaction(req.a, req.b, req.c)
    return {
        "valid": is_valid,
        "transaction": tx,
        "state": core.get_state(),
    }


@app.get("/state")
async def get_state() -> Dict:
    """Export current immutable state"""
    return core.get_state()


@app.get("/genesis")
async def get_genesis() -> Dict:
    """Get genesis transaction"""
    if core.transactions:
        return core.transactions[0]
    raise HTTPException(status_code=404, detail="Genesis not found")


@app.get("/merkle-root")
async def get_merkle_root() -> Dict:
    """Get current Merkle tree root"""
    return {
        "merkle_root": core.merkle.root,
        "verified": core.merkle.verify(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
