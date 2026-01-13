# RoastPush Data Flow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Next.js)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   UI Layer   │  │ State (Zustand)│ │Wallet Adapter│  │   Socket.io │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (Next.js Route Handlers)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  REST APIs   │  │  Auth (SIWS) │  │  WebSocket   │  │  AI Service │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  PostgreSQL  │  │    Redis     │  │Cloudflare R2 │  │   Solana    │ │
│  │  (Profiles,  │  │ (Matchmaking,│  │   (Clips,    │  │ (Tokens,    │ │
│  │   Battles)   │  │    Cache)    │  │   Media)     │  │  Balances)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Battle Flow

### 1. Matchmaking

```
User A                    Server                    User B
   │                         │                         │
   │──── Join Queue ────────►│                         │
   │     (wallet, tier)      │                         │
   │                         │◄──── Join Queue ────────│
   │                         │     (wallet, tier)      │
   │                         │                         │
   │                    [Match Users]                  │
   │                         │                         │
   │◄─── Match Found ────────│─────Match Found ───────►│
   │     (opponent, room)    │     (opponent, room)    │
   │                         │                         │
   │══════ WebSocket Room Connected ══════════════════│
```

### 2. Entry Fee Processing

```
User                     Client                   Server                   Solana
  │                         │                         │                       │
  │── Confirm Entry ───────►│                         │                       │
  │                         │                         │                       │
  │                         │── Build Transaction ───►│                       │
  │                         │◄── Transaction ─────────│                       │
  │                         │                         │                       │
  │◄── Sign Request ────────│                         │                       │
  │                         │                         │                       │
  │── Sign in Wallet ──────►│                         │                       │
  │                         │                         │                       │
  │                         │────── Send TX ─────────►│──── Submit TX ───────►│
  │                         │                         │                       │
  │                         │                         │◄── Confirmation ──────│
  │                         │◄── Entry Confirmed ─────│                       │
  │◄── Start Matchmaking ───│                         │                       │
```

### 3. Battle Execution

```
Timeline: [Round 1] ──────────► [Round 2] ──────────► [Round 3]

┌─────────────────────────────────────────────────────────────┐
│                        ROUND CYCLE                          │
│                                                             │
│  [Prompt Generated] ─► [Countdown] ─► [Recording] ─► [AI]  │
│                                                             │
│       ▼                   ▼              ▼           ▼     │
│   OpenAI API          3-2-1 Timer    Voice Capture   Score │
│   generates           broadcast      uploaded to     + AI   │
│   roast prompt        to room        server          Judge  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Real-time Events

```
WebSocket Events:

battle:round_start
├── prompt: string
├── roundNumber: number
└── timeLimit: number

battle:roast_submitted
├── playerId: string
├── audioUrl: string
└── timestamp: number

reaction:sent
├── emoji: string
├── senderId: string
└── count: number

battle:score_revealed
├── playerId: string
├── score: number
├── breakdown: { savagery, creativity, delivery, relevance }
└── commentary: string

battle:ended
├── winnerId: string
├── finalScores: { player1: number, player2: number }
└── prizeAmount: number
```

## Token Flow

### Entry Fee to Prize Distribution

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           TOKEN FLOW                                     │
│                                                                          │
│  Player A          Escrow Account         Player B         Protocol     │
│     │                    │                    │                │        │
│     │──── 100 ROAST ────►│◄─── 100 ROAST ─────│                │        │
│     │   (entry fee)      │    (entry fee)     │                │        │
│     │                    │                    │                │        │
│     │              [Battle Executes]          │                │        │
│     │              [Player A Wins]            │                │        │
│     │                    │                    │                │        │
│     │◄─── 190 ROAST ─────│                    │                │        │
│     │   (prize pool)     │                    │                │        │
│     │                    │───── 10 ROAST ────────────────────►│        │
│     │                    │    (5% platform fee)               │        │
│     │                    │                    │                │        │
│     │                    │                    │    ┌──────────┴──────┐ │
│     │                    │                    │    │ 75% → Creator   │ │
│     │                    │                    │    │ 25% → Partner   │ │
│     │                    │                    │    └─────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### Tipping Flow

```
Viewer                    Server                    Performer            Protocol
   │                         │                          │                    │
   │── Tip 10 ROAST ────────►│                          │                    │
   │                         │                          │                    │
   │                   [Build Transfer TX]              │                    │
   │                         │                          │                    │
   │◄── Sign Request ────────│                          │                    │
   │                         │                          │                    │
   │── Signed TX ───────────►│                          │                    │
   │                         │                          │                    │
   │                   [Execute on Solana]              │                    │
   │                         │                          │                    │
   │                         │─── 9.8 ROAST ───────────►│                    │
   │                         │                          │                    │
   │                         │───────── 0.2 ROAST (2% fee) ─────────────────►│
   │                         │                          │                    │
   │◄── Tip Confirmed ───────│── Notification ─────────►│                    │
```

## Data Storage

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  wallet_address VARCHAR(44) UNIQUE NOT NULL,
  username VARCHAR(32) UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Battles table
CREATE TABLE battles (
  id UUID PRIMARY KEY,
  player1_id UUID REFERENCES users(id),
  player2_id UUID REFERENCES users(id),
  winner_id UUID REFERENCES users(id),
  tier VARCHAR(20) NOT NULL,
  entry_fee BIGINT NOT NULL,
  prize_pool BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  tx_signature VARCHAR(88),
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- Rounds table
CREATE TABLE rounds (
  id UUID PRIMARY KEY,
  battle_id UUID REFERENCES battles(id),
  round_number INT NOT NULL,
  prompt TEXT NOT NULL,
  player1_audio_url TEXT,
  player2_audio_url TEXT,
  player1_score INT,
  player2_score INT,
  player1_commentary TEXT,
  player2_commentary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clips table
CREATE TABLE clips (
  id UUID PRIMARY KEY,
  battle_id UUID REFERENCES battles(id),
  creator_id UUID REFERENCES users(id),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  view_count INT DEFAULT 0,
  reaction_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard materialized view
CREATE MATERIALIZED VIEW leaderboard AS
SELECT
  u.id,
  u.username,
  u.avatar_url,
  COUNT(CASE WHEN b.winner_id = u.id THEN 1 END) as wins,
  COUNT(b.id) as total_battles,
  SUM(CASE WHEN b.winner_id = u.id THEN b.prize_pool ELSE 0 END) as total_earnings
FROM users u
LEFT JOIN battles b ON u.id IN (b.player1_id, b.player2_id)
WHERE b.status = 'completed'
GROUP BY u.id;
```

### Redis Data Structures

```
# Matchmaking queue (sorted set by join time)
matchmaking:bronze   → { wallet1: timestamp, wallet2: timestamp }
matchmaking:silver   → { wallet1: timestamp, wallet2: timestamp }
matchmaking:gold     → { wallet1: timestamp, wallet2: timestamp }
matchmaking:diamond  → { wallet1: timestamp, wallet2: timestamp }

# Active battles (hash)
battle:{id}          → { player1, player2, status, currentRound }

# User sessions (string with TTL)
session:{wallet}     → { jwt, lastSeen }

# Rate limiting (string with TTL)
ratelimit:{wallet}:{action} → count
```

### Cloudflare R2 Structure

```
roastpush-media/
├── audio/
│   └── {battle_id}/
│       ├── round1_player1.webm
│       ├── round1_player2.webm
│       └── ...
├── clips/
│   └── {clip_id}/
│       ├── video.mp4
│       └── thumbnail.jpg
└── avatars/
    └── {user_id}.jpg
```

## AI Integration

### Prompt Generation

```
Request to OpenAI:
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Generate a roast battle prompt. Keep it edgy but not offensive..."
    }
  ],
  "temperature": 0.9
}

Response:
{
  "prompt": "Roast your opponent's fashion sense like you mean it"
}
```

### Roast Scoring

```
Request to OpenAI:
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Score this roast on savagery, creativity, delivery, relevance..."
    },
    {
      "role": "user",
      "content": "[transcribed roast text]"
    }
  ]
}

Response:
{
  "scores": {
    "savagery": 8,
    "creativity": 7,
    "delivery": 9,
    "relevance": 8
  },
  "total": 32,
  "commentary": "That burn was so hot, fire departments in three states are on alert!"
}
```

## Error Recovery

### Battle Interruption

```
If player disconnects mid-battle:
1. Wait 30 seconds for reconnection
2. If no reconnection, declare opponent winner
3. Return opponent's entry fee + bonus
4. Record battle as forfeit
```

### Transaction Failure

```
If entry fee transaction fails:
1. Check if TX was actually sent
2. If sent, wait for confirmation
3. If not confirmed after 60s, allow retry
4. If confirmed but UI failed, sync state from chain
```
