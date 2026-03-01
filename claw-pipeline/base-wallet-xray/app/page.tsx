'use client';

import { useState } from 'react';

interface WalletData {
  address: string;
  balance: string;
  walletType: string;
  stats: {
    totalTxs: number;
    sent: number;
    received: number;
    gasSpentETH: string;
    uniqueContracts: number;
    uniqueTokens: number;
    tokenList: string[];
    firstTx: number | null;
    lastTx: number | null;
    internalTxCount: number;
  };
  recentTxs: {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    method: string;
    isError: boolean;
    gasUsed: number;
  }[];
  recentTokens: {
    symbol: string;
    name: string;
    value: string;
    hash: string;
    timestamp: number;
    direction: string;
  }[];
}

function truncate(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function Home() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!address) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/analyze?address=${address}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs mono text-[var(--text-muted)] uppercase tracking-widest">
            Base Chain
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet X-Ray</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          On-chain behavioral profiler for Base
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
          placeholder="0x... Enter any Base address"
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 mono text-sm focus:outline-none focus:border-blue-500/50 placeholder:text-[var(--text-muted)]"
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Scanning...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="p-3 border border-red-500/20 bg-red-500/5 rounded-lg text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="mono text-sm text-[var(--text-muted)]">
                  {data.address}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold">{data.balance} ETH</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {data.walletType}
                  </span>
                </div>
              </div>
              <a
                href={`https://basescan.org/address/${data.address}`}
                target="_blank"
                rel="noopener"
                className="text-xs text-[var(--text-muted)] hover:text-blue-400 transition-colors"
              >
                Basescan ↗
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Transactions', value: data.stats.totalTxs },
                { label: 'Gas Spent', value: `${data.stats.gasSpentETH} ETH` },
                { label: 'Contracts', value: data.stats.uniqueContracts },
                { label: 'Tokens', value: data.stats.uniqueTokens },
                { label: 'Sent', value: data.stats.sent },
                { label: 'Received', value: data.stats.received },
                { label: 'Internal Txs', value: data.stats.internalTxCount },
                {
                  label: 'First Active',
                  value: data.stats.firstTx
                    ? timeAgo(data.stats.firstTx)
                    : 'N/A',
                },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--bg)] rounded-lg p-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1">
                    {s.label}
                  </p>
                  <p className="mono text-sm font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Token Tags */}
          {data.stats.tokenList.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wider">
                Token Activity
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.stats.tokenList.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs mono bg-[var(--bg)] border border-[var(--border)] rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wider">
              Recent Transactions
            </h2>
            <div className="space-y-2">
              {data.recentTxs.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs mono px-1.5 py-0.5 rounded ${tx.isError ? 'bg-red-500/10 text-red-400' : 'bg-[var(--bg)] text-[var(--text-muted)]'}`}
                    >
                      {tx.method}
                    </span>
                    <a
                      href={`https://basescan.org/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener"
                      className="mono text-xs text-blue-400 hover:underline"
                    >
                      {truncate(tx.hash)}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    {Number(tx.value) > 0 && (
                      <span className="mono text-xs">{tx.value} ETH</span>
                    )}
                    <span className="text-xs text-[var(--text-muted)]">
                      {timeAgo(tx.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Token Transfers */}
          {data.recentTokens.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wider">
                Token Transfers
              </h2>
              <div className="space-y-2">
                {data.recentTokens.map((t, i) => (
                  <div
                    key={`${t.hash}-${i}`}
                    className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${t.direction === 'in' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                      >
                        {t.direction === 'in' ? 'IN' : 'OUT'}
                      </span>
                      <span className="mono text-sm">
                        {t.value} {t.symbol}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {timeAgo(t.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-xs text-[var(--text-muted)]">
              Built by{' '}
              <a
                href="https://x.com/AxiomBot"
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                Axiom
              </a>{' '}
              on Base
            </p>
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)] text-sm">
            Enter any Base address to analyze on-chain behavior
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
              '0x523Eff3dB03938eaa31a5a6FBd41E3B9d23edde5',
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setAddress(ex);
                }}
                className="mono text-xs text-[var(--text-muted)] hover:text-blue-400 transition-colors"
              >
                {truncate(ex)}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
