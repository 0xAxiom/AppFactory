# How to Build a dApp

This guide walks through building a web application using dapp-factory. Despite the name, this pipeline builds general web apps—blockchain features are optional.

---

## Prerequisites

- Node.js 18+
- Claude Code installed
- AppFactory repository cloned

---

## When to Use dapp-factory

Use dapp-factory for:

- Dynamic web applications
- Apps with user accounts
- Apps with databases
- Apps with APIs
- Apps with blockchain/Web3 features (optional)

Use website-pipeline instead for:

- Static websites
- Portfolios
- Landing pages
- Marketing sites

---

## Step 1: Navigate to the Pipeline

```bash
cd /path/to/AppFactory/dapp-factory
```

---

## Step 2: Start Claude

```bash
claude
```

---

## Step 3: Describe Your Application

### Without Blockchain

```
Build a task management app with user authentication,
project organization, and team collaboration
```

### With Blockchain

```
Build a dApp for NFT marketplace with wallet connection,
minting, and auctions on Base network
```

The system detects whether you want Web3 features based on your description.

---

## Step 4: Answer the Agent Decision Gate

For apps that could include AI, you'll see:

```
[AGENT DECISION GATE]

This app could benefit from AI/agent capabilities.
Would you like to include an AI agent?

Options:
1. No agent (standard web app)
2. Basic agent (chat interface)
3. Advanced agent (autonomous actions)

Choice:
```

Choose based on your needs. Most apps work fine without agents.

---

## Step 5: Review and Approve

```
[PHASE 0: INTENT NORMALIZATION]

Upgrading "task management app" to:
"A collaborative task management platform with:
- User authentication (email/social)
- Project workspaces with team invitations
- Kanban boards and list views
- Task assignments and due dates
- Real-time updates
- Activity feed
- Notification system
- Dark/light mode"

[PHASE 1: PLANNING]

Milestones:
- M1: Scaffold Next.js with auth
- M2: Create dashboard layouts
- M3: Implement project/task features
- M4: Add collaboration features
- M5: Polish UI/UX
- M6: Generate documentation

Proceed? (yes/no)
```

---

## Step 6: Wait for Generation

```
[BUILDING]
M1: Scaffold ✓
M2: Dashboard ✓
M3: Features ✓
M4: Collaboration ✓
M5: Polish ✓
M6: Documentation ✓

[RALPH QA]
Pass 1: 91% (fixing form validation)
Pass 2: 95% (improving accessibility)
Pass 3: 97% - PASS

BUILD COMPLETE
```

---

## Step 7: Find Your Output

```
dapp-factory/dapp-builds/<app-name>/
```

---

## Step 8: Configure Environment

Most dApps need environment variables:

```bash
cd dapp-factory/dapp-builds/<app-name>
cp .env.example .env
```

Edit `.env` with your credentials:

```
DATABASE_URL=...
NEXTAUTH_SECRET=...
# Add other required variables
```

Check `README.md` for required variables.

---

## Step 9: Run the Application

```bash
npm install
npm run dev
```

Open http://localhost:3000.

---

## Project Structure

```
dapp-builds/<app-name>/
├── package.json
├── next.config.js
├── .env.example
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── projects/
│   │   └── api/           ← API routes
│   ├── components/
│   │   ├── ui/            ← Reusable UI
│   │   └── features/      ← Feature components
│   ├── lib/
│   │   ├── db.ts          ← Database client
│   │   ├── auth.ts        ← Auth configuration
│   │   └── utils.ts
│   └── types/
├── prisma/                 ← Database schema (if applicable)
├── public/
├── README.md
├── RUNBOOK.md
└── research/
    ├── market_research.md
    └── competitor_analysis.md
```

---

## Web3 Features (Optional)

If you requested blockchain features, your app includes:

### Wallet Connection

```typescript
// Already configured in generated code
import { useAccount, useConnect } from 'wagmi';

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  // ...
}
```

### Smart Contract Interaction

```typescript
import { useContractRead, useContractWrite } from 'wagmi';

function NFTMint() {
  const { write: mint } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mint',
  });
  // ...
}
```

### Supported Networks

- Ethereum Mainnet
- Base
- Optimism
- Arbitrum
- Polygon
- Testnets (Sepolia, Base Sepolia, etc.)

---

## Database Setup

If your app uses a database:

### Prisma (Default)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Open database GUI
npx prisma studio
```

### Supabase (Alternative)

Check if `SUPABASE_URL` is in `.env.example`. If so, create a Supabase project and add credentials.

---

## Playwright Testing

dapp-factory outputs include E2E tests:

```bash
# Install Playwright browsers
npx playwright install

# Run tests
npm run test:e2e
```

Tests cover:

- Authentication flows
- Core feature functionality
- Accessibility checks

---

## Deployment

### Vercel

```bash
npx vercel
```

Add environment variables in Vercel dashboard.

### Docker

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

---

## Common Issues

### "Database connection failed"

Check `DATABASE_URL` in `.env`:

```
# Local PostgreSQL
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```

### "Authentication not working"

Ensure `NEXTAUTH_SECRET` is set:

```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET
```

### "Web3 wallet not connecting"

Check network configuration in `wagmi.config.ts`.

---

## Next Steps

- [Preview Output](./preview-output.md) - Use the preview system
- [Build a Mini App](./build-miniapp.md) - Build for Base ecosystem
- [Troubleshooting](../TROUBLESHOOTING.md) - Problem solving

---

**Back to**: [Index](../index.md)
