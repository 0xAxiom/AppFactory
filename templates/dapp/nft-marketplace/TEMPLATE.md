# NFT Marketplace dApp Template

**Pipeline**: dapp-factory
**Category**: NFT / Collectibles
**Complexity**: High
**Mode**: A (Standard) or B (Agent-Backed with curation)

---

## Description

A dApp template for NFT marketplace applications. Includes collection browsing, NFT detail views, auction/buy interfaces, and creator profiles. Optionally includes AI-powered curation and recommendations (Mode B).

---

## Pre-Configured Features

### Core Features

- Collection browsing with filters
- NFT detail pages with metadata
- Creator/artist profiles
- Auction countdown timers
- Buy now / Place bid interfaces
- Activity/transaction history

### UI Components

- Grid gallery with lazy loading
- NFT card with price and rarity
- Image zoom viewer
- Bid history lists
- Creator verification badges
- Rarity indicators

### Blockchain Integration

- Wallet connection (Solana adapter)
- NFT metadata display
- Collection stats
- Transaction simulation

### AI Agent (Mode B - Optional)

- NFT curation agent
- Price estimation tool
- Rarity analysis
- Trending detection

---

## Ideal For

- NFT marketplaces
- Art galleries
- Digital collectible stores
- Creator platforms
- Gaming item stores
- Music NFT platforms

---

## File Structure

```
dapp-builds/<app-slug>/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Featured/trending
│   │   ├── explore/
│   │   │   └── page.tsx      # Browse all NFTs
│   │   ├── collection/
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Collection view
│   │   ├── nft/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # NFT detail
│   │   ├── creator/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Creator profile
│   │   └── curated/
│   │       └── page.tsx      # AI picks (Mode B)
│   ├── components/
│   │   ├── NFT/
│   │   │   ├── NFTCard.tsx
│   │   │   ├── NFTDetail.tsx
│   │   │   ├── NFTImage.tsx
│   │   │   └── BidHistory.tsx
│   │   ├── Collection/
│   │   │   ├── CollectionHeader.tsx
│   │   │   └── CollectionStats.tsx
│   │   ├── Auction/
│   │   │   ├── BidPanel.tsx
│   │   │   └── Countdown.tsx
│   │   └── Gallery/
│   │       ├── NFTGrid.tsx
│   │       └── FilterSidebar.tsx
│   ├── agent/                # Mode B only
│   │   ├── index.ts
│   │   ├── tools/
│   │   │   ├── curateNFTs.ts
│   │   │   └── estimatePrice.ts
│   │   └── execution/
│   │       └── loop.ts
│   └── lib/
│       ├── nfts.ts           # NFT data
│       └── collections.ts    # Collection data
├── research/
│   ├── market_research.md    # NFT market analysis
│   ├── competitor_analysis.md
│   └── positioning.md
└── ralph/
    └── PROGRESS.md
```

---

## Default Tech Stack

| Component | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 14 (App Router)        |
| Language  | TypeScript                     |
| Styling   | Tailwind CSS                   |
| UI        | shadcn/ui                      |
| Images    | next/image + blur placeholders |
| Wallet    | @solana/wallet-adapter-react   |
| State     | Zustand                        |
| Animation | Framer Motion                  |

---

## Usage

When using this template in Phase 0, Claude will:

1. Determine Mode A or Mode B based on curation needs
2. Pre-configure collection and NFT data structures
3. Set up gallery components
4. Include NFT market research
5. Generate curation agent if Mode B

**Example prompt enhancement:**

- User says: "marketplace for digital art NFTs"
- Template adds: collection browsing with artist filters, NFT detail with provenance, bid/buy interface, creator profiles with portfolio, rarity indicators, AI curation for featured picks (Mode B)

---

## Agent Decision Gate

Questions for Mode B:

- Does the app require autonomous reasoning? **MAYBE** (curation)
- Does it involve long-running decision loops? **NO**
- Does it need tool-using entities? **MAYBE** (price estimation)
- Does it require memory or environment modeling? **YES** (trend history)
- Does it coordinate on-chain and off-chain logic? **YES**

**Result**: 2-3 YES = Mode A (Standard) or Mode B if curation is important

---

## Customization Points

| Element           | How to Customize                            |
| ----------------- | ------------------------------------------- |
| NFT display       | Edit `components/NFT/NFTCard.tsx`           |
| Collection layout | Modify `collection/[slug]/page.tsx`         |
| Auction rules     | Update `components/Auction/BidPanel.tsx`    |
| Filter options    | Edit `components/Gallery/FilterSidebar.tsx` |
| Curation criteria | Modify `agent/tools/curateNFTs.ts`          |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Gallery loads with placeholder images
- [ ] NFT cards display price and collection
- [ ] Collection pages show stats and NFTs
- [ ] NFT detail shows metadata correctly
- [ ] Bid panel updates with wallet state
- [ ] Auction countdown ticks correctly
- [ ] Creator profiles show their NFTs
- [ ] Filters update gallery results
- [ ] Mobile grid layout works
- [ ] Image zoom opens on click
