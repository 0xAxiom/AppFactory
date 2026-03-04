'use client';

import { useState, useEffect, useCallback } from 'react';

interface Swap {
  hash: string;
  from: string;
  value: string;
  timestamp: number;
  gasUsed: string;
  gasPrice: string;
  block: string;
  method: string;
}

function truncAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(ts: number) {
  const diff = Math.floor(Date.now() / 1000 - ts);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function classifySize(value: string): 'whale' | 'large' | 'medium' | 'small' {
  const v = parseFloat(value);
  if (v >= 10) return 'whale';
  if (v >= 1) return 'large';
  if (v >= 0.1) return 'medium';
  return 'small';
}

const sizeColors = {
  whale: 'text-red-400',
  large: 'text-amber-400',
  medium: 'text-blue-400',
  small: 'text-[#666]',
};

const sizeDots = {
  whale: 'bg-red-400',
  large: 'bg-amber-400',
  medium: 'bg-blue-400',
  small: 'bg-[#333]',
};

export default function Home() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchSwaps = useCallback(async () => {
    try {
      const res = await fetch('/api/swaps');
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSwaps(data.swaps || []);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchSwaps, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchSwaps]);

  const totalVolume = swaps.reduce((s, t) => s + parseFloat(t.value), 0);
  const whaleCount = swaps.filter(
    (t) => classifySize(t.value) === 'whale'
  ).length;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
            <h1 className="text-xl font-semibold tracking-tight">
              Base DEX Tracker
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs mono px-3 py-1.5 rounded border transition-colors ${
                autoRefresh
                  ? 'border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/5'
                  : 'border-[#1a1a1a] text-[#666]'
              }`}
            >
              {autoRefresh ? 'LIVE' : 'PAUSED'}
            </button>
            <button
              onClick={fetchSwaps}
              className="text-xs text-[#666] hover:text-[#e0e0e0] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
        <p className="text-sm text-[#666]">
          Real-time Uniswap swaps on Base chain via Basescan API
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Swaps', value: swaps.length.toString() },
          { label: 'Volume', value: `${totalVolume.toFixed(4)} ETH` },
          { label: 'Whales', value: whaleCount.toString() },
          {
            label: 'Updated',
            value: lastUpdate ? lastUpdate.toLocaleTimeString() : '--',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4"
          >
            <div className="text-xs text-[#666] mb-1">{stat.label}</div>
            <div className="text-lg font-medium mono">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-xs text-[#666]">
        {(['whale', 'large', 'medium', 'small'] as const).map((size) => (
          <div key={size} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${sizeDots[size]}`} />
            <span className="capitalize">{size}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-[#666] py-20">Loading swaps...</div>
      ) : error ? (
        <div className="text-center text-red-400/70 py-20 text-sm">{error}</div>
      ) : swaps.length === 0 ? (
        <div className="text-center text-[#666] py-20">No swaps found</div>
      ) : (
        <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a] text-[#666] text-xs">
                <th className="text-left p-3 font-medium">Time</th>
                <th className="text-left p-3 font-medium">Trader</th>
                <th className="text-right p-3 font-medium">Value (ETH)</th>
                <th className="text-right p-3 font-medium hidden md:table-cell">
                  Gas (Gwei)
                </th>
                <th className="text-right p-3 font-medium hidden md:table-cell">
                  Block
                </th>
                <th className="text-right p-3 font-medium">Tx</th>
              </tr>
            </thead>
            <tbody>
              {swaps.map((swap) => {
                const size = classifySize(swap.value);
                return (
                  <tr
                    key={swap.hash}
                    className="border-b border-[#1a1a1a]/50 hover:bg-[#111] transition-colors"
                  >
                    <td className="p-3 mono text-[#666]">
                      {timeAgo(swap.timestamp)}
                    </td>
                    <td className="p-3 mono">
                      <a
                        href={`https://basescan.org/address/${swap.from}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#3b82f6] transition-colors"
                      >
                        {truncAddr(swap.from)}
                      </a>
                    </td>
                    <td
                      className={`p-3 mono text-right font-medium ${sizeColors[size]}`}
                    >
                      <span className="flex items-center justify-end gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sizeDots[size]}`}
                        />
                        {parseFloat(swap.value).toFixed(4)}
                      </span>
                    </td>
                    <td className="p-3 mono text-right text-[#666] hidden md:table-cell">
                      {swap.gasPrice}
                    </td>
                    <td className="p-3 mono text-right text-[#666] hidden md:table-cell">
                      {swap.block}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`https://basescan.org/tx/${swap.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3b82f6]/60 hover:text-[#3b82f6] transition-colors mono text-xs"
                      >
                        {swap.hash.slice(0, 8)}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-[#666]">
        <span>Built by Axiom | Base chain only</span>
        <span className="mono">Powered by Basescan API</span>
      </footer>
    </div>
  );
}
