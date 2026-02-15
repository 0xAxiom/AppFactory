"use server";

export async function generateQuestions(description: string): Promise<{ questions: string[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are helping someone set up an AI agent using OpenClaw. They described their agent as:

"${description}"

Generate exactly 5 clarifying questions to help configure their agent. Each question should have 3-5 options in parentheses. Cover these areas:
1. Agent personality/tone
2. Communication channels (Telegram, Discord, Slack, Twitter, Signal)
3. Schedule/availability (always on, business hours, custom)
4. Preferred AI model (Opus=most capable, Sonnet=balanced, Haiku=fast+cheap)
5. Any specific capability that seems relevant based on their description

Return ONLY a JSON array of 5 question strings. No other text. Example:
["What tone should your agent use? (Professional / Casual / Technical / Creative)", "Which channels? (Telegram / Discord / Both)"]`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${err}`);
  }

  const data = await res.json();
  const text = data.content[0].text.trim();
  const questions = JSON.parse(text);
  return { questions };
}

export async function generateConfig(
  description: string,
  answers: string[]
): Promise<{
  agentName: string;
  emoji: string;
  soul: string;
  agents: string;
  heartbeat: string;
  identity: string;
  config: string;
  setup: string;
  readme: string;
  skills: string[];
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const skillMap: Record<string, string[]> = {
    "crypto|trading|defi|swap|token": ["solana-price", "solana-swap", "trade", "bankr"],
    "twitter|tweet|x\\.com|social media": ["bird"],
    "weather|forecast|temperature": ["weather"],
    "github|code|repository|pr|pull request": ["github"],
    "email|calendar|google|gmail": ["gog"],
    "farcaster|warpcast": ["neynar"],
    "image|art|generate.*image|picture": ["fal.ai"],
    "research|search|web.*search": ["exa"],
    "publish|blog|article|write.*post": ["article-publisher"],
    "onchain|base|ethereum|send.*money|usdc": ["botchan", "send-usdc"],
    "home.*auto|iot|smart.*home": ["node-red"],
    "video|movie|clip": ["movie-maker", "remotion"],
  };

  const detectedSkills: string[] = [];
  const lowerDesc = (description + " " + answers.join(" ")).toLowerCase();
  for (const [pattern, skills] of Object.entries(skillMap)) {
    if (new RegExp(pattern, "i").test(lowerDesc)) {
      detectedSkills.push(...skills);
    }
  }
  const uniqueSkills = [...new Set(detectedSkills)];

  const channelList: string[] = [];
  const allText = lowerDesc;
  if (/telegram/i.test(allText)) channelList.push("telegram");
  if (/discord/i.test(allText)) channelList.push("discord");
  if (/slack/i.test(allText)) channelList.push("slack");
  if (/twitter/i.test(allText)) channelList.push("twitter");
  if (/signal/i.test(allText)) channelList.push("signal");
  if (channelList.length === 0) channelList.push("telegram");

  let model = "anthropic/claude-sonnet-4-20250514";
  if (/opus|most capable|powerful/i.test(allText)) model = "anthropic/claude-opus-4-20250514";
  if (/haiku|fast|cheap|budget/i.test(allText)) model = "anthropic/claude-haiku-3-5-20241022";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Generate an AI agent configuration based on this description and Q&A.

Description: "${description}"
Answers to clarifying questions: ${JSON.stringify(answers)}
Detected skills: ${JSON.stringify(uniqueSkills)}
Channels: ${JSON.stringify(channelList)}

Return a JSON object with these exact keys:
- "agentName": short name (one word, lowercase)
- "emoji": one emoji that fits the agent
- "soul": A SOUL.md file content (personality, voice, values, quirks - 10-20 lines of markdown)
- "heartbeat": A HEARTBEAT.md file (3-5 periodic checks relevant to this agent type, markdown checklist)
- "identity": An IDENTITY.md content with name, emoji, role, one-liner

Return ONLY valid JSON. No markdown code fences.`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API error: ${await res.text()}`);
  const data = await res.json();
  const generated = JSON.parse(data.content[0].text.trim());

  const agentName = generated.agentName || "my-agent";
  const emoji = generated.emoji || "🤖";

  const agents = `# AGENTS.md — ${agentName} Workspace

This folder is home. Treat it that way.

## Every Session
1. Read \`SOUL.md\` — this is who you are
2. Read \`USER.md\` — this is who you're helping
3. Read \`memory/\` files for recent context
4. Read \`MEMORY.md\` for long-term context

## Memory
- **Daily notes:** \`memory/YYYY-MM-DD.md\` — raw logs
- **Long-term:** \`MEMORY.md\` — curated memories

## Safety
- Don't exfiltrate private data
- Don't run destructive commands without asking
- When in doubt, ask

## Tools
Skills provide your tools. Check each skill's \`SKILL.md\` for usage.
Keep local notes in \`TOOLS.md\`.

## Heartbeats
When you receive a heartbeat, check \`HEARTBEAT.md\` for your periodic tasks.
If nothing needs attention, reply \`HEARTBEAT_OK\`.
`;

  const channelConfig = channelList
    .map((ch) => {
      if (ch === "telegram") return `  telegram:\n    token: "\${TELEGRAM_BOT_TOKEN}"`;
      if (ch === "discord") return `  discord:\n    token: "\${DISCORD_BOT_TOKEN}"`;
      if (ch === "slack") return `  slack:\n    token: "\${SLACK_BOT_TOKEN}"`;
      return `  # ${ch}: configure manually`;
    })
    .join("\n");

  const config = `# OpenClaw Gateway Configuration
model: ${model}
workspace: ./

channels:
${channelConfig}

heartbeat:
  enabled: true
  intervalMinutes: 30

skills:
${uniqueSkills.map((s) => `  - ${s}`).join("\n") || "  # No skills auto-detected"}
`;

  const skillInstalls = uniqueSkills.map((s) => `npx openclaw skills add ${s}`).join("\n");
  const channelPrompts = channelList
    .map((ch) => {
      const envVar = `${ch.toUpperCase()}_BOT_TOKEN`;
      return `read -p "Enter your ${ch} bot token (or press Enter to skip): " ${envVar}
if [ -n "$${envVar}" ]; then
  echo "${envVar}=$${envVar}" >> .env
fi`;
    })
    .join("\n\n");

  const setup = `#!/bin/bash
set -e

echo ""
echo "${emoji} Claw Pipeline — Agent Setup"
echo "================================"
echo ""

if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required. Install from https://nodejs.org"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm is required. Install Node.js from https://nodejs.org"
  exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

echo "Installing OpenClaw..."
npm install -g openclaw
echo "✓ OpenClaw installed"
echo ""

WORKSPACE="$HOME/${agentName}"
mkdir -p "$WORKSPACE/memory" "$WORKSPACE/skills"
echo "✓ Workspace created at $WORKSPACE"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$SCRIPT_DIR/SOUL.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/AGENTS.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/HEARTBEAT.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/USER.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/IDENTITY.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/TOOLS.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/MEMORY.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/config.yaml" "$WORKSPACE/"
cp "$SCRIPT_DIR/README.md" "$WORKSPACE/"
cp -r "$SCRIPT_DIR/skills/" "$WORKSPACE/skills/" 2>/dev/null || true
echo "✓ Config files copied"
echo ""

cd "$WORKSPACE"
${skillInstalls || "echo 'No skills to install'"}
echo "✓ Skills installed"
echo ""

echo "--- API Key Configuration ---"
echo ""

touch .env

read -p "Enter your Anthropic API key: " ANTHROPIC_API_KEY
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" >> .env
fi

${channelPrompts}

echo ""
echo "✓ Configuration saved to .env"
echo ""
echo "================================"
echo "${emoji} Your agent is ready!"
echo ""
echo "  cd $WORKSPACE"
echo "  openclaw gateway start"
echo ""
echo "================================"
`;

  const readme = `# ${emoji} ${agentName}

An AI agent built with [OpenClaw](https://openclaw.dev).

## Quick Start

\`\`\`bash
chmod +x setup.sh
./setup.sh
\`\`\`

## Files

| File | Purpose |
|------|---------|
| \`SOUL.md\` | Agent personality and voice |
| \`AGENTS.md\` | Operating instructions |
| \`HEARTBEAT.md\` | Periodic check tasks |
| \`USER.md\` | About you (edit this!) |
| \`config.yaml\` | Gateway configuration |

## Skills
${uniqueSkills.map((s) => `- ${s}`).join("\n") || "No additional skills installed."}

## Need Help?

- [OpenClaw Docs](https://openclaw.dev)
`;

  return {
    agentName,
    emoji,
    soul: generated.soul,
    agents,
    heartbeat: generated.heartbeat,
    identity: generated.identity,
    config,
    setup,
    readme,
    skills: uniqueSkills,
  };
}
