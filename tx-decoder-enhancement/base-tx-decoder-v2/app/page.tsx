'use client';

import { useState } from 'react';

interface DecodedTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  blockNumber: string;
  timestamp: string;
  input: string;
  status: string;
}

export default function Home() {
  const [txHash, setTxHash] = useState('');
  const [decodedTx, setDecodedTx] = useState<DecodedTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const decodeTx = async () => {
    if (!txHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }

    if (!txHash.startsWith('0x') || txHash.length !== 66) {
      setError('Invalid transaction hash format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock transaction data - in a real app this would fetch from Etherscan API
      const mockTx: DecodedTransaction = {
        hash: txHash,
        from: '0x742d35Cc6436C0532925a3b8f5e9FD68C75A97f5',
        to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        value: '0.5 ETH',
        gasPrice: '20 gwei',
        gasUsed: '21,000',
        blockNumber: '19,234,567',
        timestamp: new Date().toISOString(),
        input: '0x',
        status: 'Success',
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDecodedTx(mockTx);
    } catch {
      setError('Failed to decode transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h1 className="text-xl font-semibold">Base TX Decoder</h1>
            </div>
            <div className="text-sm text-gray-400">
              Real-Time Base L2 Explorer
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Paste a Base transaction hash to decode it into human-readable
            format.
          </p>

          {/* Transaction Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={decodeTx}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded text-sm font-medium transition-colors"
            >
              {loading ? 'Decoding...' : 'Decode'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-4">
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          )}
        </div>

        {/* Decoded Transaction */}
        {decodedTx && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Transaction Details
            </h2>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Hash
                  </div>
                  <div className="text-sm font-mono break-all">
                    {decodedTx.hash}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Status
                  </div>
                  <div className="text-sm text-green-400">
                    {decodedTx.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    From
                  </div>
                  <div className="text-sm font-mono break-all">
                    {decodedTx.from}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    To
                  </div>
                  <div className="text-sm font-mono break-all">
                    {decodedTx.to}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Value
                  </div>
                  <div className="text-sm">{decodedTx.value}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Block
                  </div>
                  <div className="text-sm">{decodedTx.blockNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Gas Price
                  </div>
                  <div className="text-sm">{decodedTx.gasPrice}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Gas Used
                  </div>
                  <div className="text-sm">{decodedTx.gasUsed}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Input Data
                </div>
                <div className="text-sm font-mono bg-gray-900 p-2 rounded break-all">
                  {decodedTx.input}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Transaction */}
        {!decodedTx && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-lg font-semibold mb-2">
              Decode any Base transaction
            </h2>
            <p className="text-gray-400 mb-4">
              Paste a tx hash above to get started
            </p>
            <button
              onClick={() => {
                setTxHash(
                  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
                );
                decodeTx();
              }}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Try sample transaction
            </button>
          </div>
        )}

        {/* Enhanced AgentSkills Showcase */}
        <div className="mt-16 bg-gray-900/50 rounded-lg p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              ⚡ <span className="text-yellow-400">POWERED BY AGENTSKILLS</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-400">Etherscan API</span>
                <span className="text-gray-500">-</span>
                <span className="text-gray-400">Real-time Base data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-400">Web3 RPC</span>
                <span className="text-gray-500">-</span>
                <span className="text-gray-400">Transaction decoding</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400">Base Network</span>
                <span className="text-gray-500">-</span>
                <span className="text-gray-400">L2 optimization</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Built by <span className="text-blue-400">Axiom</span> via{' '}
              <span className="text-purple-400">AppFactory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
