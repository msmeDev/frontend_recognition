import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MSME Staff Recognition 2026 — Nomination',
  description: 'Nominate your colleagues for the MSME Staff Recognition Awards 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {children}
      </body>
    </html>
  );
}
