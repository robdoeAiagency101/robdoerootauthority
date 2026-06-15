'use client';

import React, { useState, useEffect } from 'react';


const NAV_LINKS = [
  { label: 'Metrics', href: '#metrics' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Features', href: '#features' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Security', href: '#security' },
  { label: 'Docs', href: '#docs' },
  { label: 'Genesis', href: '#genesis' },
  { label: 'Contact', href: '#contact' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    );

    NAV_LINKS?.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer?.observe(el);
    });

    return () => observer?.disconnect();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 border-b border-border backdrop-blur-sm' :'bg-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 border border-terminal-green flex items-center justify-center text-terminal-green text-xs font-bold glow-green-sm group-hover:bg-terminal-green group-hover:text-black transition-all duration-200">
                ATL
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-terminal-green text-xs font-bold tracking-widest uppercase glow-green-sm">
                  Atmospheric Truth Layer
                </span>
                <span className="text-muted-foreground text-2xs tracking-wider">
                  Pizzley Bear · Sovereign Verification
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS?.map((link) => (
                <a
                  key={`nav-${link?.label?.toLowerCase()}`}
                  href={link?.href}
                  className={`nav-link-terminal px-3 py-1.5 transition-all duration-150 ${
                    activeSection === link?.href?.replace('#', '')
                      ? 'text-terminal-green glow-green-sm' :''
                  }`}
                >
                  {link?.label}
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/AiTenetAgency101/atmospheric-truth-layer"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-ghost hidden sm:inline-flex text-2xs py-1.5 px-3"
              >
                <span className="text-terminal-green">▶</span>
                GitHub
              </a>
              <a
                href="#quick-start"
                className="btn-terminal text-2xs py-1.5 px-3 hidden sm:inline-flex"
              >
                Quick Start
              </a>

              {/* System status indicator */}
              <div className="flex items-center gap-2 border border-border px-2.5 py-1">
                <div className="status-dot-healthy" />
                <span className="text-2xs text-terminal-green font-mono tracking-widest uppercase">
                  All Systems
                </span>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-muted-foreground hover:text-terminal-green transition-colors p-1"
                aria-label="Toggle mobile menu"
              >
                <div className="flex flex-col gap-1">
                  <span className={`block h-px w-5 bg-current transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-px w-5 bg-current transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-px w-5 bg-current transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-14 left-0 right-0 bg-black border-b border-border transition-transform duration-300 ${
            mobileOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS?.map((link) => (
              <a
                key={`mobile-nav-${link?.label?.toLowerCase()}`}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className="nav-link-terminal py-2.5 border-b border-border/50 last:border-0 block"
              >
                <span className="text-terminal-green mr-2">›</span>
                {link?.label}
              </a>
            ))}
            <div className="pt-3 flex gap-3">
              <a href="#quick-start" className="btn-terminal text-2xs flex-1 justify-center" onClick={() => setMobileOpen(false)}>
                Quick Start
              </a>
              <a
                href="https://github.com/AiTenetAgency101/atmospheric-truth-layer"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-ghost text-2xs flex-1 justify-center"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}