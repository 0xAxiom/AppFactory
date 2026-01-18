# Dream Spec: Aero Map

## 1. Product Vision

Aero Map is a meditative browser-based flying game that transforms the nostalgic experience of gazing at museum dioramas into an interactive journey. Players pilot a delicate paper biplane over a photorealistic topographical relief map, rendered in the distinctive aesthetic of layered cardstock with hand-drawn contour lines. The game prioritizes visual beauty, smooth flight feel, and peaceful exploration over challenge or competition, creating a unique "digital toy" experience enhanced by optional Web3 collectibles.

## 2. Core Features

### Flight Experience
- **Paper Biplane Control**: Responsive yet floaty physics mimicking lightweight paper construction
- **Banking & Turning**: Realistic roll animation when steering left/right
- **Altitude Control**: Gentle climb/dive with momentum preservation
- **Thermal Detection**: Visual wind indicators showing lift zones
- **Camera System**: Third-person follow camera with subtle depth-of-field

### Terrain System
- **Stepped Elevation**: 8-12 visible elevation layers cut from "cardstock"
- **Contour Lines**: Procedural ink lines at regular height intervals
- **Paper Textures**: Matte finish with subtle fiber and fold details
- **Miniature Details**: Paper trees, tiny buildings, origami landmarks
- **Terrain Themes**: Grassland (default), Desert Mesa, Ocean Archipelago, Mountain Peaks

### Collectibles
- **Origami Stars**: Floating paper stars scattered across the map
- **Paper Clips**: Rarer collectibles in harder-to-reach locations
- **Landmark Stamps**: Achievement markers for discovering key locations
- **Flight Trails**: Visual ribbon showing flight path

### Web3 Integration
- **Wallet Connection**: Phantom/Solflare for Solana access
- **Terrain Pack NFTs**: Token-gated premium terrain themes
- **Achievement NFTs**: Mintable badges for exploration milestones
- **Tip Jar**: SOL donations to support development

## 3. User Flows

### First-Time User
1. Land on splash page with animated diorama preview
2. Click "Take Flight" to enter game
3. Brief control tutorial overlay (WASD/mouse/touch)
4. Begin flying over default grassland terrain
5. Discover first origami star, triggering collection animation
6. Explore freely with optional objectives

### Returning User
1. Load game, instantly resume from last position
2. View collection progress in HUD
3. Continue exploration or switch terrain theme
4. Connect wallet to access premium features

### Web3 User
1. Connect Phantom wallet from header
2. View owned terrain packs in gallery
3. Select premium terrain theme to load
4. Collect achievements, mint as NFTs
5. Send tip via integrated tip jar

## 4. Design System

### Colors
```typescript
const colors = {
  // Paper & Cardstock
  paperWhite: '#F5F2EB',
  paperCream: '#EDE8DC',
  cardstockBeige: '#D4C9B5',

  // Ink & Lines
  inkBlack: '#2C2C2C',
  inkBrown: '#5C4A3D',
  contourBlue: '#4A6B8A',

  // Accents
  thermalGold: '#D4A84B',
  collectibleRed: '#C75B5B',

  // UI
  woodDark: '#3D2E1F',
  woodLight: '#8B7355',
  glassOverlay: 'rgba(245, 242, 235, 0.9)',

  // States
  success: '#5B8C5A',
  warning: '#D4A84B',
  error: '#C75B5B',
};
```

### Typography
```typescript
const typography = {
  heading: '"Playfair Display", Georgia, serif',
  body: '"Inter", -apple-system, sans-serif',
  mono: '"JetBrains Mono", monospace', // Addresses/hashes only
};
```

### Spacing
```typescript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};
```

## 5. Component Architecture

### Game Components
- `GameCanvas` - Main Three.js canvas wrapper
- `TerrainMesh` - Stepped elevation geometry with paper materials
- `ContourLines` - Procedural line generation at elevation intervals
- `PaperBiplane` - Player aircraft model with animation
- `FlightController` - Input handling and physics
- `CollectibleSystem` - Token spawning and collection
- `CameraRig` - Third-person follow with DOF

### UI Components
- `SplashScreen` - Entry page with preview animation
- `GameHUD` - In-flight overlay (altitude, speed, collectibles)
- `PauseMenu` - Settings and terrain selection
- `WalletButton` - Connection state indicator
- `CollectionGallery` - View owned items and achievements
- `TipJarModal` - SOL donation interface
- `LoadingScreen` - 3D asset loading with skeleton preview

### Utility Components
- `SkeletonLoader` - Animated placeholders
- `ErrorBoundary` - Graceful failure handling
- `WebGLFallback` - Non-WebGL browser message

## 6. State Management

### Zustand Stores

```typescript
// gameStore.ts
interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTerrain: TerrainTheme;
  planePosition: Vector3;
  planeRotation: Euler;
  velocity: Vector3;
  collectibles: CollectibleState[];
  discoveredLandmarks: string[];
  flightTime: number;
}

// collectionStore.ts
interface CollectionState {
  stars: number;
  paperClips: number;
  landmarks: string[];
  achievements: Achievement[];
}

// walletStore.ts
interface WalletState {
  connected: boolean;
  address: string | null;
  ownedTerrains: string[];
  mintedAchievements: string[];
}
```

## 7. API/Data Layer

### Client-Side Only
- No backend required for core gameplay
- All state persisted to localStorage
- Terrain data generated procedurally client-side

### Solana Integration
- Read token balances for terrain pack ownership
- Sign transactions for achievement minting
- Send SOL for tip jar

### External APIs
- None required for MVP
- Future: Helius RPC for faster Solana queries

## 8. Token Integration

**Status:** Enabled

### Features Unlocked
- **Terrain Packs**: Premium themes (Desert, Ocean, Mountain) require holding specific tokens
- **Achievement NFTs**: Exploration milestones mintable as compressed NFTs
- **Tip Jar**: Direct SOL transfers to creator wallet
- **Future**: Leaderboard rankings weighted by held tokens

### Implementation
- `@solana/web3.js` v2.x for modern API
- `@solana/wallet-adapter-react` for wallet connection
- Token metadata read from on-chain accounts
- Achievement minting via Metaplex Bubblegum (compressed NFTs)

## 9. Deployment Strategy

### Vercel Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["iad1", "sfo1"],
  "env": {
    "NEXT_PUBLIC_SOLANA_RPC": "@solana-rpc-url",
    "NEXT_PUBLIC_CREATOR_WALLET": "@creator-wallet"
  }
}
```

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- 3D Scene Load: < 5s with progress indicator
- Sustained 60fps on mid-range hardware

## 10. Success Criteria

### Launch Ready When
- [ ] Biplane flies smoothly with responsive controls
- [ ] Terrain renders with visible paper layers and contour lines
- [ ] Collectibles spawn and register on contact
- [ ] Wallet connects and displays address
- [ ] Premium terrains locked behind token ownership
- [ ] Achievement system tracks exploration progress
- [ ] UI animations smooth (Framer Motion)
- [ ] Loading states show skeleton terrain preview
- [ ] Error states provide helpful retry options
- [ ] Mobile touch controls functional
- [ ] `npm run build` passes without errors
- [ ] Vercel deployment succeeds

### Stretch Goals
- Procedural terrain generation from seed
- Multiplayer paper plane trails
- Custom biplane skins
- Sound design (paper rustling, wind)
