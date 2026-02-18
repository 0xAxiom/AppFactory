import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crypto Dashboard - Real-time Portfolio Tracker',
  description:
    'Professional crypto dashboard with real-time prices, portfolio tracking, and interactive features. Powered by AgentSkills.',
  keywords:
    'crypto, dashboard, portfolio, trading, real-time, solana, ethereum, axiom',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
