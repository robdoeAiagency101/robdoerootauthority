"""
robdoe.com Witness Service - Cryptographic Attestation
Verifies and signs container builds with witness authority
"""

import hashlib
import hmac
import json
from datetime import datetime, timedelta
from typing import Dict, Optional
from enum import Enum


class AttestationStatus(Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    ATTESTED = "ATTESTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class RobdoeWitnessService:
    """
    robdoe.com Witness Service
    
    Provides cryptographic attestation and witnessing for:
    - Container image builds
    - Artifact integrity verification
    - Provenance chain validation
    - Timestamp verification
    """
    
    WITNESS_ID = "robdoe.com"
    SIGNATURE_ALGORITHM = "sha256"
    ATTESTATION_TTL_HOURS = 8760  # 1 year
    
    def __init__(self, private_key: str = "robdoe-witness-secret"):
        self.private_key = private_key
        self.attestations: Dict[str, Dict] = {}
        self.revocations: set = set()
    
    def generate_signature(self, payload: str) -> str:
        """Generate HMAC-SHA256 signature for payload"""
        signature = hmac.new(
            self.private_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def attest_image_build(
        self,
        image_digest: str,
        image_tag: str,
        registry: str,
        build_context_hash: str,
        builder: str,
        github_run_id: str,
        github_sha: str,
        timestamp: str
    ) -> Dict:
        """
        Create witness attestation for container image build
        
        Args:
            image_digest: Docker image SHA256 digest
            image_tag: Image tag/reference
            registry: Container registry (ghcr.io, etc)
            build_context_hash: SHA256 of build context
            builder: Builder identifier (github-actions, etc)
            github_run_id: GitHub Actions run ID
            github_sha: Commit SHA
            timestamp: Build timestamp (ISO 8601)
        
        Returns:
            Attestation record with witness signature
        """
        
        attestation_id = f"{github_run_id}-{int(datetime.utcnow().timestamp())}"
        
        # Build attestation payload
        attestation = {
            "attestationId": attestation_id,
            "witness": self.WITNESS_ID,
            "timestamp": timestamp,
            "image": {
                "digest": image_digest,
                "tag": image_tag,
                "registry": registry,
                "pullUrl": f"{registry}/{image_tag}@{image_digest}"
            },
            "build": {
                "contextHash": build_context_hash,
                "builder": builder,
                "gitHubRunId": github_run_id,
                "gitHubSha": github_sha
            },
            "verification": {
                "algorithm": self.SIGNATURE_ALGORITHM,
                "status": AttestationStatus.ATTESTED.value
            }
        }
        
        # Serialize for signing (deterministic)
        payload_str = json.dumps(attestation, sort_keys=True, separators=(',', ':'))
        
        # Generate witness signature
        signature = self.generate_signature(payload_str)
        
        # Add signature to attestation
        attestation["signature"] = signature
        attestation["signedBy"] = self.WITNESS_ID
        attestation["signatureVerified"] = True
        
        # Calculate expiration
        issued_dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        expiration_dt = issued_dt + timedelta(hours=self.ATTESTATION_TTL_HOURS)
        attestation["expiration"] = expiration_dt.isoformat()
        
        # Store attestation
        self.attestations[attestation_id] = attestation
        
        return attestation
    
    def verify_attestation(self, attestation_id: str, signature: str) -> Dict:
        """
        Verify witness attestation signature
        
        Returns:
            Verification result with status and details
        """
        
        if attestation_id in self.revocations:
            return {
                "valid": False,
                "status": AttestationStatus.REJECTED.value,
                "reason": "Attestation revoked",
                "attestationId": attestation_id
            }
        
        if attestation_id not in self.attestations:
            return {
                "valid": False,
                "status": "NOT_FOUND",
                "reason": "Attestation not found",
                "attestationId": attestation_id
            }
        
        attestation = self.attestations[attestation_id]
        
        # Check expiration
        expiration_dt = datetime.fromisoformat(
            attestation["expiration"].replace('Z', '+00:00')
        )
        if datetime.utcnow() > expiration_dt:
            return {
                "valid": False,
                "status": AttestationStatus.EXPIRED.value,
                "reason": "Attestation expired",
                "attestationId": attestation_id,
                "expired": attestation["expiration"]
            }
        
        # Verify signature
        stored_sig = attestation.get("signature")
        if stored_sig != signature:
            return {
                "valid": False,
                "status": "SIGNATURE_MISMATCH",
                "reason": "Signature verification failed",
                "attestationId": attestation_id
            }
        
        return {
            "valid": True,
            "status": attestation["verification"]["status"],
            "attestationId": attestation_id,
            "witness": attestation["witness"],
            "timestamp": attestation["timestamp"],
            "imageDigest": attestation["image"]["digest"],
            "expiration": attestation["expiration"],
            "details": attestation
        }
    
    def revoke_attestation(self, attestation_id: str) -> Dict:
        """Revoke an attestation"""
        if attestation_id in self.attestations:
            self.revocations.add(attestation_id)
            return {
                "status": "REVOKED",
                "attestationId": attestation_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        return {"error": "Attestation not found"}
    
    def get_attestation(self, attestation_id: str) -> Optional[Dict]:
        """Retrieve attestation details"""
        return self.attestations.get(attestation_id)
    
    def export_witness_certificate(self) -> Dict:
        """Export witness service certificate"""
        return {
            "witnessService": self.WITNESS_ID,
            "algorithm": self.SIGNATURE_ALGORITHM,
            "attestationsIssued": len(self.attestations),
            "attestationsRevoked": len(self.revocations),
            "attestationTTL": f"{self.ATTESTATION_TTL_HOURS} hours",
            "exportedAt": datetime.utcnow().isoformat()
        }


# Global witness instance
_witness_service = RobdoeWitnessService()


def attest_build(**kwargs) -> Dict:
    """Convenience function to create attestation"""
    return _witness_service.attest_image_build(**kwargs)


def verify_attestation(attestation_id: str, signature: str) -> Dict:
    """Convenience function to verify attestation"""
    return _witness_service.verify_attestation(attestation_id, signature)


def get_witness_certificate() -> Dict:
    """Get witness certificate"""
    return _witness_service.export_witness_certificate()


if __name__ == "__main__":
    import json
    
    # Example usage
    witness = RobdoeWitnessService()
    
    # Create attestation
    attestation = witness.attest_image_build(
        image_digest="sha256:abcd1234567890",
        image_tag="crypto-triangle:latest",
        registry="ghcr.io/robdoeAiagency101",
        build_context_hash="sha256:contexthash",
        builder="github-actions",
        github_run_id="12345",
        github_sha="abc123def456",
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
    
    print("=== ATTESTATION CREATED ===")
    print(json.dumps(attestation, indent=2))
    
    # Verify attestation
    verification = witness.verify_attestation(
        attestation["attestationId"],
        attestation["signature"]
    )
    
    print("\n=== VERIFICATION RESULT ===")
    print(json.dumps(verification, indent=2))
    
    # Certificate
    print("\n=== WITNESS CERTIFICATE ===")
    print(json.dumps(witness.export_witness_certificate(), indent=2))
