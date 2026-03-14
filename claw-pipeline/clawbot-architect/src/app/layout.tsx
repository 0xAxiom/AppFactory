import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clawbot Architect — AI Agent Design Studio',
  description:
    'Design, configure, and preview your own AI agent. Built with AppFactory.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
