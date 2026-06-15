import React from 'react';
import PublicNavbar from './components/PublicNavbar';
import HeroSection from './components/HeroSection';
import LiveMetricsGrid from './components/LiveMetricsGrid';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CoreFeatures from './components/CoreFeatures';
import ComparisonTable from './components/ComparisonTable';
import UseCasesGrid from './components/UseCasesGrid';
import MarketOpportunity from './components/MarketOpportunity';
import TechStackTable from './components/TechStackTable';
import SecurityTrust from './components/SecurityTrust';
import AcademicFoundation from './components/AcademicFoundation';
import QuickStart from './components/QuickStart';
import DocumentationLinks from './components/DocumentationLinks';
import GenesisCertificate from './components/GenesisCertificate';
import SeriesASection from './components/SeriesASection';
import GlobalCoverage from './components/GlobalCoverage';
import ContributingSection from './components/ContributingSection';
import ContactSection from './components/ContactSection';
import SiteFooter from './components/SiteFooter';

export default function Page() {
  return (
    <div className="min-h-screen bg-black matrix-bg animate-flicker">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scan-line pointer-events-none z-0 opacity-30" />

      <PublicNavbar />

      <main className="relative z-10">
        <HeroSection />
        <LiveMetricsGrid />
        <ArchitectureDiagram />
        <CoreFeatures />
        <ComparisonTable />
        <UseCasesGrid />
        <MarketOpportunity />
        <TechStackTable />
        <SecurityTrust />
        <AcademicFoundation />
        <QuickStart />
        <DocumentationLinks />
        <GenesisCertificate />
        <SeriesASection />
        <GlobalCoverage />
        <ContributingSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}