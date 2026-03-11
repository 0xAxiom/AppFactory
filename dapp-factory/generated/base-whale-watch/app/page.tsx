'use client';

import { useEffect, useState, useCallback } from 'react';

interface Whale {
  hash: string;
  from: string;
  to: string;
  ethValue: number;
  timestamp: number;
  block: number;
  type: string;
}

interface WhaleData {
  whales: Whale[];
  ethPrice: number;
  latestBlock: number;
  threshold: number;
  timestamp: number;
}

function truncate(addr: string) {
  if (addr === 'Contract Creation') return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function sizeClass(eth: number): string {
  if (eth >= 100) return 'text-red-400 font-semibold';
  if (eth >= 10) return 'text-amber-400';
  return 'text-[#e0e0e0]';
}

export default function Home() {
  const [data, setData] = useState<WhaleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/whales');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError('Failed to fetch whale data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData, autoRefresh]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐋</div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Base Whale Watch
              </h1>
              <p className="text-xs text-[#666]">
                Large transaction monitor — Base chain
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {data && (
              <div className="text-right">
                <div className="text-xs text-[#666]">ETH/USD</div>
                <div className="text-sm font-[family-name:var(--font-mono)]">
                  ${data.ethPrice.toLocaleString()}
                </div>
              </div>
            )}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                autoRefresh
                  ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                  : 'border-[#1a1a1a] text-[#666] hover:text-[#999]'
              }`}
            >
              {autoRefresh ? '● LIVE' : '○ PAUSED'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Stats bar */}
        {data && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
              <div className="text-xs text-[#666] mb-1">Whale Transactions</div>
              <div className="text-2xl font-semibold font-[family-name:var(--font-mono)]">
                {data.whales.length}
              </div>
              <div className="text-xs text-[#666]">
                above {data.threshold} ETH
              </div>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
              <div className="text-xs text-[#666] mb-1">Total Volume</div>
              <div className="text-2xl font-semibold font-[family-name:var(--font-mono)]">
                {data.whales.reduce((sum, w) => sum + w.ethValue, 0).toFixed(1)}{' '}
                ETH
              </div>
              <div className="text-xs text-[#666]">
                {formatUsd(
                  data.whales.reduce(
                    (sum, w) => sum + w.ethValue * data.ethPrice,
                    0
                  )
                )}
              </div>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
              <div className="text-xs text-[#666] mb-1">Latest Block</div>
              <div className="text-2xl font-semibold font-[family-name:var(--font-mono)]">
                {data.latestBlock.toLocaleString()}
              </div>
              <div className="text-xs text-[#666]">Base L2</div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-[#666]">
            <div className="animate-pulse">
              Scanning Base chain for whales...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Table */}
        {data && data.whales.length > 0 && (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-[#666] text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">TX Hash</th>
                  <th className="text-left px-4 py-3">From</th>
                  <th className="text-left px-4 py-3">To</th>
                  <th className="text-right px-4 py-3">Amount (ETH)</th>
                  <th className="text-right px-4 py-3">USD Value</th>
                  <th className="text-right px-4 py-3">Block</th>
                  <th className="text-right px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.whales.map((whale, i) => (
                  <tr
                    key={`${whale.hash}-${i}`}
                    className="border-b border-[#1a1a1a]/50 hover:bg-[#1a1a1a]/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-blue-400">
                      <a
                        href={`https://basescan.org/tx/${whale.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {whale.hash.slice(0, 10)}...
                      </a>
                    </td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs">
                      <a
                        href={`https://basescan.org/address/${whale.from}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400"
                      >
                        {truncate(whale.from)}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs">
                      <a
                        href={
                          whale.to !== 'Contract Creation'
                            ? `https://basescan.org/address/${whale.to}`
                            : '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400"
                      >
                        {truncate(whale.to)}
                      </a>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-[family-name:var(--font-mono)] ${sizeClass(whale.ethValue)}`}
                    >
                      {whale.ethValue.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[#999]">
                      {formatUsd(whale.ethValue * data.ethPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-[family-name:var(--font-mono)] text-xs text-[#666]">
                      {whale.block.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[#666]">
                      {timeAgo(whale.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.whales.length === 0 && (
          <div className="text-center py-20 text-[#666]">
            <div className="text-4xl mb-4">🌊</div>
            <p>No whale transactions in the last 100 blocks.</p>
            <p className="text-xs mt-2">Threshold: {data.threshold} ETH</p>
          </div>
        )}

        {/* AgentSkills Showcase */}
        <div className="mt-8 p-6 bg-[#111] border border-[#1a1a1a] rounded-lg">
          <h3 className="text-sm font-semibold mb-4 text-[#e0e0e0]">
            🤖 Powered by AgentSkills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-[#222] rounded p-3 bg-[#0a0a0a]">
              <div className="font-semibold text-blue-400 mb-1">
                Etherscan API Integration
              </div>
              <div className="text-[#999]">
                Real-time blockchain data retrieval with transaction parsing,
                address lookups, and gas tracking across Base network.
              </div>
            </div>
            <div className="border border-[#222] rounded p-3 bg-[#0a0a0a]">
              <div className="font-semibold text-green-400 mb-1">
                Base RPC Monitoring
              </div>
              <div className="text-[#999]">
                Live block scanning and whale detection using Base L2
                infrastructure with automatic threshold filtering.
              </div>
            </div>
            <div className="border border-[#222] rounded p-3 bg-[#0a0a0a]">
              <div className="font-semibold text-purple-400 mb-1">
                Live Data Processing
              </div>
              <div className="text-[#999]">
                Real-time price feeds, transaction volume calculations, and
                automated refresh with WebSocket-like updates.
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-[#666] text-center">
            <span>Built with Agent-First Architecture • Skills: </span>
            <span className="text-blue-400">etherscan-api</span>
            <span className="text-[#333]"> • </span>
            <span className="text-green-400">base-rpc</span>
            <span className="text-[#333]"> • </span>
            <span className="text-purple-400">live-monitoring</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-[#666]">
          <div className="flex items-center gap-2">
            <span>Built by</span>
            <a
              href="https://x.com/AxiomBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Axiom
            </a>
            <span className="text-[#333]">|</span>
            <span>Base Whale Watch v1.0</span>
          </div>
          {data && (
            <div>
              Last update: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}
