# frontend-plan.md

## 🎮 Project: Hangman Onchain Game (Frontend Plan)

### Framework & Tooling

- **Next.js 14+ (App Router)**
- **TypeScript**
- **TailwindCSS** (for UI styling)
- **Viem (npm)** — for raw onchain interactions
- **Wagmi** — for wallet management
- **OnchainKit** — for onchain-ready UI components and transaction utilities
- **Upstash Redis** — for score tracking and leaderboards

### Bootstrap Command

Project is bootstrapped using:

```bash
npm create onchain
```

This sets up a developer-ready scaffold with `Next.js`, `Wagmi`, `TailwindCSS`, and `OnchainKit` already integrated.

---

## 🎯 Implementation Phases

### Phase 1 - Basic Game Flow

1. Welcome Screen

   - Modify existing `page.tsx`
   - Add game title and start button
   - Keep existing wallet connection

2. Category Selection

   - Create `/category-select` page
   - Display categories from `wordCategories.json`
   - Add category selection UI

3. Game Screen

   - Create `/game/[category]` page
   - Implement basic word display
   - Add letter input system
   - Show game progress

4. Result Screens
   - Create `/fail` and `/win` pages
   - Add retry/next word options

### Phase 2 - Blockchain Integration

1. Game State Management

   - Implement `GameStateProvider`
   - Add game progress tracking
   - Handle word selection logic

2. Onchain Features
   - Add claim reward functionality
   - Implement smart contract interactions
   - Set up transaction handling

### Phase 3 - Additional Features

1. Leaderboard System

   - Set up Redis integration
   - Create leaderboard UI
   - Add score tracking

2. Game Enhancements
   - Implement hints system
   - Add animations
   - Polish UI/UX

---

## 🧱 Pages & Components

### 1. `/home` – Welcome Screen

- Greeting
- `StartGameButton.tsx` to begin the game
- Wallet connection via `WalletConnect.tsx`

---

### 2. `/category-select` – Category Selection

- Load `wordCategories.json` from `data/`
- Display available categories as clickable cards

---

### 3. `/game/[category]` – Game Screen

- Display:

  - Word description
  - Hidden word with correct guesses revealed
  - Onscreen keyboard or letter input
  - Hints (optional)
  - Score tracker

- Game Logic:
  - User gets 3 attempts per word
  - Guess letters or whole word
  - On win → proceed to next word or show claim button
  - On loss → redirect to `/fail`

---

### 4. `/fail` – Try Again Screen

- Message: "You lost! Try again?"
- Buttons:
  - `Play Again`
  - `Back to Home`

---

### 5. `/win` – Claim Reward Screen

- Shows claimable prize for winning round
- `ClaimButton.tsx` to trigger onchain reward (using `viem` + `OnchainKit`)
- `Next Word` button

---

## 🥉 Components

- `GameStateProvider.tsx` – Global state manager for:

  - Selected category
  - Current word
  - Attempt count
  - Score

- `LetterInput.tsx` – Letter/word guess input field

- `WordDisplay.tsx` – Shows masked word progress

- `HintsToggle.tsx` – Reveals hints

- `ScoreBoard.tsx` – Local + Redis leaderboard

- `ClaimButton.tsx` – Makes contract call to `claimReward()` via `viem`

- `WalletConnect.tsx` – Integrates OnchainKit wallet connection

---

## 🔗 Blockchain Integration

- Smart contract functions:

  - `playGame(bool, bool, uint256)` — when game begins
  - `claimReward(bool)` — when user wins and chooses to claim

- Use `viem` hooks and contract interaction patterns

- Reference:

  - [OnchainKit LLM Docs](https://docs.base.org/builderkits/onchainkit/llms.txt)
  - [Viem LLM Docs](https://viem.sh/llms-full.txt)

- Use `TransactionButton` (OnchainKit) for gasless or guided flow if needed

---

## 🛁 Redis Integration (Upstash)

- POST to `/api/leaderboard` on each win: `{ address, score }`
- GET from `/api/leaderboard` on `/home` to render high scores

---

## 📁 File Structure Example

```
/app
  /home
  /category-select
  /game/[category]
  /fail
  /win

/components
  StartGameButton.tsx
  LetterInput.tsx
  WordDisplay.tsx
  HintsToggle.tsx
  ClaimButton.tsx
  ScoreBoard.tsx
  WalletConnect.tsx

/context
  GameStateProvider.tsx

/data
  wordCategories.json

/lib
  redis.ts
  useClaimReward.ts
  usePlayGame.ts

/api
  leaderboard.ts
```

---

## 🧪 Stretch Goals

- Multiplayer support
- Randomness request via VRF or external oracle
- Sound FX, animation
- NFT trophy for high scores

---

## 🚀 Getting Started

1. Start with Phase 1 - Basic Game Flow
2. Modify the existing `page.tsx` to be our welcome screen
3. Create the category selection page
4. Implement the basic game screen

Let me know when you're ready to scaffold the first route or build the `GameStateProvider`.
