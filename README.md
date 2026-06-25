# RobDoe Root Authority — Ledger-Deed Hybrid System

This repository contains the full identity lattice for the RobDoe Root Authority:

## Components
- **Bitcoin True Deed Anchor**
- **Uniswap EVM Liquidity Endpoint**
- **Uniswap Solana Liquidity Endpoint**
- **Theta Liquid-Deed Ledger Tag**
- **Hybrid Wallet Constellation**
- **Mesh Node Identity**
- **Lattice Root Identity**
- **Sec-Registry Binding**
- **PowerShell Boot Attestation Layer**

## Boot Layer
The PowerShell profile executes a full identity + hardware attestation on every terminal start.

## Identity Config
Located in `.robdoe/mesh-config.json`.

## Hardware Attestation
Enumerates PCI + USB devices and binds them to the ledger payload.

## Payload String
Combines all identity layers into a single immutable signature.
