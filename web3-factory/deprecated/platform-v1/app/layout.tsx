import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 Factory - Build & Launch Web3 Apps",
  description: "Build Web3 apps and launch tokens in minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0b] text-white min-h-screen`}>
        <Providers>
          <nav className="border-b border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-bold">
                Web3 Factory
              </a>
              <div className="flex items-center gap-6">
                <a href="/upload" className="text-zinc-400 hover:text-white transition">
                  Upload
                </a>
                <a href="/showcase" className="text-zinc-400 hover:text-white transition">
                  Showcase
                </a>
                <div id="wallet-button" />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
