import React from 'react';

const CHECKLIST = [
  {
    id: 'technical',
    category: 'Technical',
    color: 'text-terminal-green',
    borderColor: 'border-terminal-green/20',
    items: [
      'All 14 Byzantine engines synchronized (K ≥ 0.99)',
      'Multi-satellite verification live (BOM + Himawari-8 + GOES-16 + Meteosat)',
      'Production Docker + Kubernetes infrastructure deployed',
      'PostgreSQL + Redis persistence configured',
      'Prometheus + Grafana + Jaeger monitoring active',
    ],
  },
  {
    id: 'documentation',
    category: 'Documentation',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    items: [
      'README, ARCHITECTURE, API, DEPLOYMENT, SECURITY all complete',
      'BUSINESS.md and USE_CASES.md documented',
      'Investor materials present in repository',
      'SERIES_A_PITCH.md with financial projections',
    ],
  },
  {
    id: 'business',
    category: 'Business Case',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    items: [
      'Market analysis — $155B+ TAM documented',
      'Revenue model — API + SaaS + licensing',
      'Financial projections in BUSINESS.md',
      'Go-to-market strategy defined',
    ],
  },
  {
    id: 'security',
    category: 'Security',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    items: [
      'SHA256 + HMAC-SHA256 + RFC3161 implemented',
      'Append-only ledger — tamper-evident by design',
      'Non-root containers + network policies',
      'Full threat model in SECURITY.md',
    ],
  },
];

export default function SeriesASection() {
  return (
    <section id="series-a" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Series A Ready</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            DILIGENCE-READY ACROSS ALL DIMENSIONS
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Atmospheric Truth Layer is prepared for Series A diligence.
            Full investor materials: SERIES_A_PITCH.md · Business analysis: BUSINESS.md
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border mb-8">
          {CHECKLIST?.map((section, si) => (
            <div
              key={`series-a-${section?.id}`}
              className={`p-6 border-b border-r border-border ${
                si % 2 === 1 ? 'border-r-0' : ''
              } ${si >= 2 ? 'border-b-0' : ''}`}
            >
              <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-4 ${section?.color}`}>
                ✓ {section?.category}
              </div>
              <div className="flex flex-col gap-2">
                {section?.items?.map((item) => (
                  <div
                    key={`series-item-${section?.id}-${item?.slice(0, 20)?.replace(/\s+/g, '-')?.toLowerCase()}`}
                    className="flex items-start gap-2.5"
                  >
                    <span className="text-terminal-green text-xs mt-0.5 shrink-0">✓</span>
                    <span className="text-xs font-mono text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Genesis minted callout */}
        <div className="border border-terminal-green/40 p-6 bg-terminal-green/5 glow-box">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="status-dot-healthy" />
                <span className="text-sm font-mono font-bold text-terminal-green glow-green-sm">
                  Genesis Minted
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-2xl">
                System officially minted at{' '}
                <span className="text-terminal-green tabular-nums">2026-04-23T07:53:50.5144990+10:00</span>{' '}
                (AEST). Cryptographically anchored via RFC3161 GPS-backed authority and XYO bound-witness
                signatures. The ledger entry is immutable and tamper-evident. See MINTED.md.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="#genesis" className="btn-terminal-ghost text-2xs py-2 px-4">
                Genesis Cert
              </a>
              <a
                href="https://github.com/AiTenetAgency101/atmospheric-truth-layer/blob/main/SERIES_A_PITCH.md"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal text-2xs py-2 px-4"
              >
                Investor Deck →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}