import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { inter, mono } from '@/lib/fonts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Luminary Studio - Brand Identity Design',
    template: '%s | Luminary Studio',
  },
  description: 'Luminary Studio is a brand identity agency for ambitious companies. We create logos, visual systems, and brand guidelines that resonate.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://luminary.studio'),
  openGraph: {
    title: 'Luminary Studio - Brand Identity Design',
    description: 'Brand identity for ambitious companies.',
    url: 'https://luminary.studio',
    siteName: 'Luminary Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luminary Studio - Brand Identity Design',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luminary Studio - Brand Identity Design',
    description: 'Brand identity for ambitious companies.',
    images: ['/og-image.png'],
    creator: '@luminarystudio',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
