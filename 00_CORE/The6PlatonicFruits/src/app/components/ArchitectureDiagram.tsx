import React from 'react';

const LAYERS = [
  {
    id: 'signal',
    num: '01',
    name: 'SIGNAL LAYER',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    sources: [
      { name: 'BOM', region: 'Australia' },
      { name: 'Himawari-8', region: 'Japan/Asia-Pacific' },
      { name: 'GOES-16', region: 'USA/Americas' },
      { name: 'Meteosat', region: 'Europe/Africa' },
    ],
    desc: 'Raw satellite frames ingested from four independent global sources. No single source controls the input.',
  },
  {
    id: 'decomp',
    num: '02',
    name: 'DECOMPOSITION LAYER',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/5',
    sources: [
      { name: 'Sub-frame tiles', region: 'Grid segmentation' },
      { name: 'SHA256 hashing', region: 'Cryptographic fingerprint' },
      { name: 'Tile validation', region: 'Circle/Monotonic/Range' },
      { name: 'Chain anchoring', region: 'Roothash binding' },
    ],
    desc: 'Every grid tile is independently SHA256-hashed. Any pixel-level tampering invalidates the hash chain.',
  },
  {
    id: 'witness',
    num: '03',
    name: 'WITNESS LAYER',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/30',
    bgColor: 'bg-terminal-green/5',
    sources: [
      { name: 'XYO mesh nodes', region: 'Bound-witness protocol' },
      { name: 'Immutable ledger', region: 'Append-only chain' },
      { name: 'RFC3161 anchoring', region: 'GPS-backed timestamp' },
      { name: 'Consensus gate', region: 'K ≥ 0.99 threshold' },
    ],
    desc: 'XYO bound-witness mesh signs observations. RFC3161 GPS-backed timestamps make backdating cryptographically impossible.',
  },
];

export default function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Architecture</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            THREE-LAYER VERIFICATION
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Full technical deep-dive: ARCHITECTURE.md · 14 Byzantine engines · Supermajority 10/14 required · K ≥ 0.99
          </p>
        </div>

        {/* ASCII architecture panel */}
        <div className="border border-border bg-terminal-surface1 p-0 mb-8 overflow-x-auto">
          <div className="border-b border-border px-6 py-2 bg-black/40">
            <span className="text-2xs text-muted-foreground font-mono">
              ARCHITECTURE.md — Three-Layer Verification System
            </span>
          </div>
          <div className="p-6">
            <pre className="ascii-panel text-xs leading-relaxed whitespace-pre overflow-x-auto">
{`╔═══════════════════════════════════════════════════════════════════════════════╗
║                           THREE-LAYER VERIFICATION                           ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  LAYER 1: SIGNAL              LAYER 2: DECOMPOSITION    LAYER 3: WITNESS      ║
║  ┌─────────────────┐          ┌──────────────────┐      ┌─────────────────┐   ║
║  │ BOM (Australia) │          │ Sub-frame tiles  │      │ XYO mesh nodes  │   ║
║  │ Himawari (Japan)│──────────▶│ SHA256 hashing   │─────▶│ Bound-witness   │   ║
║  │ GOES (USA)      │          │ Cryptographic    │      │ Immutable ledger│   ║
║  │ Meteosat (EU)   │          │ fingerprints     │      │ Consensus check │   ║
║  └─────────────────┘          └──────────────────┘      └─────────────────┘   ║
║                                                                               ║
║  Raw Sky → Tiles → Hashes → Witness → Ledger → Truth                          ║
║                                                                               ║
║  Consensus gate: 14 engines · Supermajority 10/14 · K ≥ 0.99 threshold       ║
║  Execution gates open ONLY when K ≥ 0.99 — mathematics, not trust            ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝`}
            </pre>
          </div>
        </div>

        {/* Layer detail cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border divide-y lg:divide-y-0 lg:divide-x divide-border">
          {LAYERS?.map((layer, i) => (
            <div
              key={`layer-${layer?.id}`}
              className={`p-6 ${layer?.bgColor} flex flex-col gap-5 relative`}
            >
              {/* Arrow connector (not last) */}
              {i < LAYERS?.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="text-terminal-green text-lg font-mono">▶</div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className={`text-2xs font-mono font-bold tracking-widest ${layer?.color}`}>
                  [{layer?.num}]
                </span>
                <span className={`text-sm font-mono font-bold tracking-wide ${layer?.color}`}>
                  {layer?.name}
                </span>
              </div>

              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                {layer?.desc}
              </p>

              <div className="flex flex-col gap-2">
                {layer?.sources?.map((source) => (
                  <div
                    key={`source-${layer?.id}-${source?.name?.replace(/\s+/g, '-')?.toLowerCase()}`}
                    className={`flex items-center justify-between py-1.5 border-b ${layer?.borderColor} last:border-0`}
                  >
                    <span className={`text-xs font-mono font-semibold ${layer?.color}`}>
                      {source?.name}
                    </span>
                    <span className="text-2xs text-muted-foreground font-mono">
                      {source?.region}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Flow summary */}
        <div className="mt-6 border border-border p-5 bg-terminal-surface1">
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            {[
              { label: 'Raw Sky', color: 'text-blue-400' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Tiles', color: 'text-yellow-400' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Hashes', color: 'text-yellow-400' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Witness', color: 'text-terminal-green' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Ledger', color: 'text-terminal-green' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Truth', color: 'text-terminal-green glow-green' },
            ]?.map((item, i) => (
              <span key={`flow-${i}`} className={`font-bold ${item?.color}`}>
                {item?.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-3 leading-relaxed">
            The Atmospheric Truth Layer does not predict, model, or estimate.
            It cryptographically witnesses and immutably records. Every tile hash is independently
            verifiable against the public XYO ledger — no account, API key, or trust relationship required.
          </p>
        </div>
      </div>
    </section>
  );
}