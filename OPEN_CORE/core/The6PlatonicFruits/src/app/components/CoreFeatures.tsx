import React from 'react';

const FEATURES = [
  {
    id: 'tile-decomp',
    icon: '⬡',
    title: 'Cryptographic Tile Decomposition',
    desc: 'Every satellite grid tile is independently SHA256-hashed. Any pixel-level modification invalidates the entire tile hash, making silent data manipulation cryptographically impossible.',
    tags: ['SHA256', 'Grid Tiles', '37M+ Verified'],
  },
  {
    id: 'multi-sat',
    icon: '◎',
    title: 'Multi-Satellite Cross-Verification',
    desc: 'Independent observations from BOM, Himawari-8, GOES-16, and Meteosat must converge before any tile is accepted. No single satellite controls the truth.',
    tags: ['4 Sources', 'Convergence Required', 'Global Coverage'],
  },
  {
    id: 'byzantine',
    icon: '≡',
    title: '14-Engine Byzantine Consensus',
    desc: 'Decisions require K ≥ 0.99 coherence across 14 distributed engines with supermajority 10/14. A single compromised engine cannot alter consensus outcome.',
    tags: ['K ≥ 0.99', '14 Engines', 'BFT'],
  },
  {
    id: 'xyo',
    icon: '◉',
    title: 'XYO Bound-Witness Ledger',
    desc: 'The XYO witness ledger is write-once — no entry can be modified or deleted without breaking the cryptographic chain of custody. Append-only by design.',
    tags: ['Append-Only', 'XYO Network', 'Immutable'],
  },
  {
    id: 'cycle-lock',
    icon: '⊙',
    title: '90-Day Cycle Lock',
    desc: 'Engine cycles operate on a 90-day locked window, ensuring temporal consistency and preventing retroactive manipulation of historical atmospheric records.',
    tags: ['90-Day Window', 'Temporal Lock', 'Cycle-Bound'],
  },
  {
    id: 'realtime',
    icon: '▶',
    title: 'Real-Time Verification',
    desc: 'Any party worldwide can independently verify any tile hash against the public immutable ledger in real time. No intermediaries, no delays, no gatekeepers.',
    tags: ['Public Ledger', 'Zero Trust', 'Instant Verify'],
  },
];

export default function CoreFeatures() {
  return (
    <section id="features" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Core Features</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            CRYPTOGRAPHIC PRIMITIVES
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Six interlocking cryptographic systems that together produce tamper-proof atmospheric truth.
          </p>
        </div>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border mb-10 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="p-6 bg-red-500/5">
            <div className="text-xs font-mono font-bold text-red-400 tracking-widest uppercase mb-4">
              ✗ The Problem Today
            </div>
            <pre className="ascii-panel text-xs text-red-400/80 leading-loose">
{`Weather Agency
     ↓
 Claims Data
     ↓
    You
     ↓
Must Trust`}
            </pre>
            <p className="text-xs text-muted-foreground font-mono mt-4 leading-relaxed">
              Traditional weather services require institutional faith. No cryptographic proof. No independent verification. No auditability.
            </p>
          </div>
          <div className="p-6 bg-terminal-green/5">
            <div className="text-xs font-mono font-bold text-terminal-green tracking-widest uppercase mb-4">
              ✓ The ATL Solution
            </div>
            <pre className="ascii-panel text-xs text-terminal-green leading-loose">
{`Satellite
     ↓
 Tile Hash
     ↓
Byzantine Consensus
     ↓
Witness Ledger
     ↓
    You`}
            </pre>
            <p className="text-xs text-terminal-dim font-mono mt-4 leading-relaxed">
              No trust. No opacity. Just math.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 border border-border divide-y md:divide-y-0 divide-border">
          {FEATURES?.map((feature, i) => (
            <div
              key={`feature-${feature?.id}`}
              className={`p-6 flex flex-col gap-4 hover:bg-terminal-green/3 transition-colors group border-b border-r border-border ${
                i % 3 === 2 ? 'border-r-0' : ''
              } ${i >= 3 ? 'border-b-0' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl text-terminal-green glow-green-sm group-hover:scale-110 transition-transform">
                  {feature?.icon}
                </span>
                <h3 className="text-sm font-mono font-bold text-terminal-green leading-tight">
                  {feature?.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed flex-1">
                {feature?.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {feature?.tags?.map((tag) => (
                  <span
                    key={`tag-${feature?.id}-${tag?.replace(/\s+/g, '-')?.toLowerCase()}`}
                    className="tag-terminal text-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}