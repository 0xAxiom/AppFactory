import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claw Pipeline - Build Your AI Agent",
  description: "Generate a complete OpenClaw agent setup in minutes. Describe your agent, configure it, download a ready-to-run zip.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
