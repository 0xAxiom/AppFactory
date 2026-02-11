import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      'https://base-agent-spend-permissions.vercel.app'
  ),
  title: 'Zora Creator Coins Agent',
  description:
    'AI Agent for buying Zora creator coins with secure spend permissions on Base',
  keywords: [
    'Base',
    'AI Agent',
    'Zora',
    'Creator Coins',
    'Spend Permissions',
    'Crypto',
    'DeFi',
    'Web3',
  ],
  authors: [{ name: 'Base Agent Team' }],
  creator: 'Base Agent Team',
  publisher: 'Base Agent Team',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://base-agent-spend-permissions.vercel.app',
    title: 'Base Agent Spend Permissions',
    description:
      'AI Agent for buying Zora creator coins with secure spend permissions on Base',
    siteName: 'Base Agent Spend Permissions',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Base Agent Spend Permissions',
        type: 'image/svg+xml',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Base Agent Spend Permissions',
    description:
      'AI Agent for buying Zora creator coins with secure spend permissions on Base',
    images: ['/og-image.svg'],
    creator: '@base',
    site: '@base',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },

  // Web App Manifest
  manifest: '/manifest.json',

  // Additional meta tags
  category: 'finance',
  classification: 'AI Agent for DeFi',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add these if you have them)
  // verification: {
  //   google: 'your-google-site-verification',
  //   yandex: 'your-yandex-verification',
  //   yahoo: 'your-yahoo-verification',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#0052FF" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
