<p align="center">
  <img src="./app-factory/AppFactory.png" alt="App Factory" width="800" />
</p>

# App Factory

**Describe it. Build it. Ship it.**

App Factory turns your ideas into real, working products. No coding experience required. Just describe what you want in plain English, and Claude builds it.

---

## What Can I Build?

| I want to make... | Use this | What you get |
|-------------------|----------|--------------|
| A **mobile app** | [app-factory/](./app-factory/) | iPhone & Android app ready for the App Store |
| A **dApp / website** | [dapp-factory/](./dapp-factory/) | Modern web app, optionally with AI agents |
| An **AI agent** | [agent-factory/](./agent-factory/) | Smart bot with tools (Rig-aligned architecture) |
| A **Claude plugin** | [plugin-factory/](./plugin-factory/) | Extension for Claude Code or Claude Desktop |

---

## Quick Start Commands

### For Mobile Apps
```bash
cd app-factory
claude
# Type your app idea
# When done: cd builds/<your-app> && npm install && npx expo start
```

### For dApps / Websites
```bash
cd dapp-factory
claude
# Type your dApp idea
# When done: cd dapp-builds/<your-dapp> && npm install && npm run dev
# Open http://localhost:3000
```

### For AI Agents
```bash
cd agent-factory
claude
# Type your agent idea
# When done: cd outputs/<your-agent> && npm install && npm run dev
# Test: curl http://localhost:8080/health
```

### For Claude Plugins
```bash
cd plugin-factory
claude
# Type your plugin idea
# When done (Claude Code plugin): Copy builds/<plugin>/ to your project
# When done (MCP server): cd builds/<plugin> && npm install && npm run build
```

---

## How It Works

### Step 1: Pick Your Project Type

```
Want a mobile app?     → Go to app-factory folder
Want a dApp/website?   → Go to dapp-factory folder
Want an AI agent?      → Go to agent-factory folder
Want a Claude plugin?  → Go to plugin-factory folder
```

### Step 2: Open Claude and Describe Your Idea

```bash
cd app-factory    # (or dapp-factory, or agent-factory)
claude
```

Then just type what you want:

> "I want to make an app where you fly a plane"

> "I want to make a meme battle website where people vote on memes"

> "Build an agent that summarizes YouTube videos"

> "I want a plugin that formats code on save"

### Step 3: Let the AI Build It

The AI will:
1. **Understand your idea** - Turn your simple description into a detailed plan
2. **Research the market** - Find competitors and figure out what makes yours special
3. **Build everything** - Create all the code, designs, and documentation
4. **Check quality** - Review its own work and fix any issues

### Step 4: Run Your Creation

When it's done, you'll get step-by-step instructions to run your new app, website, or AI assistant on your computer.

---

## The Secret Sauce: Intent Normalization

You don't need to be specific. Our AI fills in the gaps.

**What you say:**
> "make me a meditation app"

**What the AI understands:**
> "A premium meditation app with guided sessions, progress tracking, streak calendars, ambient sounds, and subscription monetization. Features smooth animations, offline support, and a calming dark-mode design."

The AI adds all the details that make a great product, so you just focus on the idea.

---

## Quality Guarantee: Ralph Mode

Every project goes through "Ralph Mode" - our quality checker that acts like a picky reviewer.

Ralph checks:
- Does the code actually run?
- Does everything look polished?
- Is the research real and useful?
- Are there any bugs or issues?

**Ralph won't let a project finish until it's at least 97% perfect.**

If something's wrong, the AI fixes it automatically. You only see the final, working result.

---

## Real Examples

### Mobile App Example

**You say:** "I want to make an app where you fly a plane"

**You get:**
- A complete iPhone/Android game with plane controls
- App Store listing with title, description, and keywords
- Marketing research showing similar apps and your advantages
- Everything you need to publish to the App Store

### Website Example

**You say:** "I want to make a meme battle arena where people vote on memes"

**You get:**
- A polished website with smooth animations
- Voting system, leaderboards, and user submissions
- Mobile-friendly design that works on any screen
- Ready to deploy to the internet

### AI Agent Example

**You say:** "Build an agent that summarizes YouTube videos"

**You get:**
- A working AI that accepts video links and returns summaries
- Simple API you can connect to other apps
- Documentation explaining how it all works
- Ready to run on your computer or a server

### Claude Plugin Example

**You say:** "I want a plugin that formats code on save"

**You get:**
- A complete Claude Code plugin with hooks and commands
- Auto-formatting whenever you save a file
- Support for multiple formatters (Prettier, ESLint, Black, etc.)
- Security documentation and installation guide

---

## What's Inside Each Project

### Mobile Apps Include:
- Complete app code (TypeScript + React Native)
- App Store listing materials
- Market research and competitor analysis
- Privacy policy and legal docs
- Step-by-step launch instructions

### Websites Include:
- Complete website code (TypeScript + Next.js)
- Modern design with animations
- Mobile-responsive layout
- Market research and positioning
- Deployment instructions

### AI Agents Include:
- Complete server code (TypeScript + Node.js)
- API endpoints ready to use
- Market research and positioning
- Testing and deployment guides

### Claude Plugins Include:
- Complete plugin structure (commands, hooks, or MCP server)
- Security documentation
- Installation instructions
- Usage examples
- MCPB packaging guide (for MCP servers)

---

## Folder Structure

```
AppFactory/
├── app-factory/      # Mobile app builder
├── dapp-factory/     # dApp/website builder (with optional AI agents)
├── agent-factory/    # AI agent builder (Rig-aligned)
├── plugin-factory/   # Claude plugin builder
├── references/       # Reference implementations (Rig framework)
└── docs/             # Architecture docs and learning materials
```

Each folder is independent. Just pick one and start building.

---

## Optional: Add Tokens

Want to add cryptocurrency features? Just say "yes" when asked about token integration.

- **Default:** No crypto, no blockchain, just a normal app
- **With tokens:** Add payments, rewards, or premium features using Solana

You don't need to understand crypto - the AI handles all the technical stuff.

---

## Troubleshooting

### "npm install fails"
```bash
npm install --legacy-peer-deps
```

### "Port already in use"
```bash
# For websites
PORT=3001 npm run dev

# For AI assistants
PORT=3001 npm run dev
```

### "Something's not working"
Check the `runs/` folder in your project - there's a detailed log of what happened and any issues found.

---

## Support the Project

Hold **$FACTORY** on Solana to support ongoing development.

**Contract Address:** `BkSbFrDMkfkoG4NDUwadEGeQgVwoXkR3F3P1MPUnBAGS`

---

## AI Agent Architecture: Rig Integration

The agent-factory and dapp-factory pipelines are now aligned with the [Rig framework](https://github.com/0xPlaygrounds/rig) by 0xPlaygrounds - a production-grade Rust library for building LLM-powered applications.

**What this means for you:**
- Agents follow real architectural patterns (not tutorial code)
- Tools have proper typed definitions
- Generated code can scale to production
- Clear learning path from TypeScript scaffolds to Rust production

See `/docs/architecture/` for detailed documentation.

---

## Version History

| Version | What Changed |
|---------|--------------|
| **v9.0** | Rig integration, renamed web3-factory → dapp-factory, agent decision gate |
| **v8.0** | Added plugin-factory for Claude Code plugins and MCP servers |
| **v7.0** | Added Intent Normalization and Ralph Quality Mode to all pipelines |
| **v5.0** | Factory Ready Standard, unified documentation |
| **v4.0** | Single-mode refactor, Ralph QA process |

---

## License

MIT License - Free to use, modify, and share.

---

<p align="center">
  <a href="https://star-history.com/#MeltedMindz/AppFactory&Date">
    <img src="https://api.star-history.com/svg?repos=MeltedMindz/AppFactory&type=Date" alt="Star History Chart" width="600" />
  </a>
</p>

<p align="center">
  <strong>App Factory v9.0</strong><br/>
  Tell us what you want. We'll make it for you.
</p>
