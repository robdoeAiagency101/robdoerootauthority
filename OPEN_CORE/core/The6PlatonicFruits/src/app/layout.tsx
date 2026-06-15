import React from 'react';
import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import '../styles/tailwind.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Atmospheric Truth Layer — Sovereign Cryptographic Weather Verification',
  description: 'ATL transforms satellite weather data into tamper-proof, globally verifiable truth through multi-source Byzantine consensus and immutable XYO witness ledger anchoring.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className={`${jetbrainsMono.className} bg-black text-terminal-green antialiased`}>
        {children}

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fatmospheri6415back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}