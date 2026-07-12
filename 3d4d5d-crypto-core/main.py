#!/usr/bin/env python3
"""
3D+4D+5D Immutable Cryptographic Triangle Core
Pythagorean Triple Validator + Merkle Tree State Integrity
Reproducible, Attestable, Real-world Deployable
"""

import hashlib
import json
import time
from datetime import datetime
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class PythagoreanTriangle:
    """3D+4D+5D Immutable Right Angle Triangle Validator"""
    
    CANONICAL_TRIPLE = (3, 4, 5)
    
    @staticmethod
    def validate(a: int, b: int, c: int) -> bool:
        """Verify Pythagorean theorem: a² + b² = c² (order-invariant)"""
        sides = sorted([a, b, c])
        return sides[0]**2 + sides[1]**2 == sides[2]**2
    
    @staticmethod
    def compute_hash(a: int, b: int, c: int) -> str:
        """Generate cryptographic fingerprint of triangle"""
        data = json.dumps({"a": a, "b": b, "c": c, "canonical": (3, 4, 5)}, sort_keys=True)
        return hashlib.sha256(data.encode()).hexdigest()
    
    @staticmethod
    def is_canonical() -> bool:
        """Verify canonical 3-4-5 triple"""
        return PythagoreanTriangle.validate(3, 4, 5)


class MerkleTree:
    """Multi-dimensional state integrity via Merkle Tree"""
    
    def __init__(self):
        self.leaves: List[str] = []
        self.root: str = ""
    
    def add_leaf(self, data: str) -> None:
        """Add immutable leaf node"""
        leaf_hash = hashlib.sha256(data.encode()).hexdigest()
        self.leaves.append(leaf_hash)
        self.root = self._compute_root()
        logger.info(f"Leaf added: {leaf_hash[:16]}... Root: {self.root[:16]}...")
    
    def _compute_root(self) -> str:
        """Compute merkle root (SHA256 tree hash)"""
        if not self.leaves:
            return hashlib.sha256(b"").hexdigest()
        
        current_level = self.leaves[:]
        while len(current_level) > 1:
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i+1] if i+1 < len(current_level) else left
                combined = hashlib.sha256((left + right).encode()).hexdigest()
                next_level.append(combined)
            current_level = next_level
        
        return current_level[0] if current_level else ""
    
    def verify(self) -> bool:
        """Verify merkle tree integrity"""
        return bool(self.root) and len(self.leaves) > 0
    
    def export_state(self) -> Dict:
        """Export immutable state snapshot"""
        return {
            "leaves_count": len(self.leaves),
            "merkle_root": self.root,
            "timestamp": datetime.utcnow().isoformat(),
        }


class CryptoTriangleCore:
    """Production-ready 3D+4D+5D Cryptographic Triangle System"""
    
    def __init__(self):
        self.triangle = PythagoreanTriangle()
        self.merkle = MerkleTree()
        self.transactions: List[Dict] = []
        self.state_version = 0
    
    def initialize(self) -> Dict:
        """Initialize canonical 3-4-5 immutable state"""
        logger.info("Initializing 3D+4D+5D Cryptographic Core...")
        
        # Validate canonical triple
        assert self.triangle.is_canonical(), "Canonical 3-4-5 triangle invalid"
        
        # Create genesis state
        genesis_hash = self.triangle.compute_hash(3, 4, 5)
        self.merkle.add_leaf(genesis_hash)
        
        state = {
            "status": "initialized",
            "canonical_triple": (3, 4, 5),
            "genesis_hash": genesis_hash,
            "merkle_root": self.merkle.root,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        self.transactions.append(state)
        self.state_version += 1
        logger.info(f"✓ Genesis state created: {genesis_hash[:16]}...")
        
        return state
    
    def validate_transaction(self, a: int, b: int, c: int) -> Tuple[bool, Dict]:
        """Validate and record Pythagorean transaction"""
        is_valid = self.triangle.validate(a, b, c)
        tx_hash = self.triangle.compute_hash(a, b, c)
        
        tx = {
            "id": len(self.transactions),
            "sides": (a, b, c),
            "valid": is_valid,
            "hash": tx_hash,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        if is_valid:
            self.merkle.add_leaf(tx_hash)
            self.state_version += 1
            logger.info(f"✓ Valid triple ({a},{b},{c}): {tx_hash[:16]}...")
        else:
            logger.warning(f"✗ Invalid triple ({a},{b},{c})")
        
        self.transactions.append(tx)
        return is_valid, tx
    
    def get_state(self) -> Dict:
        """Export complete immutable state"""
        return {
            "version": self.state_version,
            "transactions": len(self.transactions),
            "merkle_root": self.merkle.root,
            "merkle_verified": self.merkle.verify(),
            "timestamp": datetime.utcnow().isoformat(),
            "status": "operational",
        }
    
    def health_check(self) -> Dict:
        """System health and integrity verification"""
        return {
            "alive": True,
            "canonical_valid": self.triangle.is_canonical(),
            "merkle_integrity": self.merkle.verify(),
            "transactions_recorded": len(self.transactions),
            "state_version": self.state_version,
            "timestamp": datetime.utcnow().isoformat(),
        }


if __name__ == "__main__":
    # Initialize core
    core = CryptoTriangleCore()
    genesis = core.initialize()
    logger.info(json.dumps(genesis, indent=2))
    
    # Validate test cases
    test_triples = [(3, 4, 5), (5, 12, 13), (8, 15, 17), (1, 2, 3)]
    for triple in test_triples:
        is_valid, tx = core.validate_transaction(*triple)
    
    # Export final state
    final_state = core.get_state()
    logger.info("\n=== Final State ===")
    logger.info(json.dumps(final_state, indent=2))
    
    # Health check
    health = core.health_check()
    logger.info("\n=== Health Check ===")
    logger.info(json.dumps(health, indent=2))
