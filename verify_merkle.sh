#!/bin/bash
set -e

REQUIRED_FILES=(
    "index.html"
    "web3.html"
    "portfolio.html"
    "connect.html"
    "aiagency.html"
    "AiAgency101_OnChainLedger.json"
    "Engine_Core_Blueprint.json"
    "state_manifest.json"
    "mesh_witness_ledger.log"
    "witness_chain.log"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file not found: $file" >&2
        exit 1
    fi
done

sha256sum "${REQUIRED_FILES[@]}" > leaf_hashes.txt
sha256sum leaf_hashes.txt > MERKLE_ROOT.txt

echo "Merkle verification complete. Root hash written to MERKLE_ROOT.txt"
