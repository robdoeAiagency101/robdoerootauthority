import React from 'react';

const SECURITY_ITEMS = [
  {
    id: 'sha256',
    title: 'SHA256 Tile Hashing',
    icon: '⬡',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/20',
    desc: 'Every satellite grid tile is independently hashed; any pixel-level tampering invalidates the hash. The chain of custody is mathematically enforced.',
    spec: 'SHA-256 · FIPS 180-4',
  },
  {
    id: 'hmac',
    title: 'HMAC-SHA256 Witness Signatures',
    icon: '◉',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/20',
    desc: 'Each satellite observer node signs its observation, cryptographically binding the hash to the observer identity. Forgery requires breaking SHA-256.',
    spec: 'HMAC-SHA-256 · RFC 2104',
  },
  {
    id: 'rfc3161',
    title: 'RFC3161 Timestamping',
    icon: '◎',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    desc: 'GPS-backed timestamp authority binds the signed hash bundle to an independently verifiable moment. Backdating is cryptographically impossible.',
    spec: 'RFC 3161 · GPS-Backed · Meinberg TSA',
  },
  {
    id: 'ledger',
    title: 'Append-Only Ledger',
    icon: '≡',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/20',
    desc: 'The XYO witness ledger is write-once — no entry can be modified or deleted without breaking the chain of custody. Immutability is structural, not policy.',
    spec: 'XYO Bound-Witness · Append-Only',
  },
  {
    id: 'multisource',
    title: 'Multi-Satellite Consensus',
    icon: '◈',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    desc: 'Independent observations from BOM, Himawari-8, GOES-16, and Meteosat must converge before a tile is accepted. No single source controls truth.',
    spec: '4 Sources · Convergence Gate',
  },
  {
    id: 'bft',
    title: '14-Engine Byzantine Fault Tolerance',
    icon: '▲',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    desc: 'Decisions require K ≥ 0.99 coherence across 14 distributed engines. A single compromised engine cannot alter consensus. Supermajority: 10/14.',
    spec: 'PBFT-style · K ≥ 0.99 · 14 Engines',
  },
  {
    id: 'containers',
    title: 'Non-Root Containers',
    icon: '⊙',
    color: 'text-muted-foreground',
    borderColor: 'border-border',
    desc: 'All services run as non-root; Kubernetes network policies restrict inter-service traffic to declared paths only. Minimal attack surface by design.',
    spec: 'Non-Root · Network Policies · K8s',
  },
  {
    id: 'secp256k1',
    title: 'Secp256k1 Elliptic Curve Seals',
    icon: '◆',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    desc: 'SymPy Secp256k1 elliptic curve cryptography provides cryptographic seals on witness objects with attestation_hash, proof_anchor, and consensus_level.',
    spec: 'Secp256k1 · SymPy · ECC',
  },
];

export default function SecurityTrust() {
  return (
    <section id="security" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Security &amp; Trust</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            CRYPTOGRAPHIC INTEGRITY STACK
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Full threat model and cryptographic specification: SECURITY.md
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 border border-border">
          {SECURITY_ITEMS?.map((item, i) => (
            <div
              key={`security-${item?.id}`}
              className={`p-5 flex flex-col gap-3 border-b border-r border-border hover:bg-terminal-green/3 transition-colors group ${
                i % 4 === 3 ? 'xl:border-r-0' : ''
              } ${i >= SECURITY_ITEMS?.length - 4 ? 'xl:border-b-0' : ''} ${
                i >= SECURITY_ITEMS?.length - 2 ? 'md:border-b-0' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-lg ${item?.color} group-hover:scale-110 transition-transform`}>
                  {item?.icon}
                </span>
                <h3 className={`text-xs font-mono font-bold ${item?.color} leading-tight`}>
                  {item?.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed flex-1">
                {item?.desc}
              </p>
              <div className={`border ${item?.borderColor} px-2 py-1 bg-black/30`}>
                <span className={`text-2xs font-mono ${item?.color} tracking-wider`}>
                  {item?.spec}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Witness object structure */}
        <div className="mt-8 border border-border bg-terminal-surface1">
          <div className="border-b border-border px-5 py-3 bg-black/40">
            <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
              Witness Object Structure — XYO Bound-Witness
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="code-block">
              <pre className="text-xs leading-relaxed">
{`{
  "witness_id": "wtns-e3f9a2b4c7d8e1f0",
  "attestation_hash": "sha256:e14f9a8d2c7b5e3f...",
  "proof_anchor": "xyo:bound-witness-v3",
  "consensus_level": 0.9953,
  "time_clock_anchor": "rfc3161:2026-04-30T21:41:03Z",
  "satellite_sources": ["BOM", "Himawari-8", "GOES-16", "Meteosat"],
  "tile_count": 37445846,
  "k_value": 0.9953,
  "byzantine_engines": 14,
  "seal": {
    "algorithm": "secp256k1",
    "signature": "3045022100a8b2c3...",
    "verifiable": true
  }
}`}
              </pre>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-1">
                Verification Flow
              </div>
              {[
                { step: '01', label: 'Obtain tile hash', detail: 'Query public ledger at any time' },
                { step: '02', label: 'Verify SHA256', detail: 'Hash the raw tile data independently' },
                { step: '03', label: 'Check witness signature', detail: 'Validate HMAC-SHA256 against XYO node' },
                { step: '04', label: 'Confirm RFC3161 timestamp', detail: 'Verify against Meinberg TSA' },
                { step: '05', label: 'Validate K-value', detail: 'Confirm consensus ≥ 0.99 at time of witness' },
                { step: '06', label: 'Independent verification complete', detail: 'No trust required — mathematics only' },
              ]?.map((v) => (
                <div
                  key={`verify-step-${v?.step}`}
                  className="flex items-start gap-3 py-1.5 border-b border-border/40 last:border-0"
                >
                  <span className="text-terminal-green font-mono font-bold text-2xs shrink-0 tabular-nums">
                    [{v?.step}]
                  </span>
                  <div>
                    <div className="text-xs font-mono font-semibold text-terminal-dim">
                      {v?.label}
                    </div>
                    <div className="text-2xs text-muted-foreground font-mono mt-0.5">
                      {v?.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}