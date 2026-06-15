import React from 'react';

const TECH_STACK = [
  {
    id: 'orchestration',
    layer: 'Container Orchestration',
    tech: 'Docker Compose (development) · Kubernetes (production)',
    tags: ['Docker', 'K8s'],
  },
  {
    id: 'api-gateway',
    layer: 'API Gateway',
    tech: 'REST (Port 8080) · gRPC (Port 50051) · WebSocket (Port 8081) · GraphQL (Port 8082)',
    tags: ['REST', 'gRPC', 'WS', 'GraphQL'],
  },
  {
    id: 'core-services',
    layer: 'Core Services',
    tech: 'Python — Engine 365-Days · Ultimate Engine · Tenet Agency 101 · XYO Witness',
    tags: ['Python', '4 Engines'],
  },
  {
    id: 'persistence',
    layer: 'Persistence',
    tech: 'PostgreSQL (tile metadata + ledger entries) · Redis (K-value state + consensus sync)',
    tags: ['PostgreSQL', 'Redis'],
  },
  {
    id: 'storage',
    layer: 'Object Storage',
    tech: 'S3-compatible (tile blob archive and backup)',
    tags: ['S3-Compatible'],
  },
  {
    id: 'monitoring',
    layer: 'Monitoring',
    tech: 'Prometheus · Grafana · Jaeger',
    tags: ['Prometheus', 'Grafana', 'Jaeger'],
  },
  {
    id: 'cryptography',
    layer: 'Cryptography',
    tech: 'SHA256 tile hashing · HMAC-SHA256 witness signatures · RFC3161 timestamping · SymPy Secp256k1',
    tags: ['SHA256', 'HMAC', 'RFC3161', 'Secp256k1'],
  },
  {
    id: 'witness',
    layer: 'Witness Network',
    tech: 'XYO bound-witness mesh · 250GHz RFID · Elliptic curve seals',
    tags: ['XYO', 'RFID', 'ECC'],
  },
  {
    id: 'satellites',
    layer: 'Satellite Sources',
    tech: 'BOM (AUS) · Himawari-8 (JPY) · GOES-16 (USA) · Meteosat (EU)',
    tags: ['BOM', 'Himawari-8', 'GOES-16', 'Meteosat'],
  },
  {
    id: 'routing',
    layer: 'Routing / Reverse Proxy',
    tech: 'Traefik — public-headers + private-headers middleware · dynamic.yml routing',
    tags: ['Traefik', 'Middleware'],
  },
];

export default function TechStackTable() {
  return (
    <section id="tech-stack" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Technology Stack</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            PRODUCTION INFRASTRUCTURE
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Battle-tested open standards and cryptographic primitives. No proprietary black boxes.
          </p>
        </div>

        <div className="border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 bg-terminal-surface1 border-b border-border">
            <div className="col-span-3 p-4 border-r border-border">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
                Layer
              </span>
            </div>
            <div className="col-span-6 p-4 border-r border-border">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
                Technology
              </span>
            </div>
            <div className="col-span-3 p-4">
              <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
                Tags
              </span>
            </div>
          </div>

          {/* Rows */}
          {TECH_STACK?.map((row, i) => (
            <div
              key={`tech-${row?.id}`}
              className={`grid grid-cols-12 border-b border-border last:border-0 hover:bg-terminal-green/3 transition-colors ${
                i % 2 === 0 ? '' : 'bg-black/10'
              }`}
            >
              <div className="col-span-3 p-4 border-r border-border flex items-start">
                <span className="text-xs font-mono font-semibold text-terminal-dim">
                  {row?.layer}
                </span>
              </div>
              <div className="col-span-6 p-4 border-r border-border">
                <span className="text-xs font-mono text-terminal-green leading-relaxed">
                  {row?.tech}
                </span>
              </div>
              <div className="col-span-3 p-4 flex flex-wrap gap-1 items-start">
                {row?.tags?.map((tag) => (
                  <span
                    key={`tag-tech-${row?.id}-${tag?.replace(/\s+/g, '-')?.toLowerCase()}`}
                    className="tag-terminal text-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Docker compose reference */}
        <div className="mt-6 border border-border bg-terminal-surface1 p-5">
          <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
            Engine Docker Compose Services
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {[
              { id: 'e365', name: 'engine-365-days', port: '—', role: 'Reference Engine', color: 'text-terminal-green' },
              { id: 'ulty', name: 'ultimate-engine', port: '—', role: 'Reference Engine', color: 'text-terminal-green' },
              { id: 'tnet', name: 'tenetaiagency-101', port: '—', role: 'Reference Engine', color: 'text-blue-400' },
              { id: 'eall', name: 'engine-all', port: '8000', role: 'Public API', color: 'text-terminal-green' },
              { id: 'e2ops', name: 'engine2-ops', port: '8001', role: 'Private API', color: 'text-amber-400' },
            ]?.map((svc) => (
              <div
                key={`svc-${svc?.id}`}
                className="border border-border p-3 bg-black/30 hover:bg-terminal-green/3 transition-colors"
              >
                <div className={`text-xs font-mono font-bold ${svc?.color} mb-1`}>
                  {svc?.name}
                </div>
                <div className="text-2xs text-muted-foreground font-mono">
                  Port: {svc?.port}
                </div>
                <div className="text-2xs text-muted-foreground font-mono">
                  {svc?.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}