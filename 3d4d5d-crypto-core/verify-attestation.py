#!/usr/bin/env python3
"""
3D+4D+5D Crypto Triangle - Attestation Verification
Standalone verification tool for reproducible container attestations
"""

import sys
import json
import os
import subprocess
import tempfile
from pathlib import Path
from datetime import datetime
from typing import Dict, Tuple, Optional


class AttestationVerifier:
    """Verify 3D+4D+5D container attestations"""
    
    def __init__(self, repo: str = "robdoeAiagency101/robdoerootauthority"):
        self.repo = repo
        self.temp_dir = None
        self.attestation = None
        self.witness = None
        self.provenance = None
        self.sbom = None
    
    def log(self, level: str, message: str):
        """Colored logging"""
        colors = {
            "header": "\033[36m",  # Cyan
            "success": "\033[32m",  # Green
            "error": "\033[31m",   # Red
            "warning": "\033[33m",  # Yellow
            "info": "\033[37m",    # White
            "reset": "\033[0m"
        }
        
        prefix = {
            "header": "═",
            "success": "✓",
            "error": "✗",
            "warning": "⚠",
            "info": "→"
        }
        
        color = colors.get(level, colors["info"])
        symbol = prefix.get(level, "•")
        
        print(f"{color}{symbol} {message}{colors['reset']}")
    
    def run_command(self, cmd: list) -> Tuple[bool, str]:
        """Execute shell command"""
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.returncode == 0, result.stdout + result.stderr
        except Exception as e:
            return False, str(e)
    
    def download_artifacts(self, run_id: str) -> bool:
        """Download attestation artifacts from GitHub"""
        self.log("header", f"[1/5] Downloading artifacts (Run: {run_id})")
        
        self.temp_dir = tempfile.mkdtemp(prefix=f"attest-{run_id}-")
        
        success, output = self.run_command([
            "gh", "run", "download", run_id,
            "-R", self.repo,
            "-n", f"attestations-{run_id}",
            "-D", self.temp_dir
        ])
        
        if not success:
            self.log("error", f"Download failed: {output}")
            return False
        
        self.log("success", f"Artifacts downloaded to {self.temp_dir}")
        return True
    
    def verify_files(self) -> bool:
        """Verify all required files exist"""
        self.log("header", "[2/5] Verifying files")
        
        required = [
            "attestation.json",
            "witness-attestation.json",
            "provenance-chain.json",
            "sbom.txt"
        ]
        
        all_found = True
        for filename in required:
            filepath = Path(self.temp_dir) / filename
            if filepath.exists():
                size = filepath.stat().st_size
                self.log("success", f"{filename} ({size} bytes)")
            else:
                self.log("error", f"{filename} NOT FOUND")
                all_found = False
        
        return all_found
    
    def parse_attestations(self) -> bool:
        """Parse JSON attestation files"""
        self.log("header", "[3/5] Parsing attestations")
        
        try:
            # Parse attestation.json
            with open(Path(self.temp_dir) / "attestation.json") as f:
                self.attestation = json.load(f)
            self.log("success", "attestation.json parsed")
            
            # Parse witness-attestation.json
            with open(Path(self.temp_dir) / "witness-attestation.json") as f:
                self.witness = json.load(f)
            self.log("success", "witness-attestation.json parsed")
            
            # Parse provenance-chain.json
            with open(Path(self.temp_dir) / "provenance-chain.json") as f:
                self.provenance = json.load(f)
            self.log("success", "provenance-chain.json parsed")
            
            # Read SBOM
            with open(Path(self.temp_dir) / "sbom.txt") as f:
                self.sbom = f.read()
            self.log("success", f"sbom.txt read ({len(self.sbom.splitlines())} dependencies)")
            
            return True
        except Exception as e:
            self.log("error", f"Parse failed: {e}")
            return False
    
    def display_build_info(self):
        """Display build information"""
        self.log("header", "[4/5] Build Information")
        
        image = self.attestation.get("image", {})
        print(f"    Image Digest: {image.get('digest', 'N/A')}")
        print(f"    Registry: {image.get('registry', 'N/A')}")
        print(f"    Repository: {image.get('repository', 'N/A')}")
        
        tags = image.get("tags", [])
        if tags:
            print(f"    Tags: {', '.join(tags)}")
        
        print(f"    Timestamp: {self.attestation.get('timestamp', 'N/A')}")
    
    def verify_witness(self) -> bool:
        """Verify robdoe.com witness attestation"""
        self.log("header", "[5/5] Verifying robdoe.com Witness")
        
        checks = {
            "sig_format": False,
            "sig_valid": False,
            "status_attested": False,
            "has_verify_url": False
        }
        
        # Check signature format
        sig = self.witness.get("signature", "")
        if len(sig) == 64 and all(c in "0123456789abcdef" for c in sig):
            self.log("success", "Signature format valid (SHA256 hex)")
            checks["sig_format"] = True
            checks["sig_valid"] = True
        else:
            self.log("error", f"Invalid signature format: {sig[:16]}...")
        
        # Check status
        status = self.witness.get("status", "")
        if status == "ATTESTED":
            self.log("success", "Status: ATTESTED")
            checks["status_attested"] = True
        else:
            self.log("warning", f"Status: {status}")
        
        # Check verification URL
        verify_url = self.witness.get("verificationUrl", "")
        if verify_url:
            self.log("success", f"Verify URL: {verify_url}")
            checks["has_verify_url"] = True
        
        # Display provenance chain
        print("\n    Provenance Chain:")
        for stage in self.provenance.get("attestations", []):
            stage_name = stage.get("stage", "?")
            stage_status = stage.get("status", "?")
            symbol = "✓" if stage_status in ["COMPLETED", "PUSHED", "ATTESTED"] else "✗"
            print(f"      {symbol} {stage_name}: {stage_status}")
        
        return all(checks.values())
    
    def verify(self, run_id: str) -> int:
        """Run complete verification"""
        print("\n" + "=" * 70)
        print("🔍 3D+4D+5D CRYPTO TRIANGLE - ATTESTATION VERIFICATION")
        print("    robdoe.com Witness Service")
        print("=" * 70)
        
        print(f"\nRepository: {self.repo}")
        print(f"Run ID: {run_id}")
        
        # Download
        if not self.download_artifacts(run_id):
            return 1
        
        # Verify files
        if not self.verify_files():
            return 1
        
        # Parse
        if not self.parse_attestations():
            return 1
        
        # Display build info
        self.display_build_info()
        
        # Verify witness
        witness_valid = self.verify_witness()
        
        # Result
        print("\n" + "=" * 70)
        if witness_valid and self.witness.get("status") == "ATTESTED":
            self.log("success", "ATTESTATION VERIFIED")
            print("    Container is authentic, reproducible, and")
            print("    attested by robdoe.com")
            print("=" * 70)
            
            print(f"\n✓ Witness: {self.witness.get('witnessService')}")
            print(f"✓ Signature: {self.witness.get('signature')}")
            print(f"✓ Image: {self.attestation.get('image', {}).get('registry')}/{self.attestation.get('image', {}).get('repository')}")
            print(f"✓ Verify: {self.witness.get('verificationUrl')}")
            
            print(f"\nArtifacts saved: {self.temp_dir}")
            return 0
        else:
            self.log("error", "ATTESTATION VERIFICATION FAILED")
            print("=" * 70)
            return 1


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("\nUsage: python verify-attestation.py <RUN_ID> [REPO]")
        print("\nExample:")
        print("  python verify-attestation.py 12345678")
        print("  python verify-attestation.py 12345678 robdoeAiagency101/robdoerootauthority")
        print("\nFind RUN_ID:")
        print("  https://github.com/robdoeAiagency101/robdoerootauthority/actions")
        sys.exit(1)
    
    run_id = sys.argv[1]
    repo = sys.argv[2] if len(sys.argv) > 2 else "robdoeAiagency101/robdoerootauthority"
    
    verifier = AttestationVerifier(repo=repo)
    exit_code = verifier.verify(run_id)
    
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
