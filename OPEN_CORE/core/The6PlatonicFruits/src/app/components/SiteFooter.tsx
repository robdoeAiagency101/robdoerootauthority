import React from 'react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-12 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">

        {/* Top footer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-terminal-green flex items-center justify-center text-terminal-green text-xs font-bold glow-green-sm">
                ATL
              </div>
              <div>
                <div className="text-terminal-green text-xs font-bold tracking-widest uppercase glow-green-sm">
                  Atmospheric Truth Layer
                </div>
                <div className="text-muted-foreground text-2xs tracking-wider">
                  Pizzley Bear · Sovereign Verification
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-xs">
              The sky speaks in mathematics, not institutions.
              Witnessed atmospheric truth. Immutable. Verifiable.
            </p>
            <div className="flex items-center gap-2">
              <div className="status-dot-healthy" />
              <span className="text-2xs font-mono text-terminal-green tracking-wider">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
                System
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Architecture', href: '#architecture' },
                  { label: 'Security', href: '#security' },
                  { label: 'Quick Start', href: '#quick-start' },
                  { label: 'Documentation', href: '#docs' },
                  { label: 'Genesis', href: '#genesis' },
                ]?.map((link) => (
                  <a
                    key={`footer-sys-${link?.label?.toLowerCase()}`}
                    href={link?.href}
                    className="link-terminal text-xs"
                  >
                    {link?.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
                Business
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Use Cases', href: '#use-cases' },
                  { label: 'Market', href: '#market' },
                  { label: 'Series A', href: '#series-a' },
                  { label: 'Contributing', href: '#contributing' },
                  { label: 'Contact', href: '#contact' },
                ]?.map((link) => (
                  <a
                    key={`footer-biz-${link?.label?.toLowerCase()}`}
                    href={link?.href}
                    className="link-terminal text-xs"
                  >
                    {link?.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Live stats */}
          <div className="border border-border p-4 bg-terminal-surface1 self-start">
            <div className="text-2xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-3">
              Live System Stats
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Engine 365 Cycles', value: '37,445,846+' },
                { label: 'Ultimate Cycles', value: '2,548,079+' },
                { label: 'Tenet Ticks', value: '641,642,364+' },
                { label: 'K-Value', value: '0.9953' },
                { label: 'Genesis', value: '2026-04-23 AEST' },
              ]?.map((stat) => (
                <div
                  key={`footer-stat-${stat?.label?.replace(/\s+/g, '-')?.toLowerCase()}`}
                  className="flex justify-between items-center text-2xs font-mono"
                >
                  <span className="text-muted-foreground">{stat?.label}</span>
                  <span className="text-terminal-green tabular-nums">{stat?.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-terminal mb-6" />

        {/* ASCII footer quote */}
        <div className="border border-border p-4 bg-terminal-surface1 mb-6">
          <pre className="ascii-panel text-xs text-terminal-green/70 text-center leading-relaxed">
{`╔═══════════════════════════════════════════════════════════════════╗
║         The sky speaks in mathematics, not institutions.         ║
║        Witnessed atmospheric truth. Immutable. Verifiable.       ║
╚═══════════════════════════════════════════════════════════════════╝`}
          </pre>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4 text-2xs font-mono text-muted-foreground">
            <span>MIT License</span>
            <span className="text-border">·</span>
            <span>The atmospheric truth belongs to everyone.</span>
            <span className="text-border">·</span>
            <span className="tabular-nums">v1.0.0</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/AiTenetAgency101/atmospheric-truth-layer"
              target="_blank"
              rel="noopener noreferrer"
              className="link-terminal text-2xs"
            >
              GitHub
            </a>
            <span className="text-border text-2xs">·</span>
            <a href="#docs" className="link-terminal text-2xs">Docs</a>
            <span className="text-border text-2xs">·</span>
            <a href="#contact" className="link-terminal text-2xs">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}