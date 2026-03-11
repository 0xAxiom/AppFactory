import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Base Whale Watch | Large Transaction Monitor',
  description: 'Real-time large transaction monitoring on Base chain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[#0a0a0a] text-[#e0e0e0] font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
