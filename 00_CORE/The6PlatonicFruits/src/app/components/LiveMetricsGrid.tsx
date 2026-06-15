'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const EngineCharts = dynamic(() => import('./EngineCharts'), { ssr: false });

// Backend integration point: replace with WebSocket connection to engine-all:8000/api/status
const ENGINE_DATA = {
  engine365: {
    id: 'engine-365',
    name: 'Engine 365-Days',
    subtitle: 'Cycle Decomposition',
    status: 'HEALTHY' as const,
    metrics: [
      { label: 'Cycles Completed', value: '37,445,846', raw: 37445846, unit: '' },
      { label: 'Validator Health', value: '100%', raw: 100, unit: '' },
      { label: 'Validators Active', value: '3/3', raw: 3, unit: '' },
      { label: 'Grid Passed', value: '3,510,223', raw: 3510223, unit: 'tiles' },
      { label: 'Grid Rejected', value: '8,593,985', raw: 8593985, unit: 'tiles' },
      { label: 'Rejection Rate', value: '71%', raw: 71, unit: '' },
      { label: 'Consensus', value: '3/3 validators', raw: 100, unit: '' },
    ],
    validators: ['Circle', 'Monotonic', 'Range'],
    validatorStatus: [true, true, true],
    rejectionRate: 71,
    executionRate: 29,
  },
  ultimate: {
    id: 'engine-ultimate',
    name: 'Ultimate Engine',
    subtitle: 'Byzantine Consensus',
    status: 'HEALTHY' as const,
    metrics: [
      { label: 'Cycles', value: '2,548,079', raw: 2548079, unit: '' },
      { label: 'Decisions Executed', value: '993,625', raw: 993625, unit: '' },
      { label: 'Execution Rate', value: '39%', raw: 39, unit: '' },
      { label: 'Decisions Rejected', value: '1,554,454', raw: 1554454, unit: '' },
      { label: 'Rejection Rate', value: '61%', raw: 61, unit: '' },
      { label: 'Sovereignty Orders', value: '10', raw: 10, unit: '' },
      { label: 'Byzantine Layers', value: '12', raw: 12, unit: '' },
      { label: 'K-Value Consensus', value: '0.9953', raw: 99.53, unit: '' },
    ],
    validators: [],
    validatorStatus: [],
    rejectionRate: 61,
    executionRate: 39,
    sovereigntyOrders: 10,
    byzantineLayers: 12,
    kValue: 0.9953,
  },
  tenet: {
    id: 'engine-tenet',
    name: 'Tenet Agency 101',
    subtitle: 'Firewall Validation',
    status: 'HEALTHY' as const,
    metrics: [
      { label: 'Ticks Processed', value: '641,642,364', raw: 641642364, unit: '' },
      { label: 'Decisions Executed', value: '0', raw: 0, unit: '' },
      { label: 'Firewall Doctrine', value: '100% REJECT', raw: 100, unit: '' },
      { label: 'Decisions Rejected', value: '641,642,364', raw: 641642364, unit: '' },
      { label: 'Drift Ratio', value: '1:2 (balanced)', raw: 50, unit: '' },
      { label: 'Horizon Entries', value: '320,821,187', raw: 320821187, unit: '' },
    ],
    validators: [],
    validatorStatus: [],
    rejectionRate: 100,
    executionRate: 0,
    driftRatio: '1:2',
    horizonEntries: 320821187,
  },
};

const SYSTEM_SUMMARY = [
  { label: 'System Uptime', value: 'Continuous', sub: 'cycle-locked', icon: '◉' },
  { label: 'Witnessed Tiles', value: '37M+', sub: 'and growing', icon: '⬡' },
  { label: 'Grid Coverage', value: 'Global', sub: '4+ satellite sources', icon: '◎' },
  { label: 'Consensus K-Value', value: '0.9953', sub: 'mathematical proof', icon: '≡' },
];

export default function LiveMetricsGrid() {
  const [tick, setTick] = useState(0);
  const [cycles, setCycles] = useState(37445846);
  const [ticks, setTicks] = useState(641642364);

  // Simulate live counter increments
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setCycles((c) => c + Math.floor(Math.random() * 3 + 1));
      setTicks((t) => t + Math.floor(Math.random() * 12 + 4));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="metrics" className="py-20 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Section header */}
        <div className="mb-10">
          <div className="section-header-terminal mb-3">
            Live System Metrics
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-terminal-green tracking-wide font-mono">
              ATMOSPHERIC GRID STATUS
            </h2>
            <div className="flex items-center gap-2 border border-terminal-green px-2.5 py-1 bg-terminal-green/5">
              <div className="status-dot-healthy" />
              <span className="text-2xs text-terminal-green font-mono tracking-widest">LIVE</span>
            </div>
            <span className="text-2xs text-muted-foreground font-mono">
              Updated every 1.2s · Tick #{tick.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ASCII outer border panel */}
        <div className="border border-border bg-terminal-surface1 p-0 overflow-hidden animate-border-glow">
          <div className="border-b border-border px-6 py-3 bg-black/40 flex items-center justify-between">
            <pre className="ascii-panel text-2xs">
              {'╔══════════════════════════════════════════════════════════════════════════════╗'}
            </pre>
            <span className="text-2xs text-muted-foreground font-mono shrink-0 ml-4">
              engine-all:8000
            </span>
          </div>

          {/* Three engine cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Engine 365-Days */}
            <EngineCard
              engine={ENGINE_DATA.engine365}
              liveCycles={cycles}
              isFirst
            />
            {/* Ultimate Engine */}
            <EngineCard engine={ENGINE_DATA.ultimate} />
            {/* Tenet Agency 101 */}
            <EngineCard engine={ENGINE_DATA.tenet} liveTicks={ticks} />
          </div>

          <div className="border-t border-border px-6 py-3 bg-black/40">
            <pre className="ascii-panel text-2xs">
              {'╚══════════════════════════════════════════════════════════════════════════════╝'}
            </pre>
          </div>
        </div>

        {/* System summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-border mt-6 divide-x divide-border">
          {SYSTEM_SUMMARY.map((item) => (
            <div
              key={`summary-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="p-4 flex flex-col gap-1 hover:bg-terminal-green/3 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-terminal-green text-sm">{item.icon}</span>
                <span className="metric-label">{item.label}</span>
              </div>
              <div className="text-terminal-green font-mono font-bold text-lg tabular-nums glow-green-sm">
                {item.value}
              </div>
              <div className="text-2xs text-muted-foreground font-mono">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8">
          <EngineCharts />
        </div>
      </div>
    </section>
  );
}

function EngineCard({
  engine,
  liveCycles,
  liveTicks,
  isFirst,
}: {
  engine: typeof ENGINE_DATA.engine365 | typeof ENGINE_DATA.ultimate | typeof ENGINE_DATA.tenet;
  liveCycles?: number;
  liveTicks?: number;
  isFirst?: boolean;
}) {
  const isFirewall = engine.id === 'engine-tenet';
  const isUltimate = engine.id === 'engine-ultimate';

  return (
    <div className="p-5 flex flex-col gap-4 relative">
      {/* Engine header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="status-dot-healthy" />
            <span className="text-terminal-green font-mono font-bold text-sm tracking-wide">
              {engine.name}
            </span>
          </div>
          <div className="text-2xs text-muted-foreground font-mono tracking-wider uppercase">
            {engine.subtitle}
          </div>
        </div>
        <span className="tag-healthy shrink-0">
          {engine.status}
        </span>
      </div>

      {/* Metrics list */}
      <div className="flex flex-col gap-1.5">
        {engine.metrics.map((metric, i) => {
          let displayValue = metric.value;
          if (engine.id === 'engine-365' && metric.label === 'Cycles Completed' && liveCycles) {
            displayValue = liveCycles.toLocaleString();
          }
          if (engine.id === 'engine-tenet' && metric.label === 'Ticks Processed' && liveTicks) {
            displayValue = liveTicks.toLocaleString();
          }
          if (engine.id === 'engine-tenet' && metric.label === 'Decisions Rejected' && liveTicks) {
            displayValue = liveTicks.toLocaleString();
          }

          const isHighlight =
            metric.label === 'Cycles Completed' ||
            metric.label === 'Ticks Processed' ||
            metric.label === 'K-Value Consensus';

          return (
            <div
              key={`metric-${engine.id}-${i}`}
              className="flex items-center justify-between gap-2 py-1 border-b border-border/40 last:border-0"
            >
              <span className="text-2xs text-muted-foreground font-mono flex items-center gap-1.5">
                <span className="text-terminal-dark">├─</span>
                {metric.label}
              </span>
              <span
                className={`text-xs font-mono font-semibold tabular-nums ${
                  isHighlight
                    ? 'text-terminal-green glow-green-sm' : metric.label.includes('Reject') || metric.label.includes('REJECT')
                    ? 'text-red-400' :'text-terminal-dim'
                }`}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rejection/Execution bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-2xs font-mono">
          <span className="text-terminal-green">
            EXEC: {engine.executionRate}%
          </span>
          <span className="text-red-400">
            REJECT: {engine.rejectionRate}%
          </span>
        </div>
        <div className="progress-bar-terminal">
          <div
            className="progress-bar-fill"
            style={{ width: `${engine.executionRate}%` }}
          />
        </div>
        <div className="progress-bar-terminal">
          <div
            className="progress-bar-fill progress-bar-fill-reject"
            style={{ width: `${engine.rejectionRate}%` }}
          />
        </div>
      </div>

      {/* Validators (Engine 365 only) */}
      {engine.validators.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-2xs text-muted-foreground font-mono tracking-wider uppercase">
            Validators
          </span>
          <div className="flex gap-2 flex-wrap">
            {engine.validators.map((v, i) => (
              <div
                key={`validator-${engine.id}-${v}`}
                className="flex items-center gap-1.5 border border-terminal-green/30 px-2 py-1 bg-terminal-green/5"
              >
                <div className="status-dot-healthy w-1.5 h-1.5" style={{ width: '6px', height: '6px' }} />
                <span className="text-2xs text-terminal-green font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ultimate engine extras */}
      {isUltimate && (
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-border p-2 bg-black/30">
            <div className="text-2xs text-muted-foreground font-mono">K-Value</div>
            <div className="text-terminal-green font-mono font-bold text-sm glow-green-sm tabular-nums">
              0.9953
            </div>
            <div className="text-2xs text-terminal-green font-mono">≥ 0.99 ✓</div>
          </div>
          <div className="border border-border p-2 bg-black/30">
            <div className="text-2xs text-muted-foreground font-mono">Byzantine</div>
            <div className="text-terminal-green font-mono font-bold text-sm glow-green-sm">
              12 Layers
            </div>
            <div className="text-2xs text-muted-foreground font-mono">10 Orders</div>
          </div>
        </div>
      )}

      {/* Firewall badge */}
      {isFirewall && (
        <div className="border border-blue-500/30 p-3 bg-blue-500/5">
          <div className="text-2xs font-mono text-blue-400 tracking-wider uppercase mb-1">
            Firewall Doctrine Active
          </div>
          <div className="text-2xs text-muted-foreground font-mono leading-relaxed">
            100% rejection by design. Tenet Agency 101 acts as a pure
            boundary validator — zero executions is correct behavior.
          </div>
        </div>
      )}
    </div>
  );
}