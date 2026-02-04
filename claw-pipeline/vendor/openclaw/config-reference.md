# OpenClaw Configuration Reference

## bot.config.ts

```typescript
export const config = {
  // Required
  name: string;           // Bot display name
  slug: string;           // URL-safe identifier
  description: string;    // One-line description

  // Personality
  personality: {
    traits: string[];               // e.g. ['helpful', 'concise', 'friendly']
    communicationStyle: string;     // 'formal' | 'casual' | 'technical' | 'friendly' | 'concise'
    language: string;               // ISO 639-1 code, default 'en'
    customPreamble?: string;        // Custom system prompt prefix
  };

  // Platforms
  platforms: string[];    // ['whatsapp', 'telegram', 'discord', 'slack']

  // Skills
  skills: string[];       // Skill IDs to enable

  // Model
  model: {
    provider: string;     // 'claude' | 'openai' | 'local'
    temperature?: number; // 0.0 - 1.0, default 0.7
    maxTokens?: number;   // Default 4096
  };

  // Memory
  memory: {
    enabled: boolean;     // Default true
    storageDir: string;   // Default './memory'
  };

  // Sub-Agents
  subAgents: {
    scout: boolean;       // Research agent
    builder: boolean;     // Code generation agent
    watcher: boolean;     // Monitoring agent
  };

  // Advanced
  proactiveMode: boolean; // Background tasks
  cronJobs: boolean;      // Scheduled tasks
};
```

## Environment Variables

### Required (all bots)

| Variable            | Description                      |
| ------------------- | -------------------------------- |
| `ANTHROPIC_API_KEY` | Claude API key (if using Claude) |
| `OPENAI_API_KEY`    | OpenAI API key (if using OpenAI) |

### Platform-Specific

| Variable              | Description                  |
| --------------------- | ---------------------------- |
| `WHATSAPP_API_KEY`    | WhatsApp Business API key    |
| `WHATSAPP_API_SECRET` | WhatsApp Business API secret |
| `TELEGRAM_API_KEY`    | Telegram Bot Token           |
| `TELEGRAM_API_SECRET` | Telegram webhook secret      |
| `DISCORD_API_KEY`     | Discord Bot Token            |
| `DISCORD_API_SECRET`  | Discord application secret   |
| `SLACK_API_KEY`       | Slack Bot Token              |
| `SLACK_API_SECRET`    | Slack signing secret         |

### Token Launch (Optional)

| Variable                 | Description              |
| ------------------------ | ------------------------ |
| `BAGS_API_KEY`           | Bags.fm API key (Solana) |
| `SOLANA_RPC_URL`         | Solana RPC endpoint      |
| `CREATOR_WALLET_ADDRESS` | Solana wallet (Base58)   |
| `CLANKER_API_KEY`        | Clanker API key (Base)   |
| `ADMIN_WALLET_ADDRESS`   | EVM wallet (0x)          |

## Skill Interface

```typescript
interface Skill {
  name: string;
  description: string;
  triggers: string[];
  execute(context: SkillContext): Promise<SkillResponse>;
}

interface SkillContext {
  message: string;
  user: UserInfo;
  memory: MemoryStore;
  platform: string;
}

interface SkillResponse {
  text: string;
  metadata?: Record<string, unknown>;
  attachments?: Attachment[];
}
```
