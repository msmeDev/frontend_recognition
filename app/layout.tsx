import type { Metadata, Viewport } from 'next';
import { Caveat, Nunito } from 'next/font/google';
import { BackgroundDoodles } from '../components/Doodles';
import './globals.css';

// Self-hosted by Next at build time — no request to Google from the browser.
const hand = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-hand',
  display: 'swap',
});

const body = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MSME Staff Recognition 2026 — Nomination',
  description: 'Nominate your colleagues for the MSME Staff Recognition Awards 2026',
};

export const viewport: Viewport = {
  themeColor: '#F9F6F0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hand.variable} ${body.variable}`}>
      <body className="paper-bg min-h-screen font-sans text-ink antialiased">
        <BackgroundDoodles />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
