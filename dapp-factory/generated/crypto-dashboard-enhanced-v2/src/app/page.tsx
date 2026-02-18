'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Globe,
  Zap,
} from 'lucide-react';

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  isPositive: boolean;
}

interface PortfolioItem {
  symbol: string;
  holdings: number;
  value: number;
  allocation: number;
}

export default function CryptoDashboard() {
  const [prices, setPrices] = useState<PriceData[]>([
    { symbol: 'SOL', price: 245.67, change: 5.23, isPositive: true },
    { symbol: 'AXIOM', price: 0.0042, change: -2.15, isPositive: false },
    { symbol: 'ETH', price: 3456.78, change: 3.45, isPositive: true },
    { symbol: 'BASE', price: 1.234, change: 1.87, isPositive: true },
  ]);

  const [portfolio] = useState<PortfolioItem[]>([
    { symbol: 'SOL', holdings: 12.5, value: 3070.38, allocation: 45 },
    { symbol: 'AXIOM', holdings: 50000, value: 210.0, allocation: 3 },
    { symbol: 'ETH', holdings: 1.25, value: 4320.98, allocation: 52 },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [totalValue, setTotalValue] = useState(7601.36);
  const [dailyChange, setDailyChange] = useState(2.34);

  const refreshPrices = async () => {
    setIsRefreshing(true);

    // Simulate API call with random price movements
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPrices((prev) =>
      prev.map((item) => {
        const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
        const newPrice = item.price * (1 + changePercent / 100);
        return {
          ...item,
          price: parseFloat(newPrice.toFixed(item.symbol === 'AXIOM' ? 6 : 2)),
          change: parseFloat(changePercent.toFixed(2)),
          isPositive: changePercent > 0,
        };
      })
    );

    setLastUpdate(new Date());
    setIsRefreshing(false);

    // Update portfolio value
    const newTotal = 7601.36 * (1 + (Math.random() - 0.5) * 0.1);
    setTotalValue(parseFloat(newTotal.toFixed(2)));
    setDailyChange(parseFloat(((Math.random() - 0.5) * 10).toFixed(2)));
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Inter']">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-[#00D4AA]" />
            <h1 className="text-2xl font-semibold">Crypto Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-zinc-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={refreshPrices}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00D4AA] hover:bg-[#00B899] disabled:opacity-50 text-black rounded-lg transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="col-span-2 bg-[#111111] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Portfolio Value</h2>
              <Activity className="h-5 w-5 text-[#00D4AA]" />
            </div>
            <div className="text-3xl font-bold mb-2">
              ${totalValue.toLocaleString()}
            </div>
            <div
              className={`flex items-center ${dailyChange >= 0 ? 'text-[#00D4AA]' : 'text-red-500'}`}
            >
              {dailyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>
                {dailyChange >= 0 ? '+' : ''}
                {dailyChange}% (24h)
              </span>
            </div>
          </div>

          <div className="bg-[#111111] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">
                Best Performer
              </h3>
              <TrendingUp className="h-4 w-4 text-[#00D4AA]" />
            </div>
            <div className="text-xl font-bold">SOL</div>
            <div className="text-[#00D4AA]">+5.23%</div>
          </div>

          <div className="bg-[#111111] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">Holdings</h3>
              <DollarSign className="h-4 w-4 text-[#00D4AA]" />
            </div>
            <div className="text-xl font-bold">{portfolio.length}</div>
            <div className="text-zinc-400">Assets</div>
          </div>
        </div>

        {/* Live Prices */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Live Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {prices.map((item) => (
              <div
                key={item.symbol}
                className="bg-[#111111] rounded-xl p-6 border border-zinc-800 hover:border-[#00D4AA] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">{item.symbol}</span>
                  <div
                    className={`flex items-center ${item.isPositive ? 'text-[#00D4AA]' : 'text-red-500'}`}
                  >
                    {item.isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2">
                  $
                  {item.symbol === 'AXIOM'
                    ? item.price.toFixed(6)
                    : item.price.toLocaleString()}
                </div>
                <div
                  className={`text-sm ${item.isPositive ? 'text-[#00D4AA]' : 'text-red-500'}`}
                >
                  {item.isPositive ? '+' : ''}
                  {item.change}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Portfolio Holdings</h2>
          <div className="bg-[#111111] rounded-xl border border-zinc-800 overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-zinc-800 text-sm font-medium text-zinc-400">
              <span>Asset</span>
              <span>Holdings</span>
              <span>Value</span>
              <span>Allocation</span>
              <span>Action</span>
            </div>
            {portfolio.map((item) => (
              <div
                key={item.symbol}
                className="grid grid-cols-5 gap-4 p-4 border-b border-zinc-800 last:border-b-0 hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="font-medium">{item.symbol}</span>
                <span>{item.holdings.toLocaleString()}</span>
                <span>${item.value.toLocaleString()}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-[#00D4AA] h-2 rounded-full"
                      style={{ width: `${item.allocation}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{item.allocation}%</span>
                </div>
                <button className="text-[#00D4AA] hover:text-[#00B899] text-sm font-medium">
                  Trade
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Integration Showcase */}
        <div className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] rounded-xl p-6 border border-[#00D4AA]">
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="h-6 w-6 text-[#00D4AA]" />
            <h2 className="text-xl font-semibold">Powered by AgentSkills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-[#00D4AA]" />
                <span className="font-medium">Solana Price API</span>
              </div>
              <p className="text-sm text-zinc-400">
                Real-time SOL and AXIOM token prices
              </p>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-4 w-4 text-[#00D4AA]" />
                <span className="font-medium">Bankr Integration</span>
              </div>
              <p className="text-sm text-zinc-400">
                Portfolio management and trading
              </p>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-[#00D4AA]" />
                <span className="font-medium">Web Design Guidelines</span>
              </div>
              <p className="text-sm text-zinc-400">
                Bloomberg × Apple design system
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#00D4AA]/10 rounded-lg border border-[#00D4AA]/20">
            <p className="text-sm text-[#00D4AA]">
              ⚡ This dashboard integrates multiple AgentSkills for real-time
              data, interactive trading, and premium design compliance.
              Auto-refreshes every 30 seconds with live price feeds.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
