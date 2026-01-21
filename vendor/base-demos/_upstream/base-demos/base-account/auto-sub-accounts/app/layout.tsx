import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sub Accounts Example',
  description: 'Demo app showing Base Account Sub Accounts integration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
