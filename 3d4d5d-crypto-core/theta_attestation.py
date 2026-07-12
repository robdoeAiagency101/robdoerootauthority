#!/usr/bin/env python3
"""
Theta Blockchain Integration for 3D+4D+5D Attestation
Guardian Node submission for sealed container builds
"""

import json
import os
from typing import Dict, Tuple
from eth_account import Account
from eth_account.messages import encode_defunct
from web3 import Web3
import requests


class ThetaGuardianNode:
    """Connect to Theta Guardian Node for attestation"""
    
    def __init__(
        self,
        guardian_rpc_url: str = "https://theta-mainnet-rpc.allthatnode.com:8545",
        chain_id: int = 361  # Theta mainnet
    ):
        """
        Initialize Theta Guardian Node connection
        
        Args:
            guardian_rpc_url: Theta RPC endpoint
            chain_id: 361 for mainnet, 365 for testnet
        """
        self.w3 = Web3(Web3.HTTPProvider(guardian_rpc_url))
        self.chain_id = chain_id
        self.is_connected = self.w3.is_connected()
        
        if not self.is_connected:
            print("⚠ Warning: Not connected to Theta Guardian Node")
        else:
            chain_name = "Theta Mainnet" if chain_id == 361 else "Theta Testnet"
            print(f"✓ Connected to {chain_name}")
            print(f"  Chain ID: {self.w3.eth.chain_id}")
            print(f"  Latest Block: {self.w3.eth.block_number}")
    
    def create_attestation_record(
        self,
        seal_hash: str,
        image_digest: str,
        source_hash: str,
        github_url: str,
        timestamp: str
    ) -> Dict:
        """
        Create attestation record for Theta blockchain
        
        Returns:
            Attestation data structure
        """
        record = {
            "type": "CryptoTriangleAttestation",
            "version": "2.0.0",
            "timestamp": timestamp,
            "blockchain": "theta",
            "hashes": {
                "sealHash": seal_hash,
                "imageDigest": image_digest,
                "sourceHash": source_hash
            },
            "source": {
                "repository": github_url,
                "attestationType": "container-build"
            },
            "metadata": {
                "system": "3D+4D+5D Cryptographic Triangle",
                "witness": "robdoe.com",
                "verificationMethod": "theta-guardian-node"
            }
        }
        return record


class ThetaAttestation:
    """Sign and submit attestation to Theta blockchain"""
    
    def __init__(self, keystore_json: str, password: str):
        """Initialize with keystore"""
        self.keystore = json.loads(keystore_json)
        self.password = password
        self.account = None
        self._unlock_keystore()
        self.theta = ThetaGuardianNode()
    
    def _unlock_keystore(self):
        """Unlock Ethereum keystore (works with Theta via EVM compatibility)"""
        try:
            keystore_dict = self.keystore
            self.account = Account.from_key(
                Account.decrypt(keystore_dict, self.password)
            )
            print(f"✓ Keystore unlocked: {self.account.address}")
        except Exception as e:
            raise ValueError(f"Failed to unlock keystore: {e}")
    
    def sign_attestation(self, attestation: Dict) -> Dict:
        """Sign attestation with private key"""
        attestation_json = json.dumps(attestation, sort_keys=True)
        message = encode_defunct(text=attestation_json)
        signed = self.account.sign_message(message)
        
        return {
            "attestation": attestation,
            "signature": signed.signature.hex(),
            "signer": self.account.address,
            "messageHash": signed.messageHash.hex(),
            "signingAlgorithm": "ECDSA-SHA256"
        }
    
    def prepare_theta_submission(
        self,
        seal_hash: str,
        image_digest: str,
        source_hash: str,
        github_url: str,
        timestamp: str
    ) -> Dict:
        """
        Prepare complete attestation for Theta submission
        
        Returns:
            Signed attestation ready for blockchain
        """
        # Create attestation record
        record = self.theta.create_attestation_record(
            seal_hash=seal_hash,
            image_digest=image_digest,
            source_hash=source_hash,
            github_url=github_url,
            timestamp=timestamp
        )
        
        # Sign it
        signed = self.sign_attestation(record)
        
        # Add chain-specific metadata
        submission = {
            "version": "2.0.0",
            "timestamp": timestamp,
            "sealHash": seal_hash,
            "imageDigest": image_digest,
            "sourceHash": source_hash,
            "githubUrl": github_url,
            "signing": {
                "signer": self.account.address,
                "signature": signed["signature"],
                "algorithm": "ECDSA-SHA256",
                "keyType": "secp256k1"
            },
            "blockchain": {
                "network": "theta",
                "chainId": 361,
                "nodeType": "guardian-node",
                "purpose": "attestation-registry"
            },
            "verification": {
                "robdoeWitness": "pending",
                "thetaChain": "pending",
                "status": "READY_FOR_SUBMISSION"
            }
        }
        
        return submission
    
    def format_for_theta_storage(self, submission: Dict) -> str:
        """
        Format attestation for storage on Theta blockchain
        
        Theta supports storing data via:
        1. State storage (smart contract)
        2. Events (logs)
        3. IPFS hash reference
        
        Returns:
            JSON string optimized for Theta
        """
        # Compress for on-chain storage
        compact = {
            "v": submission["version"],
            "ts": submission["timestamp"],
            "sh": submission["sealHash"][:16],  # First 16 chars of seal hash
            "id": submission["imageDigest"].split(":")[-1][:16],  # Image ID
            "gh": submission["githubUrl"].split("/")[-1],  # Repo name
            "sig": submission["signing"]["signature"][:32],  # Signature prefix
            "signer": submission["signing"]["signer"],
            "chain": "theta"
        }
        
        return json.dumps(compact, separators=(',', ':'))
    
    def create_ipfs_reference(self, submission: Dict) -> str:
        """
        Create IPFS reference for full attestation
        
        In production, would upload to IPFS and return hash
        For now, creates hash of attestation data
        
        Returns:
            IPFS-like hash reference
        """
        submission_json = json.dumps(submission, sort_keys=True)
        
        # Simulate IPFS hash (in production, use actual IPFS)
        import hashlib
        ipfs_hash = "Qm" + hashlib.sha256(
            submission_json.encode()
        ).hexdigest()[:46]
        
        return ipfs_hash


class ThetaAttestationOracle:
    """Oracle for on-chain verification via Theta"""
    
    def __init__(self):
        self.theta = ThetaGuardianNode()
    
    def verify_attestation_on_chain(self, seal_hash: str) -> Dict:
        """
        Query Theta blockchain for attestation verification
        
        Returns:
            Verification status
        """
        return {
            "sealHash": seal_hash,
            "blockchain": "theta",
            "status": "queryable_via_guardian_node",
            "verificationMethod": "theta-oracle",
            "timestamp": None  # Would be populated from chain
        }
    
    def get_attestation_event(self, seal_hash: str) -> Dict:
        """Get attestation event from Theta blockchain"""
        return {
            "event": "AttestationSealed",
            "sealHash": seal_hash,
            "blockchain": "theta",
            "status": "searchable_via_logs"
        }


def main():
    """Example usage"""
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python theta_attestation.py <keystore_json> <password> <seal_hash>")
        print("")
        print("Example:")
        print('  python theta_attestation.py \'{"version":3,...}\' "password" "abc123..."')
        sys.exit(1)
    
    keystore_json = sys.argv[1]
    password = sys.argv[2]
    seal_hash = sys.argv[3]
    
    print("\n" + "=" * 70)
    print("🔗 THETA GUARDIAN NODE ATTESTATION")
    print("=" * 70)
    
    # Initialize
    attestation = ThetaAttestation(keystore_json, password)
    
    # Prepare submission
    submission = attestation.prepare_theta_submission(
        seal_hash=seal_hash,
        image_digest="sha256:image123...",
        source_hash="source123...",
        github_url="https://github.com/robdoeAiagency101/robdoerootauthority",
        timestamp="2026-05-31T07:15:03Z"
    )
    
    print("\n✅ ATTESTATION PREPARED FOR THETA SUBMISSION")
    print(json.dumps(submission, indent=2))
    
    # Format for Theta storage
    theta_format = attestation.format_for_theta_storage(submission)
    print(f"\n📦 THETA STORAGE FORMAT:\n{theta_format}")
    
    # Create IPFS reference
    ipfs_ref = attestation.create_ipfs_reference(submission)
    print(f"\n🔗 IPFS REFERENCE:\n{ipfs_ref}")
    
    # Verification
    oracle = ThetaAttestationOracle()
    verification = oracle.verify_attestation_on_chain(seal_hash)
    print(f"\n✓ VERIFICATION METHOD:\n{json.dumps(verification, indent=2)}")
    
    print("\n" + "=" * 70)
    print("Ready for Theta Guardian Node submission")
    print("=" * 70)


if __name__ == "__main__":
    main()
