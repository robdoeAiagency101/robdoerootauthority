'use client';

import React, { useState } from 'react';

const STEPS = [
  {
    id: 'clone',
    num: '01',
    title: 'Clone Repository',
    code: 'git clone https://github.com/AiTenetAgency101/atmospheric-truth-layer.git\ncd atmospheric-truth-layer',
  },
  {
    id: 'up',
    num: '02',
    title: 'Start All Engines',
    code: 'docker-compose up -d',
  },
  {
    id: 'verify',
    num: '03',
    title: 'Verify System Status',
    code: 'curl http://localhost:8000/api/status\n# Expected: {"status":"OPERATIONAL","k_value":0.9953,"engines":14}',
  },
  {
    id: 'dashboards',
    num: '04',
    title: 'Access Dashboards',
    code: '# API Status\nhttp://localhost:8000/api/status\n\n# Prometheus Metrics\nhttp://localhost:9090\n\n# Grafana Dashboard\nhttp://localhost:3000',
  },
];

const ENDPOINTS = [
  { method: 'GET', path: '/api/status', desc: 'System health and engine overview' },
  { method: 'GET', path: '/api/tiles/{hash}', desc: 'Verify a specific tile hash' },
  { method: 'GET', path: '/api/consensus/k-value', desc: 'Current K-value consensus score' },
  { method: 'GET', path: '/api/witness/latest', desc: 'Latest XYO witness record' },
  { method: 'GET', path: '/api/ledger/genesis', desc: 'Genesis minting certificate' },
  { method: 'WS', path: 'ws://localhost:8081/live', desc: 'Real-time engine tick stream' },
];

export default function QuickStart() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="quick-start" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mb-10">
          <div className="section-header-terminal mb-3">Quick Start</div>
          <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
            UP IN FOUR COMMANDS
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-2 max-w-2xl">
            Full deployment guide: DEPLOYMENT.md · Production Kubernetes setup included.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {STEPS.map((step) => (
            <div
              key={`step-${step.id}`}
              className="border border-border bg-terminal-surface1 overflow-hidden group"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-black/40">
                <div className="flex items-center gap-3">
                  <span className="text-terminal-green font-mono font-bold text-2xs tracking-widest">
                    [{step.num}]
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {step.title}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(step.code, step.id)}
                  className="text-2xs font-mono text-muted-foreground hover:text-terminal-green transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
                  aria-label={`Copy ${step.title} command`}
                >
                  {copiedId === step.id ? (
                    <>
                      <span className="text-terminal-green">✓</span>
                      Copied
                    </>
                  ) : (
                    <>
                      <span>⎘</span>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-4">
                <pre className="text-xs font-mono text-terminal-green leading-relaxed whitespace-pre-wrap">
                  {step.code}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* API endpoints quick reference */}
        <div className="border border-border bg-terminal-surface1">
          <div className="border-b border-border px-5 py-3 bg-black/40">
            <span className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
              Key API Endpoints — Full reference: API.md (60+ endpoints)
            </span>
          </div>
          <div className="divide-y divide-border">
            {ENDPOINTS.map((ep) => (
              <div
                key={`ep-${ep.path.replace(/\//g, '-').replace(/[{}]/g, '')}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-terminal-green/3 transition-colors"
              >
                <span
                  className={`text-2xs font-mono font-bold tabular-nums shrink-0 w-8 ${
                    ep.method === 'GET' ?'text-terminal-green'
                      : ep.method === 'WS' ?'text-blue-400' :'text-amber-400'
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-xs font-mono text-terminal-dim shrink-0">
                  {ep.path}
                </code>
                <span className="text-xs text-muted-foreground font-mono">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}