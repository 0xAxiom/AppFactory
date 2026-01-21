# App Factory Examples

**Real-world examples for every pipeline.**

---

## Table of Contents

1. [Mobile App Examples](#mobile-app-examples)
2. [dApp Examples](#dapp-examples)
3. [AI Agent Examples](#ai-agent-examples)
4. [Plugin Examples](#plugin-examples)
5. [Mini App Examples](#mini-app-examples)
6. [Website Examples](#website-examples)

---

## Mobile App Examples

### Example 1: Habit Tracker

**Input:**

```
I want to make an app that helps people track daily habits with streaks
```

**What Claude Builds:**

- Expo React Native app
- Habit list with add/edit/delete
- Daily check-in with streak counter
- Calendar view of history
- Statistics and insights
- RevenueCat subscription for unlimited habits
- Push notifications for reminders

**Run the App:**

```bash
cd app-factory/builds/habit-tracker
npm install
npx expo start
```

---

### Example 2: Meditation Timer

**Input:**

```
build a meditation app with breathing exercises and ambient sounds
```

**What Claude Builds:**

- Guided meditation sessions
- Breathing exercise timer (4-7-8, box breathing)
- Ambient sound mixer (rain, ocean, forest)
- Session history and streaks
- Dark mode optimized for relaxation
- Premium tier with unlimited sessions

**Key Features Generated:**

- `src/components/BreathingCircle.tsx` - Animated breathing guide
- `src/components/SoundMixer.tsx` - Multi-track audio mixing
- `src/screens/SessionPlayer.tsx` - Full meditation experience
- `services/purchases.ts` - RevenueCat integration

---

### Example 3: Expense Tracker

**Input:**

```
I want an app to track my daily spending and see where my money goes
```

**What Claude Builds:**

- Quick expense entry
- Category-based organization
- Monthly budget tracking
- Charts and visualizations
- Export to CSV
- Premium: unlimited categories, cloud sync

---

## dApp Examples

### Example 4: DeFi Dashboard

**Input:**

```
Build a DeFi dashboard that tracks my portfolio across chains
```

**Agent Decision Gate:** Mode B (Agent-Backed) - AI recommendations require agents

**What Claude Builds:**

- Next.js 14 with App Router
- Wallet connection (Solana adapter)
- Portfolio aggregation view
- PnL tracking
- AI-powered rebalancing suggestions (agent integration)
- Real-time price updates

**Run the dApp:**

```bash
cd dapp-factory/dapp-builds/defi-dashboard
npm install
npm run dev
# Open http://localhost:3000
```

---

### Example 5: NFT Gallery

**Input:**

```
make a website where artists can showcase their NFT collections
```

**Agent Decision Gate:** Mode A (Standard) - No autonomous reasoning needed

**What Claude Builds:**

- Artist profile pages
- NFT grid with filtering
- Collection management
- Social sharing
- Responsive gallery layout
- Framer Motion animations

---

### Example 6: Token Gated Community

**Input:**

```
Build a dApp where token holders get access to exclusive content
```

**What Claude Builds:**

- Token verification system
- Gated content sections
- Member dashboard
- Content management
- Wallet-based authentication

---

## AI Agent Examples

### Example 7: YouTube Summarizer

**Input:**

```
Build an agent that summarizes YouTube videos
```

**4 Questions Asked:**

1. Name: `youtube-summarizer`
2. Description: "Summarizes YouTube videos into key points"
3. API Keys: `OPENAI_API_KEY`
4. Token Integration: No

**What Claude Builds:**

```
outputs/youtube-summarizer/
├── agent.json
├── package.json
├── src/
│   ├── index.ts          # HTTP server
│   └── lib/
│       ├── youtube.ts    # Transcript extraction
│       ├── summarizer.ts # LLM summarization
│       └── logger.ts     # Structured logging
├── research/
├── AGENT_SPEC.md
└── .env.example
```

**Test the Agent:**

```bash
cd agent-factory/outputs/youtube-summarizer
npm install
npm run dev

# In another terminal:
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=..."}'
```

**Response:**

```json
{
  "summary": "This video discusses...",
  "keyPoints": ["Point 1: ...", "Point 2: ...", "Point 3: ..."],
  "duration": "12:34",
  "title": "Video Title"
}
```

---

### Example 8: Code Reviewer

**Input:**

```
Build an agent that reviews code and suggests improvements
```

**What Claude Builds:**

- Code analysis endpoint
- Multiple language support
- Security vulnerability detection
- Performance suggestions
- Style recommendations

---

### Example 9: Email Classifier

**Input:**

```
Build an agent that classifies emails into categories
```

**What Claude Builds:**

- Email parsing
- Category prediction (urgent, info, spam, etc.)
- Priority scoring
- Batch processing endpoint

---

## Plugin Examples

### Example 10: Auto-Formatter Plugin

**Input:**

```
I want a plugin that formats code on every save
```

**Plugin Type:** Claude Code Plugin (hooks respond to events)

**What Claude Builds:**

```
builds/auto-formatter/
├── .claude-plugin/
│   └── plugin.json
├── hooks/
│   └── hooks.json        # PostToolUse hook
├── scripts/
│   └── format.sh         # Formatter script
├── commands/
│   └── format.md         # Manual /format command
├── README.md
├── INSTALL.md
├── SECURITY.md
└── EXAMPLES.md
```

**hooks.json:**

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "pattern": "\\.(ts|tsx|js|jsx|py|go|rs)$",
      "script": "./scripts/format.sh",
      "description": "Auto-format supported files after write"
    }
  ]
}
```

---

### Example 11: Git Commit Helper

**Input:**

```
Build a plugin that generates commit messages from staged changes
```

**Plugin Type:** Claude Code Plugin (command)

**What Claude Builds:**

- `/commit-suggest` command
- Analyzes git diff
- Generates conventional commit message
- Optional auto-commit

---

### Example 12: API Documentation Generator

**Input:**

```
Build an MCP server that generates API docs from code
```

**Plugin Type:** MCP Server (external processing)

**What Claude Builds:**

```
builds/api-doc-generator/
├── manifest.json
├── server/
│   └── index.ts
├── src/
│   ├── tools/
│   │   └── generateDocs.ts
│   └── resources/
│       └── templates.ts
├── package.json
└── README.md
```

---

## Mini App Examples

### Example 13: Gratitude Journal

**Input:**

```
I want a mini app that lets users share daily gratitude posts with friends
```

**What Claude Builds:**

```
builds/miniapps/gratitude-journal/app/
├── app/
│   ├── .well-known/farcaster.json/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── GratitudeCard.tsx
│   └── PostForm.tsx
├── minikit.config.ts
└── public/
    ├── icon.png
    ├── splash.png
    └── hero.png
```

**Manifest Configuration:**

```typescript
// minikit.config.ts
export const config = {
  name: 'Gratitude Journal',
  tagline: 'Share daily gratitude', // 30 chars max
  description: "A mini app for sharing what you're grateful for with friends",
  category: 'social',
  tags: ['gratitude', 'social', 'journal', 'wellness'],
  // Account association (user completes manually)
  accountAssociation: {
    header: '', // User fills after deployment
    payload: '',
    signature: '',
  },
};
```

---

### Example 14: Tip Jar

**Input:**

```
Build a mini app where creators can receive tips from fans
```

**Onchain Requirements:** Wallet connection + Transactions

**What Claude Builds:**

- Tip amount selector
- Creator profile display
- Transaction confirmation
- Tip history

---

### Example 15: Poll Creator

**Input:**

```
make a mini app for creating quick polls that friends can vote on
```

**What Claude Builds:**

- Poll creation form
- Voting interface
- Results visualization
- Share functionality

---

## Website Examples

### Example 16: Photography Portfolio

**Input:**

```
Build a portfolio website for a photographer
```

**What Claude Builds:**

```
website-builds/photo-portfolio/
├── src/app/
│   ├── page.tsx          # Hero + featured work
│   ├── portfolio/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── PhotoGrid.tsx     # Masonry gallery
│   ├── LightboxModal.tsx # Full-screen view
│   └── ContactForm.tsx
├── research/
├── planning/
│   ├── sitemap.md
│   └── design_system.md
├── audits/
│   ├── react-best-practices.md
│   ├── web-design-guidelines.md
│   └── seo_review.md
└── tests/e2e/
```

**Skills Audit Results:**

- react-best-practices: 97% PASS
- web-design-guidelines: 94% PASS

---

### Example 17: SaaS Landing Page

**Input:**

```
Build a landing page for a project management SaaS
```

**What Claude Builds:**

- Hero section with CTA
- Feature grid
- Pricing table
- Testimonials
- FAQ accordion
- Contact form
- SEO optimized

---

### Example 18: Restaurant Website

**Input:**

```
make a website for an Italian restaurant
```

**What Claude Builds:**

- Menu display
- Reservation form
- Location/hours
- Photo gallery
- Chef's story
- Contact info
- Local SEO structured data

---

## Advanced Examples

### Example 19: Full-Stack Application

**Combining Pipelines:**

1. Build the backend agent:

```bash
cd agent-factory
claude
> Build an agent that manages todo items with CRUD operations
```

2. Build the frontend:

```bash
cd dapp-factory
claude
> Build a todo app frontend that connects to an API at localhost:8080
```

3. Run both:

```bash
# Terminal 1
cd agent-factory/outputs/todo-api && npm run dev

# Terminal 2
cd dapp-factory/dapp-builds/todo-app && npm run dev
```

---

### Example 20: Plugin + Agent Integration

1. Build a data-fetching agent:

```bash
cd agent-factory
claude
> Build an agent that fetches and caches stock prices
```

2. Build an MCP server that uses the agent:

```bash
cd plugin-factory
claude
> Build an MCP server that provides stock price data by calling localhost:8080
```

---

## Tips for Better Results

### Be Specific About Features

```
# Good
"Build a habit tracker with daily streaks, weekly statistics,
and push notification reminders at custom times"

# Less Specific
"Build a habit tracker"
```

### Mention Technology Preferences

```
"Build a meditation app with dark mode, haptic feedback,
and ambient sound mixing using expo-av"
```

### Specify Monetization

```
"Build a premium notes app with a free tier (5 notes)
and pro tier ($4.99/month) for unlimited notes"
```

### Include UX Details

```
"Build a finance tracker with skeleton loaders,
pull-to-refresh, and swipe-to-delete"
```

---

## Related Documentation

- [GETTING_STARTED.md](/docs/GETTING_STARTED.md) - First build guide
- [API.md](/docs/API.md) - Command reference
- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Common issues

---

**App Factory Examples v1.0.0**: Real examples for every pipeline.
