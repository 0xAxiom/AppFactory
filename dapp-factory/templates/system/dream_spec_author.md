# Dream Spec Author - Web3 Factory

**Purpose:** Guide Claude to write comprehensive specifications before building.

---

## When to Use

After Intent Normalization, Claude writes a Dream Spec that captures:
- Complete product vision
- All features and flows
- Technical architecture
- Design system details
- Success criteria

---

## Required Sections

### 1. Product Vision

Write one paragraph that captures:
- What the app does
- Who it's for
- Why it matters
- Core value proposition

**Example:**
> "Meme Battle Arena is a real-time competition platform where users submit memes, vote on head-to-head matchups, and climb a global leaderboard. It transforms passive meme consumption into active community engagement, giving creators a stage and voters a voice."

### 2. Core Features

Bulleted list of must-have functionality. Be specific.

**Format:**
```markdown
- **Feature Name**: What it does, why it matters
- **Feature Name**: What it does, why it matters
```

**Example:**
```markdown
- **Meme Submission**: Users upload images with captions, stored client-side
- **Battle Matchups**: Two memes face off, users pick a winner
- **Global Leaderboard**: Ranked by win rate, updates in real-time
- **Battle History**: View past matchups and outcomes
```

### 3. User Flows

Describe 2-4 primary user journeys.

**Format:**
```markdown
#### Flow Name
1. User does X
2. System shows Y
3. User interacts with Z
4. Outcome: Result
```

**Example:**
```markdown
#### Submit a Meme
1. User clicks "Submit Meme" button
2. Modal opens with upload dropzone
3. User drags image, adds caption
4. Preview shows how it will appear
5. User clicks "Enter Battle"
6. Meme enters queue, confirmation toast appears

#### Vote on a Battle
1. User sees two memes side by side
2. Hover reveals vote buttons with animation
3. User clicks preferred meme
4. Vote animates, winner highlights
5. Next matchup loads with transition
```

### 4. Design System

Define the visual language.

**Required Elements:**
- Color palette (primary, secondary, background, text, accent)
- Typography (headings, body, monospace for addresses)
- Spacing scale
- Border radius
- Shadow levels

**Example:**
```markdown
#### Colors
- **Primary**: Electric purple (#8B5CF6)
- **Secondary**: Cyan accent (#06B6D4)
- **Background**: Near-black (#0A0A0B)
- **Surface**: Dark gray (#1A1A1B)
- **Text**: White (#FAFAFA)
- **Muted**: Gray (#71717A)
- **Destructive**: Red (#EF4444)
- **Success**: Green (#22C55E)

#### Typography
- **Headings**: Inter, 600 weight
- **Body**: Inter, 400 weight
- **Monospace**: JetBrains Mono (addresses only)

#### Spacing
- Base: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

#### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- Full: 9999px
```

### 5. Component Architecture

List key components and their responsibilities.

**Format:**
```markdown
| Component | Responsibility | Key Props |
|-----------|---------------|-----------|
| Name | What it does | props |
```

**Example:**
```markdown
| Component | Responsibility | Key Props |
|-----------|---------------|-----------|
| MemeCard | Display single meme with metadata | meme, onVote, isWinner |
| BattleArena | Side-by-side meme comparison | leftMeme, rightMeme, onVote |
| Leaderboard | Ranked list with animations | entries, limit |
| SubmitModal | Meme upload form | onSubmit, onClose |
| VoteButton | Animated vote action | onClick, disabled, variant |
```

### 6. State Management

Define what state exists and where.

**Categories:**
- **UI State**: Modals, loading, selections (Zustand or React state)
- **Data State**: Memes, votes, user (Zustand or server)
- **Form State**: Inputs, validation (React state or React Hook Form)

**Example:**
```markdown
#### Zustand Store: useBattleStore
- `memes`: Meme[] - all submitted memes
- `currentBattle`: { left: Meme, right: Meme } | null
- `votes`: Map<memeId, voteCount>
- `leaderboard`: LeaderboardEntry[]
- `isLoading`: boolean

#### Actions
- `submitMeme(meme)`: Add meme to pool
- `vote(memeId)`: Record vote, update standings
- `nextBattle()`: Generate new matchup
- `fetchLeaderboard()`: Refresh rankings
```

### 7. API/Data Layer

Define data sources and API routes.

**Options:**
- Client-only (localStorage, in-memory)
- API Routes (Next.js /api/*)
- External APIs (list with purpose)
- Blockchain (if token-enabled)

**Example:**
```markdown
#### Data Storage
- **Memes**: localStorage (client-only MVP)
- **Votes**: In-memory (resets on refresh)
- **Leaderboard**: Computed from votes

#### Future: API Routes
- `POST /api/memes` - Submit meme
- `GET /api/battles/current` - Get current matchup
- `POST /api/votes` - Record vote
- `GET /api/leaderboard` - Get rankings
```

### 8. Token Integration

Yes or No, and what it enables.

**If No:**
```markdown
#### Token Integration: No
Standard web app without blockchain features.
```

**If Yes:**
```markdown
#### Token Integration: Yes

**Wallet Features:**
- Connect/disconnect Phantom, Solflare, etc.
- Display truncated address when connected
- Auto-detect Wallet Standard wallets

**Token Features:**
- Token-gated premium battles
- Tip creators with SOL
- Token balance display

**SDK Version:** @solana/web3.js v2.x (modern stack)
```

### 9. Deployment Strategy

How the app will be deployed.

**Default:**
```markdown
#### Deployment: Vercel

**Configuration:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Node Version: 18.x

**Environment Variables:**
- `NEXT_PUBLIC_APP_URL`: Production URL
- `NEXT_PUBLIC_SOLANA_NETWORK`: devnet | mainnet-beta (if token-enabled)

**vercel.json:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```
```

### 10. Success Criteria

Define what "done" looks like.

**Format:**
- Functional criteria (what works)
- Quality criteria (how well it works)
- Technical criteria (build/run requirements)

**Example:**
```markdown
#### Functional
- [ ] Users can submit memes with images and captions
- [ ] Battles display two memes for voting
- [ ] Votes update leaderboard in real-time
- [ ] Leaderboard shows top 10 with win rates

#### Quality
- [ ] Page load has entrance animation
- [ ] All buttons have hover/tap states
- [ ] Loading states use skeleton components
- [ ] Empty states are designed, not blank
- [ ] Mobile responsive layout

#### Technical
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts on localhost:3000
- [ ] No TypeScript errors
```

---

## Output Location

```
runs/YYYY-MM-DD/build-<timestamp>/
└── inputs/
    └── dream_spec.md
```

---

## Quality Bar

A good Dream Spec:
- Is specific enough to build from
- Includes concrete examples
- Defines clear boundaries
- Anticipates edge cases
- Matches the normalized intent

A bad Dream Spec:
- Uses vague language ("nice UI", "good UX")
- Leaves features undefined
- Skips technical details
- Doesn't match the intent

---

## Template

```markdown
# Dream Spec: {{APP_NAME}}

## 1. Product Vision

[One paragraph describing the app]

## 2. Core Features

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

## 3. User Flows

#### Flow 1: [Name]
1. Step
2. Step
3. Outcome

#### Flow 2: [Name]
1. Step
2. Step
3. Outcome

## 4. Design System

#### Colors
- Primary: #
- Secondary: #
- Background: #
- Text: #
- Muted: #

#### Typography
- Headings: Font, weight
- Body: Font, weight
- Monospace: Font (for addresses)

#### Spacing
- Base: Xpx
- Scale: [values]

## 5. Component Architecture

| Component | Responsibility | Key Props |
|-----------|---------------|-----------|
| | | |

## 6. State Management

#### Store: [name]
- state1: type
- state2: type

#### Actions
- action1(params): effect
- action2(params): effect

## 7. API/Data Layer

[Storage strategy and API routes]

## 8. Token Integration

[Yes/No and details]

## 9. Deployment Strategy

[Vercel config and env vars]

## 10. Success Criteria

#### Functional
- [ ] Criterion 1
- [ ] Criterion 2

#### Quality
- [ ] Criterion 1
- [ ] Criterion 2

#### Technical
- [ ] npm install works
- [ ] npm run build works
- [ ] npm run dev works
```

---

**Use this guide to write comprehensive specs before any code is written.**
