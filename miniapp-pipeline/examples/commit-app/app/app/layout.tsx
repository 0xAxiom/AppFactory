import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import { minikitConfig } from '@/minikit.config';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  openGraph: {
    title: minikitConfig.miniapp.ogTitle,
    description: minikitConfig.miniapp.ogDescription,
    images: [minikitConfig.miniapp.ogImageUrl],
  },
  other: {
    'fc:frame': 'vNext',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#0A0A0A] text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
