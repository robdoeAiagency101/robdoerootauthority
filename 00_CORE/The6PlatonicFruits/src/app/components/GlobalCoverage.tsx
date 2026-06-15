import React from 'react';

const SATELLITES = [
  {
    id: 'bom',
    name: 'BOM',
    fullName: 'Bureau of Meteorology',
    region: 'Australia',
    coverage: 'Southern Pacific and Indian Ocean',
    frequency: '10-min refresh',
    status: 'ONLINE',
    tiles: '9,234,512',
  },
  {
    id: 'himawari',
    name: 'Himawari-8',
    fullName: 'Japan Meteorological Agency',
    region: 'Japan / Asia-Pacific',
    coverage: 'Asia-Pacific full-disk',
    frequency: '10-min refresh',
    status: 'ONLINE',
    tiles: '11,892,044',
  },
  {
    id: 'goes16',
    name: 'GOES-16',
    fullName: 'NOAA / NASA',
    region: 'USA / Americas',
    coverage: 'Americas and Atlantic',
    frequency: '5-min refresh',
    status: 'ONLINE',
    tiles: '10,445,781',
  },
  {
    id: 'meteosat',
    name: 'Meteosat',
    fullName: 'EUMETSAT',
    region: 'Europe',
    coverage: 'Europe, Africa, and Middle East',
    frequency: '15-min refresh',
    status: 'ONLINE',
    tiles: '5,873,509',
  },
];

export default function GlobalCoverage() {
  return (
    <section id="coverage" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Global Reach</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            GLOBAL SATELLITE COVERAGE
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-3xl">
            Atmospheric Truth Layer operates across all inhabited latitudes through a multi-satellite, multi-witness architecture.
            Witness nodes are geographically distributed, ensuring no single jurisdiction controls the ledger.
          </p>
        </div>

        {/* Satellite status grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 border border-border mb-8">
          {SATELLITES?.map((sat, i) => (
            <div
              key={`sat-${sat?.id}`}
              className={`p-5 flex flex-col gap-3 border-b border-r border-border hover:bg-terminal-green/3 transition-colors ${
                i === 3 ? 'border-r-0' : ''
              } ${i >= 2 ? 'xl:border-b-0' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="status-dot-healthy" />
                  <span className="text-sm font-mono font-bold text-terminal-green">
                    {sat?.name}
                  </span>
                </div>
                <span className="tag-healthy text-2xs">{sat?.status}</span>
              </div>
              <div className="text-2xs text-muted-foreground font-mono">{sat?.fullName}</div>

              <div className="flex flex-col gap-1.5 mt-1">
                {[
                  { label: 'Region', value: sat?.region },
                  { label: 'Coverage', value: sat?.coverage },
                  { label: 'Refresh', value: sat?.frequency },
                  { label: 'Tiles Witnessed', value: sat?.tiles },
                ]?.map((item) => (
                  <div
                    key={`sat-detail-${sat?.id}-${item?.label?.toLowerCase()}`}
                    className="flex justify-between items-start gap-2 py-1 border-b border-border/30 last:border-0"
                  >
                    <span className="text-2xs text-muted-foreground font-mono">{item?.label}</span>
                    <span className="text-2xs text-terminal-green font-mono text-right tabular-nums">
                      {item?.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Decentralization note */}
        <div className="border border-border p-6 bg-terminal-surface1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
                Jurisdictional Independence
              </div>
              <p className="text-sm font-mono text-terminal-dim leading-relaxed">
                Any party worldwide can independently verify any tile hash against the public
                immutable ledger — no account, API key, or trust relationship required.
              </p>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed mt-3">
                Witness nodes are geographically distributed across multiple jurisdictions.
                No single government, institution, or operator controls the ledger.
                The atmospheric truth belongs to everyone.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Satellite Sources', value: '4', sub: 'Independent feeds' },
                { label: 'Global Coverage', value: '100%', sub: 'All inhabited latitudes' },
                { label: 'Verification', value: 'Public', sub: 'No auth required' },
              ]?.map((stat) => (
                <div
                  key={`global-stat-${stat?.label?.replace(/\s+/g, '-')?.toLowerCase()}`}
                  className="border border-border p-3 bg-black/30 flex items-center justify-between"
                >
                  <div>
                    <div className="text-2xs text-muted-foreground font-mono">{stat?.label}</div>
                    <div className="text-2xs text-muted-foreground font-mono">{stat?.sub}</div>
                  </div>
                  <div className="text-xl font-mono font-bold text-terminal-green glow-green-sm tabular-nums">
                    {stat?.value}
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