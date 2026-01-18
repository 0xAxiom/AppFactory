"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Check, Clock } from "lucide-react";

interface ShowcaseApp {
  id: string;
  name: string;
  description: string;
  ticker: string;
  token_address: string;
  creator_wallet: string;
  draft_url: string;
  production_url: string | null;
  status: "draft" | "deployed";
  twitter: string | null;
  website: string | null;
  created_at: string;
}

export default function ShowcasePage() {
  const [apps, setApps] = useState<ShowcaseApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch("/api/showcase");
        const data = await response.json();
        if (data.success) {
          setApps(data.apps);
        }
      } catch (error) {
        console.error("Failed to fetch apps:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Showcase</h1>
          <p className="text-zinc-400">Apps built and launched with Web3 Factory</p>
        </div>
        <Link
          href="/upload"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
        >
          Launch Your App
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse"
            >
              <div className="h-6 bg-zinc-800 rounded mb-4 w-3/4" />
              <div className="h-4 bg-zinc-800 rounded mb-2" />
              <div className="h-4 bg-zinc-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 mb-4">No apps launched yet.</p>
          <Link
            href="/upload"
            className="text-blue-500 hover:underline"
          >
            Be the first to launch →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function AppCard({ app }: { app: ShowcaseApp }) {
  const appUrl = app.production_url || app.draft_url;
  const isDeployed = app.status === "deployed";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold">{app.name}</h3>
        <span
          className={`
            flex items-center gap-1 text-xs px-2 py-1 rounded-full
            ${isDeployed ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}
          `}
        >
          {isDeployed ? (
            <>
              <Check className="w-3 h-3" /> Deployed
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" /> Draft
            </>
          )}
        </span>
      </div>

      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{app.description}</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-500">Token:</span>
          <span className="text-sm font-mono">${app.ticker}</span>
        </div>
        <a
          href={`https://solscan.io/token/${app.token_address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          View on Solscan
        </a>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
        >
          Open App <ExternalLink className="w-3 h-3" />
        </a>

        {app.twitter && (
          <a
            href={`https://twitter.com/${app.twitter.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white transition"
          >
            {app.twitter}
          </a>
        )}
      </div>
    </div>
  );
}
