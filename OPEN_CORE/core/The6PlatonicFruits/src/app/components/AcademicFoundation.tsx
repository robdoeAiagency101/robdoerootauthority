import React from 'react'
;const REFERENCES = [
  {
    id: 'bft',
    title: 'Byzantine Fault Tolerance (BFT)',
    authors: 'Lamport, Shostak & Pease (1982); Castro & Liskov (1999)',
    detail: 'PBFT-style consensus ensures correctness when up to ⌊(n−1)/3⌋ nodes behave arbitrarily. ATL employs 14 engines with K ≥ 0.99 threshold.',
    tag: 'Consensus Theory',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    id: 'ct',
    title: 'Hash-Chained Append-Only Ledgers',
    authors: 'Laurie et al., RFC 6962 — Certificate Transparency',
    detail: 'Hash-linked records provide tamper-evidence without requiring a central authority. ATL applies this to atmospheric tile chains.',
    tag: 'Ledger Design',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'rfc3161',
    title: 'RFC3161 Trusted Timestamping',
    authors: 'Adams et al., RFC 3161',
    detail: 'The Internet X.509 PKI Time-Stamp Protocol provides externally verifiable, GPS-backed time anchoring. Meinberg TSA is the ATL authority.',
    tag: 'Timestamping',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
  },
  {
    id: 'xyo',
    title: 'XYO Cryptonetwork',
    authors: 'XYO Foundation — Proof-of-Origin Bound-Witness Protocol',
    detail: 'Location-aware, decentralized attestation without a trusted third party. ATL uses XYO mesh nodes as the witness layer.',
    tag: 'Witness Network',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/20',
  },
];

export default function AcademicFoundation() {
  return (
    <section id="academic" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Academic Foundation</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            GROUNDED IN ESTABLISHED CRYPTOGRAPHIC SCIENCE
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            The system design is grounded in established cryptographic and distributed-systems principles.
            See ARCHITECTURE.md for implementation details and SECURITY.md for the full cryptographic specification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
          {REFERENCES?.map((ref, i) => (
            <div
              key={`ref-${ref?.id}`}
              className={`p-6 flex flex-col gap-3 border-b border-r border-border hover:bg-terminal-green/3 transition-colors ${
                i % 2 === 1 ? 'border-r-0' : ''
              } ${i >= 2 ? 'border-b-0' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className={`text-sm font-mono font-bold ${ref?.color} leading-tight`}>
                  {ref?.title}
                </h3>
                <span className={`tag-terminal text-2xs shrink-0 border ${ref?.borderColor}`}>
                  {ref?.tag}
                </span>
              </div>
              <div className={`text-2xs font-mono ${ref?.color} opacity-70 leading-relaxed`}>
                {ref?.authors}
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                {ref?.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 border border-border p-5 bg-terminal-surface1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-mono font-bold text-terminal-green mb-1">
              Full Implementation Details
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              ARCHITECTURE.md · SECURITY.md · SERIES_A_PITCH.md
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <a href="#docs" className="btn-terminal-ghost text-2xs py-1.5 px-3">
              Documentation →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}