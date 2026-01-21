import type { Metadata, Viewport } from 'next';
import { minikitConfig } from '../minikit.config';
import './globals.css';

/**
 * Root Layout
 *
 * Configures metadata and wraps all pages.
 */

export const metadata: Metadata = {
  title: minikitConfig.name,
  description: minikitConfig.description,
  openGraph: {
    title: minikitConfig.name,
    description: minikitConfig.description,
    images: [minikitConfig.ogImageUrl],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen safe-area-padding">
        {children}
      </body>
    </html>
  );
}
