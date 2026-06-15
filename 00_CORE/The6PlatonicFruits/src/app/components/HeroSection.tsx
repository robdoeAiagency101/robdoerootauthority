'use client';

import React, { useState, useEffect } from 'react';

const TAGLINE_PARTS = [
  'The Sky Speaks.',
  'We Listen.',
  'The World Verifies.',
];

const BADGES = [
  { label: 'Status', value: 'OPERATIONAL', color: 'text-terminal-green border-terminal-green' },
  { label: 'License', value: 'MIT', color: 'text-muted-foreground border-border' },
  { label: 'Version', value: 'v1.0.0', color: 'text-muted-foreground border-border' },
  { label: 'Cycles', value: '37M+', color: 'text-terminal-green border-terminal-green' },
  { label: 'Consensus', value: 'K≥0.99', color: 'text-terminal-green border-terminal-green' },
  { label: 'Uptime', value: 'CONTINUOUS', color: 'text-terminal-green border-terminal-green' },
];

const TYPEWRITER_LINES = [
  '> Initializing Atmospheric Truth Layer...',
  '> Loading Byzantine consensus engines [14/14]...',
  '> Connecting satellite sources [BOM, Himawari-8, GOES-16, Meteosat]...',
  '> XYO witness mesh: ONLINE',
  '> K-value: 0.9953 ✓ (threshold: 0.99)',
  '> Engine 365-Days: 37,445,846 cycles ✓',
  '> Ultimate Engine: 2,548,079 cycles ✓',
  '> Tenet Agency 101: 641,642,364 ticks ✓',
  '> All validators: HEALTHY (Circle, Monotonic, Range)',
  '> Ledger integrity: VERIFIED',
  '> SHA256 chain: INTACT',
  '> RFC3161 timestamp: ANCHORED',
  '> System status: ALL ENGINES OPERATIONAL',
  '> Atmospheric truth: IMMUTABLE ✓',
  '_',
];

export default function HeroSection() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= TYPEWRITER_LINES.length) return;

    const line = TYPEWRITER_LINES[currentLine];

    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, 18);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  const currentDisplayLine =
    currentLine < TYPEWRITER_LINES.length
      ? TYPEWRITER_LINES[currentLine].slice(0, currentChar)
      : '';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden"
    >
      {/* Background grid lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16 w-full py-20">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left: Brand + messaging */}
          <div className="flex flex-col gap-8">
            {/* Pizzley Bear ASCII art */}
            <div className="border border-border p-4 bg-terminal-surface1 inline-block self-start">
              <pre className="ascii-panel text-2xs leading-tight text-terminal-green glow-green-sm">
{`╔═══════════════════════════════════════════╗
║   🐻‍❄️  PIZZLEY BEAR — SOVEREIGN ENGINE   ║
║                                           ║
║   Hybrid. Adaptive. Immutable.            ║
║   Born from cold logic and raw sky.       ║
║   Not corporate. Not institutional.       ║
║   A new species of atmospheric truth.     ║
╚═══════════════════════════════════════════╝`}
              </pre>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <div
                  key={`badge-${badge.label.toLowerCase()}`}
                  className={`border px-2.5 py-1 flex items-center gap-1.5 text-2xs font-mono ${badge.color}`}
                >
                  <span className="opacity-60">{badge.label}:</span>
                  <span className="font-bold tracking-wider">{badge.value}</span>
                </div>
              ))}
            </div>

            {/* Main headline */}
            <div className="flex flex-col gap-3">
              <div className="section-header-terminal">
                Atmospheric Truth Layer
              </div>
              <h1 className="flex flex-col gap-1">
                {TAGLINE_PARTS.map((part, i) => (
                  <span
                    key={`tagline-${i}`}
                    className={`font-mono font-bold leading-tight ${
                      i === 2
                        ? 'text-3xl lg:text-4xl text-terminal-green glow-green animate-glow-pulse' :'text-2xl lg:text-3xl text-terminal-dim'
                    }`}
                  >
                    {part}
                  </span>
                ))}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mt-2">
                Global weather data should not require faith in centralized institutions.
                It should require mathematics.
              </p>
              <p className="text-terminal-dim text-sm leading-relaxed max-w-xl">
                Atmospheric Truth Layer transforms satellite data into tamper-proof,
                globally verifiable truth through multi-source Byzantine consensus and
                immutable witness ledger anchoring.
              </p>
              <div className="border border-border/50 p-3 bg-terminal-surface1 mt-2">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  <span className="text-terminal-green font-bold">Not prediction.</span>{' '}
                  <span className="text-terminal-green font-bold">Not forecasting.</span>{' '}
                  <span className="text-terminal-green glow-green-sm font-bold">Cryptographic proof.</span>
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <a href="#quick-start" className="btn-terminal">
                <span>▶</span>
                Quick Start
              </a>
              <a href="#architecture" className="btn-terminal-ghost">
                <span>⬡</span>
                Architecture
              </a>
              <a
                href="https://github.com/AiTenetAgency101/atmospheric-truth-layer"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-ghost"
              >
                <span>⌥</span>
                GitHub
              </a>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-3">
              <div className="status-dot-healthy" />
              <span className="text-2xs text-muted-foreground tracking-widest uppercase font-mono">
                Live · 3 engines operational · 37M+ tiles witnessed · K=0.9953
              </span>
            </div>
          </div>

          {/* Right: Terminal typewriter */}
          <div className="border border-border bg-terminal-surface1 relative overflow-hidden">
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-black/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-2xs text-muted-foreground font-mono ml-2 tracking-wider">
                atl-system-init — bash
              </span>
              <div className="ml-auto flex items-center gap-2">
                <div className="status-dot-healthy" />
                <span className="text-2xs text-terminal-green font-mono">LIVE</span>
              </div>
            </div>

            {/* Terminal content */}
            <div className="p-5 min-h-[400px] font-mono text-xs leading-relaxed">
              {displayedLines.map((line, i) => (
                <div
                  key={`term-line-${i}`}
                  className={`${
                    line.includes('✓') || line.includes('OPERATIONAL') || line.includes('IMMUTABLE') || line.includes('INTACT') || line.includes('VERIFIED') || line.includes('ANCHORED') || line.includes('HEALTHY') || line.includes('ONLINE')
                      ? 'text-terminal-green' : line.startsWith('>')
                      ? 'text-terminal-dim' :'text-muted-foreground'
                  }`}
                >
                  {line}
                </div>
              ))}
              {currentLine < TYPEWRITER_LINES.length && (
                <div className="text-terminal-dim">
                  {currentDisplayLine}
                  <span className="animate-cursor-blink text-terminal-green">█</span>
                </div>
              )}
              {currentLine >= TYPEWRITER_LINES.length && (
                <div className="text-terminal-green mt-2">
                  <span className="animate-cursor-blink">█</span>
                </div>
              )}
            </div>

            {/* Bottom status bar */}
            <div className="border-t border-border px-4 py-2 bg-black/30 flex items-center justify-between">
              <span className="text-2xs text-muted-foreground font-mono">
                ATL v1.0.0 · Genesis: 2026-04-23T07:53:50 AEST
              </span>
              <span className="text-2xs text-terminal-green font-mono animate-glow-pulse">
                ● OPERATIONAL
              </span>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <a
            href="#metrics"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-terminal-green transition-colors group"
          >
            <span className="text-2xs tracking-widest uppercase font-mono">Scroll to verify</span>
            <div className="flex flex-col gap-0.5 items-center">
              <span className="text-terminal-green animate-bounce text-xs">▼</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}