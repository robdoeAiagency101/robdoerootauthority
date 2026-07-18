#!/usr/bin/env bash
# ==============================================================================
# ROBDOE UNIVERSAL MONOLITH DEPLOYMENT MODULE
# Target Platforms: Ubuntu, Debian, WSL2, Cloud Instances
# ==============================================================================

set -e
export DEBIAN_FRONTEND=noninteractive

echo "====== [1/4] AUDITING LOCAL DESCRIPTOR ENVIRONMENT ======"
# Auto-detect privilege layer natively on Linux
if [ "$(id -u)" -ne 0 ]; then
    echo "[ERROR] This monolithic module requires elevated system privileges. Run with sudo."
    exit 1
fi

# Auto-provision system runtime dependencies
echo "[INIT] Validating physical packages..."
apt-get update -qq && apt-get install -y -qq docker.io docker-compose-v2 git socat curl > /dev/null

echo "====== [2/4] VERIFYING WORKSPACE TREE STRUCTURE ======"
# Establish local identity mapping nodes natively on Linux
mkdir -p /C/RobDoeIdentity /app/data
if [ ! -f /C/RobDoeIdentity/node_profile.conf ]; then
    echo "[MANIFOLD] Writing baseline profile signatures..."
    echo -e "[Identity-Node]\nNodeID=ROBDOE_GLOBAL_01\nStatus=Ready" > /C/RobDoeIdentity/node_profile.conf
fi

echo "====== [3/4] ORCHESTRATING CONTAINER STATE MATRIX ======"
# Pull and force execution of the active background engine layer
cd "$(dirname "$0")"
docker compose down --remove-orphans || true
docker compose up -d --build

echo "====== [4/4] VALIDATING LIVE STATE LAYER ======"
# Read the current execution parameters
sleep 2
if docker ps | grep -q "robdoe_core_engine"; then
    echo "========================================================"
    echo "[SUCCESS] Monolithic environment deployment confirmed!"
    echo "-> Runtime: Active Background Daemon Mode"
    echo "========================================================"
else
    echo "[ERROR] Core processor initialization anomaly. Inspecting engine logs:"
    docker logs robdoe_core_engine
fi
