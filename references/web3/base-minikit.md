# Base MiniKit Reference

## Overview

MiniKit (part of OnchainKit) enables building "mini apps" for Farcaster - lightweight applications that run within Farcaster clients like Warpcast.

## Installation

```bash
npm install @coinbase/onchainkit viem @upstash/redis
```

## Quick Start

### Configuration

```typescript
// minikit.config.ts
import { MiniKitConfig } from "@coinbase/onchainkit/minikit";

export const config: MiniKitConfig = {
  name: "My Mini App",
  description: "A mini app for Farcaster",
  icon: "/icon.png",
  splashImage: "/splash.png",
  splashBackgroundColor: "#1E40AF",
};
```

### App Setup

```typescript
// app/layout.tsx
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { config } from "./minikit.config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <MiniKitProvider config={config}>{children}</MiniKitProvider>
      </body>
    </html>
  );
}
```

## Core Features

### User Context

```typescript
"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";

function UserInfo() {
  const { user, isLoading } = useMiniKit();

  if (isLoading) return <Loading />;
  if (!user) return <NotInMiniApp />;

  return (
    <div>
      <img src={user.pfpUrl} alt={user.username} />
      <p>@{user.username}</p>
      <p>FID: {user.fid}</p>
    </div>
  );
}
```

### Actions

```typescript
import { useMiniKitActions } from "@coinbase/onchainkit/minikit";

function Actions() {
  const { openUrl, shareText, close } = useMiniKitActions();

  return (
    <div>
      <button onClick={() => openUrl("https://example.com")}>Open Link</button>
      <button onClick={() => shareText("Check out this mini app!")}>
        Share
      </button>
      <button onClick={close}>Close App</button>
    </div>
  );
}
```

### Transactions

```typescript
import { useMiniKitTransaction } from "@coinbase/onchainkit/minikit";

function SendTransaction() {
  const { sendTransaction, status, error } = useMiniKitTransaction();

  const handleSend = async () => {
    await sendTransaction({
      to: "0x...",
      value: parseEther("0.01"),
      chainId: 8453, // Base
    });
  };

  return (
    <div>
      <button onClick={handleSend} disabled={status === "pending"}>
        {status === "pending" ? "Sending..." : "Send 0.01 ETH"}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
```

## Manifest

Create the Farcaster manifest:

```typescript
// app/.well-known/farcaster.json/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "...", // From Warpcast developer portal
      payload: "...",
      signature: "...",
    },
    frame: {
      version: "1",
      name: "My Mini App",
      iconUrl: "https://myapp.com/icon.png",
      splashImageUrl: "https://myapp.com/splash.png",
      splashBackgroundColor: "#1E40AF",
      homeUrl: "https://myapp.com",
    },
  });
}
```

## State Management

### With Upstash Redis

```typescript
// lib/redis.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Store user data
export async function saveUserScore(fid: number, score: number) {
  await redis.set(`user:${fid}:score`, score);
}

// Get leaderboard
export async function getLeaderboard(limit = 10) {
  return redis.zrange("leaderboard", 0, limit - 1, {
    rev: true,
    withScores: true,
  });
}
```

### Server Actions

```typescript
// app/actions.ts
"use server";

import { redis } from "@/lib/redis";

export async function submitScore(fid: number, score: number) {
  // Update user's score
  await redis.set(`user:${fid}:score`, score);

  // Update leaderboard
  await redis.zadd("leaderboard", { score, member: fid.toString() });

  return { success: true };
}
```

## Common Patterns

### Leaderboard

```typescript
"use client";

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

interface LeaderboardEntry {
  fid: number;
  score: number;
  username: string;
}

function Leaderboard() {
  const { user } = useMiniKit();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div
          key={entry.fid}
          className={`flex justify-between p-2 rounded ${
            entry.fid === user?.fid ? "bg-blue-100" : ""
          }`}
        >
          <span>
            #{i + 1} @{entry.username}
          </span>
          <span>{entry.score}</span>
        </div>
      ))}
    </div>
  );
}
```

### Daily Rewards

```typescript
// app/api/claim/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { fid } = await req.json();

  // Check last claim time
  const lastClaim = await redis.get(`user:${fid}:lastClaim`);
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (lastClaim && now - Number(lastClaim) < oneDayMs) {
    return NextResponse.json(
      { error: "Already claimed today" },
      { status: 400 }
    );
  }

  // Award points
  await redis.incrby(`user:${fid}:points`, 100);
  await redis.set(`user:${fid}:lastClaim`, now);

  return NextResponse.json({ success: true, points: 100 });
}
```

### Social Features

```typescript
import { useMiniKitActions } from "@coinbase/onchainkit/minikit";

function ShareResult({ score }: { score: number }) {
  const { shareText, composeCast } = useMiniKitActions();

  const handleShare = () => {
    composeCast({
      text: `I scored ${score} points in My Mini App! 🎮`,
      embeds: ["https://myapp.com"],
    });
  };

  return <button onClick={handleShare}>Share Score</button>;
}
```

## Deployment

### Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

```env
# .env.local
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_APP_URL=https://myapp.vercel.app
```

### Account Association

1. Go to Warpcast Developer Portal
2. Register your app domain
3. Get association credentials
4. Add to farcaster.json manifest

## Testing

### Local Development

```bash
npm run dev
# Access at http://localhost:3000
```

Use the Warpcast mobile app or Mini Apps Playground to test.

### Verifying Manifest

```bash
curl https://myapp.com/.well-known/farcaster.json
```

## Best Practices

1. **Fast loading** - Mini apps should load instantly
2. **Mobile-first** - Design for mobile viewport
3. **Clear CTAs** - Make actions obvious
4. **Handle offline** - Show appropriate states
5. **Respect context** - Use the Farcaster context appropriately

## Resources

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/)
- [OnchainKit](https://onchainkit.xyz/)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Base Documentation](https://docs.base.org/)
