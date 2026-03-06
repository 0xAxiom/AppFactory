'use client';

import { useEffect, useState, useCallback } from 'react';

interface Stats {
  blockNumber: number;
  gasPrice: string;
  txCount: number;
  tps: string;
  blockTime: number;
  timestamp: number;
}

interface NewsItem {
  title: string;
  url: string;
  date: string;
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/50">
      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="font-mono text-2xl text-neutral-100">
        {value}
        {unit && <span className="text-sm text-neutral-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [history, setHistory] = useState<{ tps: number; block: number }[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (!data.error) {
        setStats(data);
        setLastUpdate(new Date());
        setHistory((prev) => [
          ...prev.slice(-29),
          { tps: parseFloat(data.tps), block: data.blockNumber },
        ]);
      }
    } catch {}
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.results) setNews(data.results);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStats();
    fetchNews();
    const statsInterval = setInterval(fetchStats, 4000);
    const newsInterval = setInterval(fetchNews, 300000);
    return () => {
      clearInterval(statsInterval);
      clearInterval(newsInterval);
    };
  }, [fetchStats, fetchNews]);

  const maxTps = Math.max(...history.map((h) => h.tps), 1);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-neutral-100 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Base Network Pulse
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Live chain statistics and ecosystem news
          </p>
        </div>
        <div className="text-xs text-neutral-600 font-mono">
          {lastUpdate
            ? `Updated ${lastUpdate.toLocaleTimeString()}`
            : 'Loading...'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Block"
          value={stats?.blockNumber?.toLocaleString() ?? '—'}
        />
        <StatCard
          label="Gas Price"
          value={stats?.gasPrice ?? '—'}
          unit="gwei"
        />
        <StatCard label="Block TXs" value={stats?.txCount ?? '—'} />
        <StatCard label="TPS" value={stats?.tps ?? '—'} unit="tx/s" />
      </div>

      {/* TPS Chart */}
      {history.length > 1 && (
        <div className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/50 mb-8">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
            TPS History (last 30 blocks)
          </div>
          <div className="flex items-end gap-[2px] h-20">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500/60 rounded-sm min-h-[2px] transition-all duration-300"
                style={{ height: `${(h.tps / maxTps) * 100}%` }}
                title={`Block ${h.block}: ${h.tps} TPS`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Two columns: Block info + News */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Block details */}
        <div className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/50">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
            Block Details
          </div>
          {stats ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Block Time</span>
                <span className="font-mono text-neutral-300">
                  {stats.blockTime}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Block Timestamp</span>
                <span className="font-mono text-neutral-300">
                  {new Date(stats.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Network</span>
                <span className="font-mono text-neutral-300">Base Mainnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Chain ID</span>
                <span className="font-mono text-neutral-300">8453</span>
              </div>
              <a
                href={`https://basescan.org/block/${stats.blockNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-4 py-2 border border-neutral-700 rounded"
              >
                View on Basescan
              </a>
            </div>
          ) : (
            <div className="text-neutral-600 text-sm">Loading...</div>
          )}
        </div>

        {/* News */}
        <div className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/50">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
            Ecosystem News
          </div>
          {news.length > 0 ? (
            <div className="space-y-3">
              {news.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="text-sm text-neutral-300 group-hover:text-neutral-100 transition-colors line-clamp-2">
                    {item.title}
                  </div>
                  {item.date && (
                    <div className="text-xs text-neutral-600 mt-1 font-mono">
                      {item.date}
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-neutral-600 text-sm">Loading news...</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-neutral-700">
        Built by{' '}
        <a
          href="https://x.com/axiom0x"
          target="_blank"
          className="text-neutral-500 hover:text-neutral-400"
        >
          Axiom
        </a>{' '}
        — Base chain native
      </div>
    </main>
  );
}
