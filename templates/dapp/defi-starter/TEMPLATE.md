# DeFi Starter dApp Template

**Pipeline**: dapp-factory
**Category**: Finance / DeFi
**Complexity**: High
**Mode**: B (Agent-Backed) - Recommended

---

## Description

A dApp template for decentralized finance applications. Includes portfolio tracking, token swaps simulation, liquidity pool displays, and AI-powered recommendations. Perfect for building DeFi dashboards and investment tools.

---

## Pre-Configured Features

### Core Features

- Portfolio dashboard with holdings
- Token price displays with charts
- Swap interface (simulated/mock)
- Liquidity pool overview
- Transaction history
- AI recommendations panel (Mode B)

### UI Components

- Dark mode by default
- Real-time price tickers
- Candlestick charts
- Token pair selectors
- Slippage tolerance controls
- Transaction confirmation modals

### Blockchain Integration

- Wallet connection (Solana adapter)
- Address display with truncation
- Balance fetching
- Transaction simulation

### AI Agent (Mode B)

- Portfolio analysis agent
- Risk assessment tool
- Rebalancing recommendations
- Market sentiment analysis

---

## Ideal For

- Portfolio trackers
- DEX aggregators
- Yield farming dashboards
- Token analytics platforms
- DeFi education apps
- Investment recommendation engines

---

## File Structure

```
dapp-builds/<app-slug>/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard home
│   │   ├── portfolio/
│   │   │   └── page.tsx      # Holdings view
│   │   ├── swap/
│   │   │   └── page.tsx      # Token swap
│   │   ├── pools/
│   │   │   └── page.tsx      # Liquidity pools
│   │   └── advisor/
│   │       └── page.tsx      # AI recommendations
│   ├── components/
│   │   ├── Portfolio/
│   │   │   ├── Holdings.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── AssetRow.tsx
│   │   ├── Charts/
│   │   │   ├── PriceChart.tsx
│   │   │   └── CandlestickChart.tsx
│   │   ├── Swap/
│   │   │   ├── SwapCard.tsx
│   │   │   └── TokenSelector.tsx
│   │   └── Wallet/
│   │       └── ConnectButton.tsx
│   ├── agent/                # Mode B only
│   │   ├── index.ts
│   │   ├── tools/
│   │   │   ├── analyzePortfolio.ts
│   │   │   └── getMarketData.ts
│   │   └── execution/
│   │       └── loop.ts
│   └── lib/
│       ├── tokens.ts         # Token data
│       └── prices.ts         # Price simulation
├── research/
│   ├── market_research.md    # DeFi market analysis
│   ├── competitor_analysis.md
│   ├── positioning.md
│   └── agent_landscape.md    # Mode B
└── ralph/
    └── PROGRESS.md
```

---

## Default Tech Stack

| Component | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 14 (App Router)            |
| Language  | TypeScript                         |
| Styling   | Tailwind CSS                       |
| UI        | shadcn/ui                          |
| Charts    | Recharts / TradingView Lightweight |
| Wallet    | @solana/wallet-adapter-react       |
| State     | Zustand                            |
| Animation | Framer Motion                      |

---

## Usage

When using this template in Phase 0, Claude will:

1. Determine Mode A or Mode B based on AI needs
2. Pre-configure wallet integration
3. Set up chart components
4. Include DeFi-specific market research
5. Generate agent architecture if Mode B

**Example prompt enhancement:**

- User says: "DeFi dashboard with AI recommendations"
- Template adds: portfolio tracking, price charts, swap simulation, AI agent for portfolio analysis and rebalancing suggestions, risk scoring

---

## Agent Decision Gate

Questions that trigger Mode B:

- Does the app require autonomous reasoning? **YES** (portfolio analysis)
- Does it involve long-running decision loops? **YES** (monitoring, rebalancing)
- Does it need tool-using entities? **YES** (price APIs, portfolio data)
- Does it require memory or environment modeling? **YES** (historical context)
- Does it coordinate on-chain and off-chain logic? **YES** (wallet + analysis)

**Result**: 5/5 YES = Mode B (Agent-Backed dApp)

---

## Customization Points

| Element      | How to Customize                           |
| ------------ | ------------------------------------------ |
| Token list   | Edit `lib/tokens.ts`                       |
| Chart style  | Modify `components/Charts/`                |
| Swap pairs   | Update `components/Swap/TokenSelector.tsx` |
| Agent tools  | Add to `agent/tools/`                      |
| Price source | Replace simulation in `lib/prices.ts`      |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Dashboard loads with skeleton states
- [ ] Wallet connects and shows address
- [ ] Portfolio displays holdings correctly
- [ ] Charts render with sample data
- [ ] Swap interface calculates preview
- [ ] Agent provides recommendations (Mode B)
- [ ] All interactive elements have hover states
- [ ] Mobile responsive layout works
- [ ] Error states handle gracefully
