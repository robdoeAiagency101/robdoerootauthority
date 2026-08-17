#!/bin/bash
sha256sum index.html web3.html portfolio.html connect.html aiagency.html \
AiAgency101_OnChainLedger.json Engine_Core_Blueprint.json state_manifest.json \
mesh_witness_ledger.log witness_chain.log > leaf_hashes.txt

sha256sum leaf_hashes.txt > MERKLE_ROOT.txt
