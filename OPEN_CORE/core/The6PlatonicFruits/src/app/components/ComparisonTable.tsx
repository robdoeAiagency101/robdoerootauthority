import React from 'react';

const COMPARISON = [
  {
    id: 'trust',
    dimension: 'Trust Model',
    traditional: 'Trust-based — believe the agency',
    atl: 'Proof-based — verify the math',
    atlGood: true,
  },
  {
    id: 'integrity',
    dimension: 'Data Integrity',
    traditional: 'Institutional attestation',
    atl: 'SHA256 tile hashing + HMAC-SHA256 witness signatures',
    atlGood: true,
  },
  {
    id: 'audit',
    dimension: 'Auditability',
    traditional: 'None (or proprietary)',
    atl: 'Append-only immutable ledger — public, permanent',
    atlGood: true,
  },
  {
    id: 'consensus',
    dimension: 'Consensus',
    traditional: 'Single source',
    atl: '14-engine Byzantine fault-tolerant (K ≥ 0.99)',
    atlGood: true,
  },
  {
    id: 'timestamp',
    dimension: 'Timestamping',
    traditional: 'Internal clock',
    atl: 'RFC3161 GPS-backed authority — backdating impossible',
    atlGood: true,
  },
  {
    id: 'multisource',
    dimension: 'Multi-Source Verification',
    traditional: 'Occasional',
    atl: 'Always — BOM + Himawari-8 + GOES-16 + Meteosat',
    atlGood: true,
  },
  {
    id: 'revision',
    dimension: 'Historical Revision',
    traditional: 'Possible',
    atl: 'Cryptographically prevented',
    atlGood: true,
  },
];

export default function ComparisonTable() {
  return (
    <section id="comparison" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Why We&apos;re Different</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            TRADITIONAL WEATHER SERVICES vs ATMOSPHERIC TRUTH LAYER
          </h2>
        </div>

        <div className="border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-terminal-surface1 border-b border-border">
            <div className="p-4 border-r border-border">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
                Dimension
              </span>
            </div>
            <div className="p-4 border-r border-border bg-red-500/5">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-sm">✗</span>
                <span className="text-2xs font-mono font-bold text-red-400 tracking-widest uppercase">
                  Traditional Services
                </span>
              </div>
            </div>
            <div className="p-4 bg-terminal-green/5">
              <div className="flex items-center gap-2">
                <span className="text-terminal-green text-sm">✓</span>
                <span className="text-2xs font-mono font-bold text-terminal-green tracking-widest uppercase">
                  Atmospheric Truth Layer
                </span>
              </div>
            </div>
          </div>

          {/* Table rows */}
          {COMPARISON?.map((row, i) => (
            <div
              key={`compare-${row?.id}`}
              className={`grid grid-cols-3 border-b border-border last:border-0 hover:bg-terminal-green/2 transition-colors ${
                i % 2 === 0 ? 'bg-black/20' : ''
              }`}
            >
              <div className="p-4 border-r border-border flex items-center">
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  {row?.dimension}
                </span>
              </div>
              <div className="p-4 border-r border-border bg-red-500/3">
                <span className="text-xs font-mono text-red-400/80">
                  {row?.traditional}
                </span>
              </div>
              <div className="p-4 bg-terminal-green/3">
                <span className="text-xs font-mono text-terminal-green">
                  {row?.atl}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}