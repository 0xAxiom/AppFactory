# {{AGENT_NAME}} - Launch Strategy

**A tactical playbook for launching your AI agent and getting your first users.**

---

## Launch Phases

### Phase 1: Pre-Launch Preparation

- [ ] Agent validated (`npm run validate` passes)
- [ ] All tests pass (see TESTING.md)
- [ ] Push to GitHub
- [ ] Prepare project metadata (name, description, icon)
- [ ] Create social media accounts (Twitter/X essential)
- [ ] Draft all launch content (below)
- [ ] Identify 5-10 communities to share in
- [ ] Reach out to potential early users for feedback

### Phase 2: Launch Day

- [ ] Deploy to production (Factory Launchpad or self-hosted)
- [ ] Publish all launch content
- [ ] Post to communities
- [ ] Engage with every comment/reply
- [ ] Monitor for issues

### Phase 3: Post-Launch

- [ ] Respond to all feedback
- [ ] Fix critical bugs immediately
- [ ] Gather insights for next version
- [ ] Write retrospective

---

## Twitter/X Launch

**Essential for AI agents.** The AI/developer community is highly active on Twitter.

### Launch Thread Structure

**Tweet 1 (Hook):**

```
I just launched {{AGENT_NAME}}

[One-line description of what it does]

Here's how it works:

🧵
```

**Tweet 2 (Problem):**

```
The problem:

[Describe the pain point you're solving]

[Optional: personal story of experiencing this problem]
```

**Tweet 3 (Solution with visual):**

```
So I built {{AGENT_NAME}}

[Screenshot or GIF of the agent in action]

[2-3 sentence description]
```

**Tweets 4-6 (Features):**

```
Feature 1: [Name]

[Example request/response]

[Brief explanation]
```

**Tweet 7 (Technical):**

```
Built this using:

- Node.js + TypeScript
- [LLM provider]
- [Other tech]

Runs as a simple HTTP API - integrate anywhere.
```

**Tweet 8 (CTA):**

```
Try it: [URL or GitHub link]

If you find it useful:
- Star the repo
- Share with someone who'd benefit
- Let me know what you think

[Optional: What you're working on next]
```

### Hashtags

`#buildinpublic #AI #agents #LLM #TypeScript`

---

## Hacker News (Show HN)

**Best for:** Technical agents, developer tools, novel AI applications.

### Format

**Title:** `Show HN: {{AGENT_NAME}} – [One-line description]`

### Post Content

````
Hi HN,

I built {{AGENT_NAME}}, a [brief description].

GitHub: [URL]
Live demo: [URL if applicable]

**Why I built this:**
[1-2 paragraphs on the problem and your motivation]

**How it works:**
[Technical explanation - HN appreciates this]

**Tech stack:**
- Node.js 18+ with TypeScript
- [LLM provider] for inference
- HTTP REST API interface

**Example usage:**
```bash
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{"input": "example request"}'
````

I'd love feedback, especially on [specific aspect].

```

### Tips
- Post 6-9 AM PT on weekdays
- Be ready for critical feedback
- Respond to every comment thoughtfully
- Don't be defensive about architectural choices

---

## Reddit Communities

**Relevant subreddits** (choose 3-5):

### AI/ML
- r/MachineLearning - Technical ML discussion
- r/LocalLLaMA - Open source LLM community
- r/ChatGPT - GPT users and builders
- r/artificial - General AI discussion

### Developer
- r/node - Node.js community
- r/typescript - TypeScript developers
- r/SideProject - Indie makers

### Niche (based on agent purpose)
- r/productivity - Productivity tools
- r/automation - Automation enthusiasts
- r/[your-domain] - Domain-specific subreddit

### Rules
- Read subreddit rules before posting
- Don't spam - one post per subreddit
- Engage genuinely in comments
- Share the problem, not just the solution

### Post Template
```

Title: I built an AI agent that [what it does]

After [time] building, I launched {{AGENT_NAME}}.

**The problem:** [What problem you're solving]

**What it does:** [Brief description]

**Example:**

```
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{"input": "your input here"}'
```

**Response:**

```json
{ "response": "example output" }
```

GitHub: [link]

Would love feedback from this community!

```

---

## Indie Hackers

**URL:** https://www.indiehackers.com

### Best Sections
- Product launches
- Milestones
- Ask IH (for feedback)

### What Works
- Behind-the-scenes building stories
- Technical architecture decisions
- Lessons learned building AI agents
- Cost/performance optimizations

---

## Discord Communities

### AI/Developer Communities
- **Anthropic Discord** - Claude/AI discussion
- **OpenAI Discord** - GPT/AI builders
- **LangChain Discord** - Agent framework community
- **Vercel Discord** - Deployment discussion
- **TypeScript Discord** - TS developers

### Tips
- Find the appropriate #showcase or #launches channel
- Don't spam general channels
- Be helpful in other discussions first
- Offer to answer questions about your approach

---

## GitHub Optimization

### README Best Practices
- Clear one-liner at top
- Quick start in < 30 seconds
- Example request/response
- Badges (build status, version, license)
- GIF or screenshot of agent in action

### Repository Setup
- [ ] Clear description
- [ ] Relevant topics/tags
- [ ] License file
- [ ] Contributing guidelines (optional)
- [ ] Issue templates (optional)

### Promotion
- Star and watch your own repo
- Add to GitHub profile README
- Pin to profile
- Share in relevant GitHub Discussions

---

## Measuring Success

### First 24 Hours
- [ ] Track GitHub stars
- [ ] Monitor social mentions
- [ ] Count API requests (if self-hosted)
- [ ] Note any viral posts

### First Week Metrics

| Metric | Goal | Actual |
|--------|------|--------|
| GitHub stars | 50+ | |
| Forks | 10+ | |
| Issues/PRs | 5+ | |
| Social followers | 100+ | |
| API requests | 1000+ | |

### Token-Enabled Metrics (if applicable)

| Metric | Goal | Actual |
|--------|------|--------|
| Wallet connections | 50+ | |
| Token holders | 20+ | |
| Premium users | 10+ | |

---

## Post-Launch Momentum

### Immediate Follow-Up
- [ ] Respond to all GitHub issues quickly
- [ ] Ship quick fixes based on feedback
- [ ] Share milestone updates (#buildinpublic)
- [ ] Write blog post about building the agent

### Growth Phase
- [ ] Plan v1.1 based on feedback
- [ ] Create tutorial content (blog, video)
- [ ] Build integrations with popular tools
- [ ] Consider premium features

---

## Blog Post Ideas

Write about your agent on:
- Dev.to
- Hashnode
- Medium
- Personal blog

### Post Templates

**"How I Built X"**
- Problem statement
- Solution approach
- Technical decisions
- Lessons learned

**"Building AI Agents with TypeScript"**
- Framework choice
- Architecture patterns
- Code examples
- Performance tips

**"From Idea to Launch"**
- Ideation process
- Building timeline
- Launch strategy
- Results

---

## Newsletter/Blog Outreach

| Publication | Type | URL |
|-------------|------|-----|
| TLDR AI | Daily newsletter | https://tldr.tech/ai |
| The Batch | AI newsletter | https://www.deeplearning.ai/the-batch |
| Hacker Newsletter | Weekly digest | https://hackernewsletter.com |
| Console.dev | Dev tools | https://console.dev |
| DevTo | Developer blog | https://dev.to |

### Pitch Template
```

Subject: New AI agent for [use case]: {{AGENT_NAME}}

Hi [Name],

I recently launched {{AGENT_NAME}}, an AI agent that [one-line description].

What makes it different:

- [Unique angle 1]
- [Unique angle 2]

GitHub: [URL]

I think your readers would find it useful because [reason].

Happy to provide more details.

Thanks,
[Your name]

```

---

## Resources

- **Indie Hackers handbook:** https://www.indiehackers.com/start
- **Show HN guidelines:** https://news.ycombinator.com/showhn.html
- **GitHub marketing:** https://github.com/readme/guides
- **Twitter growth:** Focus on #buildinpublic community

---

**Generated by Agent Factory v2.0**
```
