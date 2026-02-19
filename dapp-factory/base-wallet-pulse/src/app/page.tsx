'use client';
import { useState, useCallback } from 'react';

interface WalletData {
  address: string;
  balanceEth: string;
  txs: any[];
  tokenTxs: any[];
}

function shortenAddr(a: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '';
}

function timeAgo(ts: string) {
  const diff = Date.now() / 1000 - parseInt(ts);
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Home() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/wallet?address=${address}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span className="mono text-xs text-[#737373] tracking-wider uppercase">
            Base Chain
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Wallet Pulse</h1>
        <p className="text-[#737373] text-sm mt-1">
          Real-time wallet analytics on Base
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && lookup()}
          className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-lg px-4 py-3 mono text-sm focus:outline-none focus:border-[#3b82f6] transition-colors placeholder:text-[#404040]"
        />
        <button
          onClick={lookup}
          disabled={loading}
          className="bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? '...' : 'Lookup'}
        </button>
      </div>

      {error && <p className="text-[#ef4444] text-sm mb-4">{error}</p>}

      {data && (
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-6">
            <div className="text-xs text-[#737373] uppercase tracking-wider mb-1">
              ETH Balance
            </div>
            <div className="text-2xl font-semibold mono">
              {data.balanceEth}{' '}
              <span className="text-[#737373] text-base">ETH</span>
            </div>
            <div className="text-xs text-[#737373] mono mt-1">
              {data.address}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              Recent Transactions
            </h2>
            {data.txs.length === 0 ? (
              <p className="text-[#737373] text-sm">No transactions found</p>
            ) : (
              <div className="space-y-2">
                {data.txs.map((tx, i) => {
                  const isOut =
                    tx.from.toLowerCase() === data.address.toLowerCase();
                  return (
                    <a
                      key={i}
                      href={`https://basescan.org/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#1a1a1a] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded ${isOut ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#22c55e]/10 text-[#22c55e]'}`}
                        >
                          {isOut ? 'OUT' : 'IN'}
                        </span>
                        <span className="mono text-xs text-[#737373]">
                          {shortenAddr(tx.hash)}
                        </span>
                        {tx.functionName && (
                          <span className="text-xs text-[#737373] bg-[#1a1a1a] px-1.5 py-0.5 rounded">
                            {tx.functionName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="mono text-sm">
                          {tx.value !== '0.0000' ? `${tx.value} ETH` : '—'}
                        </span>
                        <span className="text-xs text-[#737373]">
                          {timeAgo(tx.timeStamp)}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Token Transfers */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              Recent Token Activity
            </h2>
            {data.tokenTxs.length === 0 ? (
              <p className="text-[#737373] text-sm">No token transfers found</p>
            ) : (
              <div className="space-y-2">
                {data.tokenTxs.map((tx, i) => {
                  const isOut =
                    tx.from.toLowerCase() === data.address.toLowerCase();
                  return (
                    <a
                      key={i}
                      href={`https://basescan.org/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#1a1a1a] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded ${isOut ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#22c55e]/10 text-[#22c55e]'}`}
                        >
                          {isOut ? 'OUT' : 'IN'}
                        </span>
                        <span className="text-sm font-medium">
                          {tx.tokenSymbol}
                        </span>
                        <span className="mono text-xs text-[#737373]">
                          {shortenAddr(tx.hash)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="mono text-sm">
                          {tx.value} {tx.tokenSymbol}
                        </span>
                        <span className="text-xs text-[#737373]">
                          {timeAgo(tx.timeStamp)}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-[#737373] pt-4">
            Built by{' '}
            <a
              href="https://x.com/AxiomBot"
              target="_blank"
              className="text-[#3b82f6] hover:underline"
            >
              Axiom
            </a>{' '}
            · Powered by Base · Data from Basescan
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="text-center py-20">
          <div className="text-[#737373] text-sm">
            Enter a Base wallet address to view on-chain activity
          </div>
          <button
            onClick={() => {
              setAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
            }}
            className="mt-3 text-xs text-[#3b82f6] hover:underline mono"
          >
            Try vitalik.eth →
          </button>
        </div>
      )}
    </main>
  );
}
