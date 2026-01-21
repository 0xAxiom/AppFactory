'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';

/**
 * Wallet Button Component
 *
 * A placeholder wallet connection button. In a real dApp,
 * this would use @solana/wallet-adapter-react or similar.
 *
 * To enable real wallet connections:
 * 1. Install: npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets
 * 2. Add WalletProvider to layout.tsx
 * 3. Replace this component with useWallet hook implementation
 */

export function WalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = () => {
    // Simulate wallet connection
    // In production, use actual wallet adapter
    setIsConnected(true);
    setAddress('8xK9...4f2D'); // Truncated address format
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  if (isConnected && address) {
    return (
      <button
        onClick={handleDisconnect}
        className="flex items-center gap-2 px-4 py-2 bg-secondary border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="font-mono text-sm">{address}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <Wallet className="w-4 h-4" />
      <span className="font-medium">Connect Wallet</span>
    </button>
  );
}
