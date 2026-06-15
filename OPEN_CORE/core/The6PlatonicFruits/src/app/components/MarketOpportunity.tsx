import React from 'react';

const SEGMENTS = [
  { id: 'aviation', label: 'Aviation & Airspace', value: '$38B', pct: 24, color: 'bg-blue-500' },
  { id: 'insurance', label: 'Insurance & Reinsurance', value: '$42B', pct: 27, color: 'bg-amber-500' },
  { id: 'agriculture', label: 'Agriculture & Precision Farming', value: '$29B', pct: 19, color: 'bg-green-500' },
  { id: 'energy', label: 'Renewable Energy', value: '$22B', pct: 14, color: 'bg-yellow-500' },
  { id: 'emergency', label: 'Emergency & Government', value: '$15B', pct: 10, color: 'bg-red-500' },
  { id: 'research', label: 'Climate Research & Academic', value: '$9B', pct: 6, color: 'bg-purple-500' },
];

const REVENUE_STREAMS = [
  { id: 'api', label: 'API Access', desc: 'Per-call and volume-tier pricing for tile verification endpoints', tier: 'Primary' },
  { id: 'saas', label: 'SaaS Subscriptions', desc: 'Monthly/annual access to real-time verified atmospheric feeds', tier: 'Primary' },
  { id: 'license', label: 'Institutional Data Licensing', desc: 'Government agencies, reinsurers, aviation authorities', tier: 'Enterprise' },
  { id: 'audit', label: 'Audit & Compliance Services', desc: 'Independent cryptographic verification as a service', tier: 'Professional' },
];

export default function MarketOpportunity() {
  return (
    <section id="market" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Market Opportunity</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            $155B+ TOTAL ADDRESSABLE MARKET
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            The global weather data and analytics market is large and rapidly expanding, driven by climate volatility and demand for real-time verified environmental information.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* TAM breakdown */}
          <div className="border border-border bg-terminal-surface1">
            <div className="border-b border-border px-5 py-3 bg-black/40">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
                TAM Breakdown by Segment
              </span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Hero metric */}
              <div className="border border-terminal-green/30 p-4 bg-terminal-green/5 text-center">
                <div className="text-4xl font-mono font-bold text-terminal-green glow-green tabular-nums">
                  $155B+
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1 tracking-widest uppercase">
                  Total Addressable Market
                </div>
              </div>

              {/* Segment bars */}
              <div className="flex flex-col gap-3">
                {SEGMENTS?.map((seg) => (
                  <div key={`seg-${seg?.id}`} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-muted-foreground">{seg?.label}</span>
                      <span className="text-xs font-mono font-bold text-terminal-green tabular-nums">
                        {seg?.value}
                      </span>
                    </div>
                    <div className="h-1.5 bg-terminal-surface3 overflow-hidden">
                      <div
                        className={`h-full ${seg?.color} opacity-70`}
                        style={{ width: `${seg?.pct}%` }}
                      />
                    </div>
                    <div className="text-2xs text-muted-foreground font-mono text-right">
                      {seg?.pct}% of TAM
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue streams */}
          <div className="flex flex-col gap-4">
            <div className="border border-border bg-terminal-surface1">
              <div className="border-b border-border px-5 py-3 bg-black/40">
                <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
                  Primary Revenue Streams
                </span>
              </div>
              <div className="divide-y divide-border">
                {REVENUE_STREAMS?.map((stream) => (
                  <div
                    key={`revenue-${stream?.id}`}
                    className="p-4 flex items-start gap-4 hover:bg-terminal-green/3 transition-colors"
                  >
                    <span
                      className={`text-2xs font-mono font-bold tracking-wider px-1.5 py-0.5 border shrink-0 ${
                        stream?.tier === 'Primary' ?'text-terminal-green border-terminal-green/30 bg-terminal-green/10'
                          : stream?.tier === 'Enterprise' ?'text-blue-400 border-blue-500/30 bg-blue-500/10' :'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      }`}
                    >
                      {stream?.tier}
                    </span>
                    <div>
                      <div className="text-sm font-mono font-bold text-terminal-green mb-1">
                        {stream?.label}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono leading-relaxed">
                        {stream?.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target segments */}
            <div className="border border-border bg-terminal-surface1 p-5">
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
                Primary Target Segments
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Government Agencies',
                  'Reinsurers',
                  'Precision Agriculture Platforms',
                  'Renewable Energy Operators',
                  'Aviation Authorities',
                  'Climate Research Institutions',
                ]?.map((seg) => (
                  <div
                    key={`target-${seg?.replace(/\s+/g, '-')?.toLowerCase()}`}
                    className="flex items-center gap-2 text-xs font-mono text-terminal-dim"
                  >
                    <span className="text-terminal-green">▸</span>
                    {seg}
                  </div>
                ))}
              </div>
            </div>

            {/* Financial projections link */}
            <div className="border border-border p-4 bg-terminal-surface1 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-terminal-green">
                  Full Financial Projections
                </div>
                <div className="text-2xs text-muted-foreground font-mono mt-0.5">
                  Revenue model, go-to-market, and investor materials
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a href="#" className="btn-terminal-ghost text-2xs py-1.5 px-3">
                  BUSINESS.md
                </a>
                <a href="#series-a" className="btn-terminal text-2xs py-1.5 px-3">
                  Series A →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}