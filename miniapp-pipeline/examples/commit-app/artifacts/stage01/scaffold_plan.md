# Scaffold Plan

## Template

MiniKit Next.js Starter (based on upstream new-mini-app-quickstart)

## Routes

- `/` - Main app: view active commitments, create new
- `/commitment/[id]` - View single commitment details
- `/api/webhook` - Farcaster notification webhook
- `/api/commitment` - CRUD for commitments
- `/api/verify` - Partner verification endpoint
- `/.well-known/farcaster.json` - Manifest endpoint

## Components

### Core Components

- `CommitmentCard.tsx` - Display a single commitment
- `CreateCommitmentForm.tsx` - Form to create new commitment
- `PartnerSelector.tsx` - Search/select accountability partner by FID
- `StakeInput.tsx` - ETH amount input with presets
- `VerificationPanel.tsx` - Partner verification UI
- `CountdownTimer.tsx` - Time remaining display

### Layout Components

- `Header.tsx` - App header with user info
- `TabNav.tsx` - Switch between My Commitments / Partner Requests

### State/Hooks

- `useCommitments.ts` - Fetch user's commitments
- `usePartnerRequests.ts` - Fetch commitments needing verification
- `useCreateCommitment.ts` - Mutation for creating commitment

## Data Layer

### State Management

- React Query for server state
- Local state for forms
- Wagmi for wallet connection

### Data Model (localStorage for demo, DB for production)

```typescript
interface Commitment {
  id: string;
  creatorFid: number;
  creatorAddress: string;
  partnerFid: number;
  goal: string;
  stakeAmount: string; // In wei
  deadline: number; // Unix timestamp
  status: 'active' | 'completed' | 'failed' | 'expired';
  createdAt: number;
  verifiedAt?: number;
  verifiedBy?: number;
}
```

## Assets Required

- Icon: 1024x1024 PNG (target/checkmark theme)
- Splash: 200x200 PNG
- Hero: 1200x630 PNG
- Screenshots: 1284x2778 PNG (3 screens)
- OG Image: 1200x630 PNG

## Dependencies

```json
{
  "@coinbase/onchainkit": "^1.0.3",
  "@farcaster/miniapp-sdk": "^0.1.9",
  "@tanstack/react-query": "^5.85.9",
  "next": "15.3.6",
  "react": "^19.0.0",
  "viem": "^2.31.6",
  "wagmi": "^2.16.9",
  "date-fns": "^3.6.0"
}
```

## Color Scheme

- Primary: #10B981 (Emerald - success/achievement)
- Secondary: #F59E0B (Amber - stakes/warning)
- Background: #0A0A0A (Dark)
- Text: #FAFAFA (Light)

## User Flows

### Create Commitment

1. Tap "New Commitment"
2. Enter goal description
3. Select stake amount (presets: 0.001, 0.005, 0.01, 0.05 ETH)
4. Search and select partner by username
5. Set deadline (presets: 1 day, 3 days, 1 week, 1 month)
6. Review and confirm
7. Sign transaction to stake ETH
8. Share to Farcaster

### Verify as Partner

1. Receive notification of partner request
2. Open commitment details
3. When deadline passes, verify:
   - "They did it!" → Return stake to creator
   - "They failed" → Receive 95% of stake

### Complete Own Goal

1. View active commitment
2. Wait for partner verification after deadline
3. Receive stake back (if verified complete)
