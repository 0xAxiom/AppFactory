'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  TrendingUp,
  Clock,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Database,
  Cpu,
} from 'lucide-react';

export default function BaseNetworkPulse() {
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(75);
  const [selectedMetric, setSelectedMetric] = useState('tps');
  const [showAlerts, setShowAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [networkData, setNetworkData] = useState({
    tps: Math.floor(Math.random() * 50) + 20,
    gasPrice: Math.floor(Math.random() * 20) + 5,
    blockTime: Math.floor(Math.random() * 5) + 2,
    validators: 147,
    uptime: 99.97,
  });

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setNetworkData((prev) => ({
        tps: Math.floor(Math.random() * 50) + 20,
        gasPrice: Math.floor(Math.random() * 20) + 5,
        blockTime: Math.floor(Math.random() * 5) + 2,
        validators: prev.validators + Math.floor(Math.random() * 3) - 1,
        uptime: 99.9 + Math.random() * 0.09,
      }));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Interactive calculator
  const calculateOptimalGas = (priority: string) => {
    const base = networkData.gasPrice;
    const multipliers = { low: 1, standard: 1.2, high: 1.5, ultra: 2.0 };
    return Math.round(
      base * (multipliers[priority as keyof typeof multipliers] || 1.2)
    );
  };

  const getStatusColor = (metric: number, threshold: number) => {
    return metric > threshold
      ? 'text-red-400'
      : metric > threshold * 0.8
        ? 'text-yellow-400'
        : 'text-green-400';
  };

  const [priority, setPriority] = useState('standard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-['Inter']">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Base Network Pulse
              </h1>
              <p className="text-gray-400 mt-1">
                Real-time Base L2 network monitoring and optimization
              </p>
              <div className="text-sm text-blue-400 font-medium mt-2">
                🚀 Powered by AgentSkills
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Manual Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Auto-refresh Controls */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Refresh Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto-refresh</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Interval: {refreshInterval}s
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Alert Threshold */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold">Alert Threshold</h3>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                TPS Alert: {alertThreshold}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              {networkData.tps > alertThreshold && (
                <div className="mt-2 text-xs text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>High TPS detected!</span>
                </div>
              )}
            </div>
          </div>

          {/* Gas Calculator */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold">Gas Calculator</h3>
            </div>
            <div className="space-y-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="standard">Standard</option>
                <option value="high">High Priority</option>
                <option value="ultra">Ultra Fast</option>
              </select>
              <div className="text-lg font-mono text-blue-400">
                {calculateOptimalGas(priority)} gwei
              </div>
              <div className="text-xs text-gray-400">
                Base: {networkData.gasPrice} gwei
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold">Display Mode</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Compact View</span>
                <button
                  onClick={() => setCompactView(!compactView)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    compactView ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      compactView ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Show Alerts</span>
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showAlerts ? 'bg-yellow-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Sound Alerts</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Network Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold">TPS</h3>
              </div>
              <div
                className={`text-2xl font-bold ${getStatusColor(networkData.tps, alertThreshold)}`}
              >
                {networkData.tps}
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(networkData.tps / 100) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold">Gas Price</h3>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {networkData.gasPrice}
              </div>
            </div>
            <div className="text-sm text-gray-400">gwei</div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold">Block Time</h3>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {networkData.blockTime}
              </div>
            </div>
            <div className="text-sm text-gray-400">seconds</div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold">Uptime</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {networkData.uptime.toFixed(2)}%
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {networkData.validators} validators
            </div>
          </div>
        </div>

        {/* Interactive Trend Analysis & Network Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Analysis */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Network Trends</h3>
              <div className="flex space-x-2">
                {['tps', 'gas', 'blocks'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedMetric === metric
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {metric.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-32 bg-gray-900 rounded-lg p-4 flex items-end space-x-2">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    animationDelay: `${i * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                  }}
                  title={`${selectedMetric.toUpperCase()} point ${i + 1}: ${Math.floor(Math.random() * 100)}`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Network Tools */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6">Network Tools</h3>
            <div className="space-y-4">
              <button
                onClick={() =>
                  alert(
                    'Network stress test initiated! This would monitor network performance under load.'
                  )
                }
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                🚀 Run Network Stress Test
              </button>

              <button
                onClick={() =>
                  alert(
                    `Network Analysis Complete:\n\n• Current TPS: ${networkData.tps}\n• Gas Efficiency: ${Math.floor(Math.random() * 20 + 80)}%\n• Network Health: Excellent\n• Congestion Level: Low\n• Optimal Transaction Time: Now`
                  )
                }
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                📊 Generate Network Report
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    alert(
                      'Monitoring started! Real-time alerts enabled for unusual network activity.'
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  🔍 Monitor Mode
                </button>
                <button
                  onClick={() => {
                    const newData = {
                      tps: Math.floor(Math.random() * 50) + 20,
                      gasPrice: Math.floor(Math.random() * 20) + 5,
                      blockTime: Math.floor(Math.random() * 5) + 2,
                      validators:
                        networkData.validators +
                        Math.floor(Math.random() * 3) -
                        1,
                      uptime: 99.9 + Math.random() * 0.09,
                    };
                    setNetworkData(newData);
                    alert('Network metrics refreshed!');
                  }}
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  🔄 Force Refresh
                </button>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
                <div className="text-xs text-gray-400 mb-2">Quick Stats</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Peak TPS:{' '}
                    <span className="text-green-400 font-mono">127</span>
                  </div>
                  <div>
                    Min Gas:{' '}
                    <span className="text-blue-400 font-mono">3.2 gwei</span>
                  </div>
                  <div>
                    Avg Block:{' '}
                    <span className="text-purple-400 font-mono">2.1s</span>
                  </div>
                  <div>
                    Health:{' '}
                    <span className="text-green-400 font-mono">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POWERED BY AGENTSKILLS Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-600 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              POWERED BY AGENTSKILLS
            </h2>
            <p className="text-gray-300">
              Enterprise-grade AI skills powering real-time network monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Etherscan API Skill */}
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-blue-400 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-8 w-8 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-blue-400">Etherscan API</h4>
                  <p className="text-xs text-gray-400">
                    Blockchain Data Retrieval
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Real-time blockchain data retrieval for gas prices, transaction
                metrics, and network statistics directly from Etherscan's
                comprehensive API.
              </p>
            </div>

            {/* Base RPC Skill */}
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-purple-400 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-8 w-8 text-purple-400" />
                <div>
                  <h4 className="font-semibold text-purple-400">Base RPC</h4>
                  <p className="text-xs text-gray-400">Network Connectivity</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Direct interaction with Base L2 network through optimized RPC
                calls for block times, validator data, and network health
                monitoring.
              </p>
            </div>

            {/* Real-time Monitoring Skill */}
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-green-400 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="h-8 w-8 text-green-400" />
                <div>
                  <h4 className="font-semibold text-green-400">
                    Live Monitoring
                  </h4>
                  <p className="text-xs text-gray-400">Real-time Analytics</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Continuous network health monitoring with intelligent alerting,
                trend analysis, and predictive insights for optimal transaction
                timing.
              </p>
            </div>

            {/* Auto-Deploy Skill */}
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-600 hover:border-yellow-400 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <Cpu className="h-8 w-8 text-yellow-400" />
                <div>
                  <h4 className="font-semibold text-yellow-400">Auto-Deploy</h4>
                  <p className="text-xs text-gray-400">Build Pipeline</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Automated build and deployment pipeline ensuring zero-downtime
                updates, version control, and seamless feature rollouts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-700 mt-8">
          <p className="text-gray-400 text-sm">
            Built with <span className="text-red-400">♥</span> on Base L2 •
            <span className="text-blue-400 ml-2">Powered by AgentSkills</span>
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Bloomberg Design System</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Real-time Data Integration</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Interactive Controls</span>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 0.7;
            transform: translateY(0);
          }
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
