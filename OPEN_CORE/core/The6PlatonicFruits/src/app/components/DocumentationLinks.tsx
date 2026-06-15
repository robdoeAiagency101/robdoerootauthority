import React from 'react';

const DOCS = [
  {
    id: 'readme',
    file: 'README.md',
    desc: 'Project overview, quick start, and live metrics',
    size: '~12KB',
    tag: 'Start Here',
    tagColor: 'tag-healthy',
  },
  {
    id: 'arch',
    file: 'ARCHITECTURE.md',
    desc: 'Full technical architecture, engine design, and API spec',
    size: '~48KB',
    tag: 'Technical',
    tagColor: 'tag-terminal',
  },
  {
    id: 'minted',
    file: 'MINTED.md',
    desc: 'Genesis minting certificate and immutability proof',
    size: '~4KB',
    tag: 'Immutable',
    tagColor: 'tag-terminal',
  },
  {
    id: 'api',
    file: 'API.md',
    desc: '60+ REST / gRPC / WebSocket endpoint documentation',
    size: '~64KB',
    tag: 'Reference',
    tagColor: 'tag-terminal',
  },
  {
    id: 'deploy',
    file: 'DEPLOYMENT.md',
    desc: 'Production setup guide (Docker Compose + Kubernetes)',
    size: '~24KB',
    tag: 'DevOps',
    tagColor: 'tag-terminal',
  },
  {
    id: 'security',
    file: 'SECURITY.md',
    desc: 'Cryptography details and full threat model',
    size: '~32KB',
    tag: 'Security',
    tagColor: 'tag-terminal',
  },
  {
    id: 'business',
    file: 'BUSINESS.md',
    desc: 'Market analysis and go-to-market strategy',
    size: '~20KB',
    tag: 'Business',
    tagColor: 'tag-terminal',
  },
  {
    id: 'usecases',
    file: 'USE_CASES.md',
    desc: 'Assistive tech, climate, and disaster response scenarios',
    size: '~16KB',
    tag: 'Use Cases',
    tagColor: 'tag-terminal',
  },
  {
    id: 'series-a',
    file: 'SERIES_A_PITCH.md',
    desc: 'Investor deck and financial projections',
    size: '~28KB',
    tag: 'Investor',
    tagColor: 'tag-warning',
  },
];

export default function DocumentationLinks() {
  return (
    <section id="docs" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Documentation</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            COMPLETE DOCUMENTATION SUITE
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Every aspect of the system is documented — from cryptographic specification to investor materials.
          </p>
        </div>

        <div className="border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 bg-terminal-surface1 border-b border-border">
            <div className="col-span-3 p-4 border-r border-border">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">Document</span>
            </div>
            <div className="col-span-6 p-4 border-r border-border">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">Description</span>
            </div>
            <div className="col-span-2 p-4 border-r border-border">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">Size</span>
            </div>
            <div className="col-span-1 p-4">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">Tag</span>
            </div>
          </div>

          {DOCS?.map((doc, i) => (
            <div
              key={`doc-${doc?.id}`}
              className={`grid grid-cols-12 border-b border-border last:border-0 hover:bg-terminal-green/3 transition-colors group ${
                i % 2 === 0 ? '' : 'bg-black/10'
              }`}
            >
              <div className="col-span-3 p-4 border-r border-border flex items-center">
                <a
                  href={`https://github.com/AiTenetAgency101/atmospheric-truth-layer/blob/main/${doc?.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-terminal text-sm font-bold"
                >
                  {doc?.file}
                </a>
              </div>
              <div className="col-span-6 p-4 border-r border-border flex items-center">
                <span className="text-xs font-mono text-muted-foreground">{doc?.desc}</span>
              </div>
              <div className="col-span-2 p-4 border-r border-border flex items-center">
                <span className="text-xs font-mono text-muted-foreground tabular-nums">{doc?.size}</span>
              </div>
              <div className="col-span-1 p-4 flex items-center">
                <span className={`tag-terminal text-2xs ${doc?.tagColor}`}>{doc?.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}