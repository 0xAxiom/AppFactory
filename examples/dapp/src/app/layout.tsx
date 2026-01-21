import type { Metadata } from 'next';
import './globals.css';

/**
 * Root Layout
 *
 * The root layout wraps all pages. Add providers here for
 * global state, wallet connections, etc.
 */

export const metadata: Metadata = {
  title: 'dApp Example - App Factory',
  description:
    'A minimal Next.js dApp demonstrating the dApp Factory structure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Add providers here (wallet, theme, etc.) */}
        {children}
      </body>
    </html>
  );
}
