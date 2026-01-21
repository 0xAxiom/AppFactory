# Commit - Stake ETH on Your Goals

A Base Mini App for accountability with skin in the game. Set goals, stake crypto, and let friends verify your progress.

![Commit App](./app/public/hero.png)

## The Problem

New Year's resolutions fail. Side projects stall. Gym memberships go unused. Why? No real consequences.

## The Solution

**Commit** adds financial stakes to your goals:

1. **Set a goal** with a deadline
2. **Stake ETH** (0.001 - 0.1 ETH)
3. **Choose an accountability partner** from your Farcaster network
4. **Complete your goal** → Get your stake back
5. **Fail** → Your partner gets 95% of your stake

## Why This Works

- **Loss aversion** - Humans hate losing money more than they like gaining it
- **Social accountability** - Your friend literally profits from your failure
- **Low friction** - Base's low fees make micro-stakes viable
- **Native social graph** - Easy partner selection from Farcaster

## Revenue Model

- 5% protocol fee on forfeited stakes
- Future: Premium features (private goals, multiple partners, recurring commitments)

---

## How It Was Built

This app was generated using the **miniapp-pipeline** in App Factory. Here's the process:

### Stage M0: Intent Normalization

Transformed the idea "accountability app with staking" into a structured concept with:

- Target users identified
- Core loop defined
- Revenue model documented

See: `artifacts/inputs/normalized_prompt.md`

### Stage M1: Scaffold Planning

Designed the technical architecture:

- Route structure
- Component hierarchy
- Data model
- Color scheme

See: `artifacts/stage01/scaffold_plan.md`

### Stage M2: Project Scaffold

Generated the complete Next.js application:

- MiniKit integration
- Wagmi wallet connection
- React Query for state
- Tailwind CSS styling

See: `artifacts/stage02/scaffold_complete.md`

### Stage M3: Manifest Configuration

Configured the Farcaster manifest with:

- App metadata (name, description, tags)
- Asset URLs
- Webhook endpoint

See: `artifacts/stage03/manifest_config.md`

### Stage M4: Deployment Plan

Created Vercel deployment guide with:

- Environment variable setup
- Deployment Protection disabling (critical!)
- Verification steps

See: `artifacts/stage04/DEPLOYMENT.md`

### Stage M5: Account Association (Manual)

Instructions for proving domain ownership:

- Sign with Farcaster wallet
- Update minikit.config.ts
- Redeploy

See: `artifacts/stage05/ACCOUNT_ASSOCIATION_TODO.md`

### Stage M7: Production Hardening

Applied hardening:

- Error handling
- Browser fallback
- Mobile optimization
- Security considerations

See: `artifacts/stage07/hardening_report.md`

### Stage M8: Proof Gate

Validation checklist:

- Build passes
- Manifest valid
- SDK ready hook present

See: `artifacts/stage08/build_validation_summary.json`

---

## Project Structure

```
commit-app/
├── app/                          # The Next.js application
│   ├── app/
│   │   ├── .well-known/farcaster.json/
│   │   │   └── route.ts          # Manifest endpoint
│   │   ├── api/webhook/
│   │   │   └── route.ts          # Notification handler
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Main app (all UI)
│   │   ├── providers.tsx         # MiniKit/Wagmi/Query providers
│   │   └── globals.css           # Tailwind + custom styles
│   ├── minikit.config.ts         # Manifest configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── ...config files
│
├── artifacts/                    # Pipeline outputs
│   ├── inputs/
│   │   └── normalized_prompt.md
│   ├── stage01/
│   │   └── scaffold_plan.md
│   └── ...other stages
│
└── README.md                     # This file
```

---

## Running Locally

```bash
# Navigate to the app
cd app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your CDP API key

# Run development server
npm run dev

# Open http://localhost:3000
```

## Testing in Base App

1. Use [ngrok](https://ngrok.com/) to tunnel localhost
2. Open the Base app
3. Navigate to the ngrok URL
4. Test the mini app flow

---

## Key Implementation Details

### MiniKit Integration

```typescript
// providers.tsx - Provider hierarchy
<WagmiProvider config={wagmiConfig}>
  <QueryClientProvider client={queryClient}>
    <MiniKitProvider ...>
      {children}
    </MiniKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

### Manifest Route

```typescript
// Uses OnchainKit's validation
import { withValidManifest } from '@coinbase/onchainkit/minikit';
export async function GET() {
  return Response.json(withValidManifest(minikitConfig));
}
```

### User Context

```typescript
// Access Farcaster user info
const { context } = useMiniKit();
const userFid = context?.user?.fid;
const username = context?.user?.username;
```

### Browser Detection

```typescript
// Handle non-Mini App context
const { isInMiniApp } = useIsInMiniApp();
if (!isInMiniApp) {
  // Show fallback UI
}
```

---

## Production Upgrade Path

This demo uses localStorage. For production:

1. **Database**: Add Supabase/Planetscale for commitment storage
2. **Smart Contract**: Deploy escrow contract for trustless stakes
3. **User Search**: Implement Farcaster user lookup API
4. **Notifications**: Wire up webhook to send push notifications
5. **Analytics**: Add event tracking

---

## Why Base Mini Apps?

- **Distribution**: Built-in discovery in Base app
- **Social**: Native Farcaster integration
- **Low fees**: Makes micro-transactions viable
- **Trust**: Users already have wallets connected

---

## License

MIT

---

_Built with [miniapp-pipeline](../README.md) - Part of App Factory_
