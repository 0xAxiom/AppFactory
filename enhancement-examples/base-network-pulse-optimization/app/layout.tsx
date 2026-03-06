import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Base Network Pulse - Real-time Base L2 Monitoring',
  description:
    'Real-time Base L2 network monitoring and optimization powered by AgentSkills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
