'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  Cell,
} from 'recharts';

// Mock 30-day historical data — Backend integration: replace with engine-all:8000/api/metrics/history
const REJECTION_DATA = [
  { day: 'Apr 01', exec: 28, reject: 72, kValue: 0.991 },
  { day: 'Apr 03', exec: 31, reject: 69, kValue: 0.993 },
  { day: 'Apr 05', exec: 27, reject: 73, kValue: 0.990 },
  { day: 'Apr 07', exec: 33, reject: 67, kValue: 0.995 },
  { day: 'Apr 09', exec: 29, reject: 71, kValue: 0.992 },
  { day: 'Apr 11', exec: 25, reject: 75, kValue: 0.989 },
  { day: 'Apr 13', exec: 35, reject: 65, kValue: 0.996 },
  { day: 'Apr 15', exec: 30, reject: 70, kValue: 0.994 },
  { day: 'Apr 17', exec: 28, reject: 72, kValue: 0.991 },
  { day: 'Apr 19', exec: 32, reject: 68, kValue: 0.993 },
  { day: 'Apr 21', exec: 26, reject: 74, kValue: 0.990 },
  { day: 'Apr 23', exec: 39, reject: 61, kValue: 0.9953 },
  { day: 'Apr 25', exec: 38, reject: 62, kValue: 0.9951 },
  { day: 'Apr 27', exec: 40, reject: 60, kValue: 0.9955 },
  { day: 'Apr 29', exec: 39, reject: 61, kValue: 0.9953 },
  { day: 'Apr 30', exec: 39, reject: 61, kValue: 0.9953 },
];

const TICK_VOLUME_DATA = [
  { engine: 'E365', ticks: 37445, color: '#00FF41' },
  { engine: 'ULTY', ticks: 2548, color: '#00CC33' },
  { engine: 'TNET', ticks: 641642, color: '#0088FF' },
];

const K_VALUE_DATA = [
  { name: 'K-Value', value: 99.53, fill: '#00FF41' },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-black border border-border p-3 font-mono text-xs min-w-[160px]">
      <div className="text-muted-foreground mb-2 text-2xs tracking-wider uppercase border-b border-border pb-1">
        {label}
      </div>
      {payload.map((entry, i) => (
        <div key={`tt-${i}`} className="flex justify-between gap-4 py-0.5">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="tabular-nums text-terminal-green font-semibold">
            {typeof entry.value === 'number' && entry.value < 10
              ? entry.value.toFixed(4)
              : `${entry.value}%`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EngineCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Rejection vs Execution area chart */}
      <div className="lg:col-span-2 border border-border bg-terminal-surface1 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-header-terminal text-2xs mb-1">
              30-Day Trend
            </div>
            <h3 className="text-sm font-mono font-bold text-terminal-green">
              Execution vs Rejection Rate — Ultimate Engine
            </h3>
          </div>
          <span className="tag-terminal text-2xs">Last 30 Days</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={REJECTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00FF41" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="rejectGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3333" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FF3333" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              interval={3}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                fontFamily: 'IBM Plex Mono',
                color: 'var(--muted-foreground)',
                paddingTop: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="exec"
              name="Execution %"
              stroke="#00FF41"
              strokeWidth={1.5}
              fill="url(#execGrad)"
            />
            <Area
              type="monotone"
              dataKey="reject"
              name="Rejection %"
              stroke="#FF3333"
              strokeWidth={1.5}
              fill="url(#rejectGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* K-Value radial gauge */}
      <div className="border border-border bg-terminal-surface1 p-5">
        <div className="mb-5">
          <div className="section-header-terminal text-2xs mb-1">
            Consensus Strength
          </div>
          <h3 className="text-sm font-mono font-bold text-terminal-green">
            K-Value Alignment
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart
              cx="50%"
              cy="85%"
              innerRadius="60%"
              outerRadius="90%"
              startAngle={180}
              endAngle={0}
              data={K_VALUE_DATA}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={0}
                background={{ fill: 'var(--surface-2)' }}
              >
                <Cell fill="#00FF41" />
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-6">
            <div className="text-3xl font-mono font-bold text-terminal-green glow-green tabular-nums">
              0.9953
            </div>
            <div className="text-2xs text-muted-foreground font-mono tracking-widest uppercase mt-1">
              K-Value Consensus
            </div>
            <div className="text-2xs text-terminal-green font-mono mt-1">
              ✓ Threshold: ≥ 0.99
            </div>
          </div>

          {/* Mini stats */}
          <div className="w-full mt-4 flex flex-col gap-1.5 border-t border-border pt-4">
            <div className="flex justify-between text-2xs font-mono">
              <span className="text-muted-foreground">Byzantine Layers</span>
              <span className="text-terminal-green tabular-nums">12</span>
            </div>
            <div className="flex justify-between text-2xs font-mono">
              <span className="text-muted-foreground">Sovereignty Orders</span>
              <span className="text-terminal-green tabular-nums">10</span>
            </div>
            <div className="flex justify-between text-2xs font-mono">
              <span className="text-muted-foreground">Engines Synchronized</span>
              <span className="text-terminal-green tabular-nums">14/14</span>
            </div>
            <div className="flex justify-between text-2xs font-mono">
              <span className="text-muted-foreground">Supermajority</span>
              <span className="text-terminal-green tabular-nums">10/14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engine tick volume bar chart */}
      <div className="lg:col-span-3 border border-border bg-terminal-surface1 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-header-terminal text-2xs mb-1">
              Engine Volume
            </div>
            <h3 className="text-sm font-mono font-bold text-terminal-green">
              Total Ticks / Cycles by Engine (thousands)
            </h3>
          </div>
          <span className="tag-terminal text-2xs">Cumulative</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={TICK_VOLUME_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="engine"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-black border border-border p-2 font-mono text-xs">
                    <span className="text-terminal-green tabular-nums">
                      {payload[0]?.value?.toLocaleString()} K ticks
                    </span>
                  </div>
                );
              }}
            />
            <Bar dataKey="ticks" radius={0}>
              {TICK_VOLUME_DATA.map((entry, i) => (
                <Cell key={`bar-cell-${i}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}