'use client';

import React, { useState } from 'react';

const GENESIS_FIELDS = [
  { id: 'timestamp', label: 'Minted Timestamp', value: '2026-04-23T07:53:50.5144990+10:00', mono: true },
  { id: 'hash', label: 'Genesis Hash', value: 'e14f9a8d2c7b5e3f1a9d4c8b2e6f7a3d', mono: true, copyable: true },
  { id: 'position', label: 'Ledger Position', value: 'Genesis (first entry — position 0)', mono: true },
  { id: 'witnesses', label: 'Witnessed By', value: '14 Byzantine Consensus Engines', mono: false },
  { id: 'verified', label: 'Verified By', value: 'BOM · Himawari-8 · GOES-16 · Meteosat', mono: false },
  { id: 'tsa', label: 'RFC3161 Authority', value: 'Meinberg Time Services (GPS-backed)', mono: false },
  { id: 'version', label: 'System Version', value: 'v1.0.0', mono: true },
  { id: 'kvalue', label: 'Genesis K-Value', value: '0.9953', mono: true },
];

export default function GenesisCertificate() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <section id="genesis" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Genesis / Minting</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            OFFICIAL MINTING CERTIFICATE
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Atmospheric Truth Layer v1.0.0 was officially minted and witnessed on 2026-04-23T07:53:50 AEST.
            Full certificate and all witness signatures: MINTED.md
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Certificate panel */}
          <div className="xl:col-span-2 border border-terminal-green/40 bg-terminal-surface1 overflow-hidden glow-box">
            {/* Header */}
            <div className="border-b border-terminal-green/30 px-6 py-4 bg-terminal-green/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="status-dot-healthy" />
                  <span className="text-sm font-mono font-bold text-terminal-green tracking-wider glow-green-sm">
                    GENESIS MINTING CERTIFICATE
                  </span>
                </div>
                <span className="tag-healthy text-2xs">IMMUTABLE</span>
              </div>
              <div className="text-2xs text-muted-foreground font-mono mt-1">
                Cryptographically anchored · RFC3161 GPS-backed · XYO bound-witness signed
              </div>
            </div>

            {/* ASCII certificate border */}
            <div className="p-6">
              <pre className="ascii-panel text-2xs text-terminal-green/60 mb-4">
{`╔══════════════════════════════════════════════════════════════╗
║        ATMOSPHERIC TRUTH LAYER — GENESIS CERTIFICATE        ║
╚══════════════════════════════════════════════════════════════╝`}
              </pre>

              <div className="flex flex-col gap-0">
                {GENESIS_FIELDS.map((field, i) => (
                  <div
                    key={`genesis-field-${field.id}`}
                    className={`flex items-start justify-between gap-4 py-2.5 border-b border-border/40 last:border-0 group hover:bg-terminal-green/3 transition-colors px-2 -mx-2`}
                  >
                    <span className="text-xs font-mono text-muted-foreground shrink-0 w-40">
                      <span className="text-terminal-dark mr-2">│</span>
                      {field.label}
                    </span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span
                        className={`text-xs font-mono text-terminal-green text-right ${
                          field.mono ? 'font-mono tabular-nums' : ''
                        } ${field.id === 'hash' ? 'hash-text text-terminal-dim' : ''}`}
                      >
                        {field.value}
                      </span>
                      {field.copyable && (
                        <button
                          onClick={() => handleCopy(field.value, field.id)}
                          className="text-2xs font-mono text-muted-foreground hover:text-terminal-green transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                          aria-label={`Copy ${field.label}`}
                        >
                          {copiedField === field.id ? (
                            <span className="text-terminal-green">✓</span>
                          ) : (
                            <span>⎘</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <pre className="ascii-panel text-2xs text-terminal-green/60 mt-4">
{`╔══════════════════════════════════════════════════════════════╗
║  This minting is cryptographically anchored via RFC3161      ║
║  GPS-backed authority and XYO bound-witness signatures.      ║
║  The ledger entry is immutable and tamper-evident.           ║
╚══════════════════════════════════════════════════════════════╝`}
              </pre>
            </div>
          </div>

          {/* Right panel — immutability proof */}
          <div className="flex flex-col gap-4">
            <div className="border border-border bg-terminal-surface1 p-5">
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-4">
                Immutability Proof
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Ledger Type', value: 'Append-Only', icon: '≡' },
                  { label: 'Chain Position', value: 'Position 0', icon: '⊙' },
                  { label: 'Hash Algorithm', value: 'SHA-256', icon: '⬡' },
                  { label: 'Timestamp Auth', value: 'RFC3161 GPS', icon: '◎' },
                  { label: 'Witness Protocol', value: 'XYO v3', icon: '◉' },
                  { label: 'Seal Algorithm', value: 'Secp256k1', icon: '◆' },
                ].map((item) => (
                  <div
                    key={`proof-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                    className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-terminal-green text-xs">{item.icon}</span>
                      <span className="text-2xs font-mono text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono text-terminal-green tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-terminal-surface1 p-5">
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
                Witness Engines at Genesis
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Engine-001', 'Engine-002', 'Engine-003', 'Engine-004',
                  'Engine-005', 'Engine-006', 'Engine-007', 'Engine-008',
                  'Engine-009', 'Engine-010', 'Engine-011', 'Engine-012',
                  'Engine-013', 'Engine-014',
                ].map((eng) => (
                  <div
                    key={`genesis-engine-${eng}`}
                    className="flex items-center gap-1.5 text-2xs font-mono"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-terminal-green" style={{ minWidth: '6px' }} />
                    <span className="text-terminal-dim">{eng}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://github.com/AiTenetAgency101/atmospheric-truth-layer/blob/main/MINTED.md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terminal text-xs py-3 justify-center"
            >
              View Full Certificate →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}