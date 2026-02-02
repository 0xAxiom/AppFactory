/**
 * OpenClaw Configuration Constants
 *
 * Reference: https://openclaw.ai/
 * Supported platforms, integrations, and model providers
 */

export const SUPPORTED_PLATFORMS = [
  'whatsapp',
  'telegram',
  'discord',
  'slack',
] as const;

export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];

export const PLATFORM_CONFIG = {
  whatsapp: {
    name: 'WhatsApp',
    envVars: ['WHATSAPP_API_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'],
    description: 'Communicate via WhatsApp Business API',
  },
  telegram: {
    name: 'Telegram',
    envVars: ['TELEGRAM_BOT_TOKEN'],
    description: 'Communicate via Telegram Bot API',
  },
  discord: {
    name: 'Discord',
    envVars: ['DISCORD_BOT_TOKEN', 'DISCORD_APPLICATION_ID'],
    description: 'Communicate via Discord bot',
  },
  slack: {
    name: 'Slack',
    envVars: ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'],
    description: 'Communicate via Slack app',
  },
} as const;

export const AVAILABLE_INTEGRATIONS = [
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'email',
    description: 'Read, send, and manage emails',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'development',
    description: 'Manage repos, issues, PRs',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'media',
    description: 'Control music playback',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    category: 'notes',
    description: 'Read and write notes',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    category: 'productivity',
    description: 'Manage calendar events',
  },
  {
    id: 'web-browse',
    name: 'Web Browser',
    category: 'core',
    description: 'Browse web, fill forms, extract data',
  },
  {
    id: 'file-system',
    name: 'File System',
    category: 'core',
    description: 'Read and write local files',
  },
  {
    id: 'shell',
    name: 'Shell Commands',
    category: 'core',
    description: 'Execute shell commands',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'Manage Notion pages and databases',
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'development',
    description: 'Track issues and projects',
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    category: 'social',
    description: 'Post and read tweets',
  },
  {
    id: 'weather',
    name: 'Weather',
    category: 'information',
    description: 'Get weather forecasts',
  },
  {
    id: 'news',
    name: 'News',
    category: 'information',
    description: 'Read news headlines',
  },
  {
    id: 'todoist',
    name: 'Todoist',
    category: 'productivity',
    description: 'Manage tasks and projects',
  },
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    category: 'iot',
    description: 'Control smart home devices',
  },
] as const;

export const MODEL_PROVIDERS = {
  claude: {
    name: 'Claude (Anthropic)',
    envVars: ['ANTHROPIC_API_KEY'],
    defaultModel: 'claude-sonnet-4-20250514',
    description: 'Recommended for complex reasoning and tool use',
  },
  openai: {
    name: 'OpenAI GPT',
    envVars: ['OPENAI_API_KEY'],
    defaultModel: 'gpt-4o',
    description: 'Versatile general-purpose model',
  },
  local: {
    name: 'Local Model (Ollama)',
    envVars: ['OLLAMA_HOST'],
    defaultModel: 'llama3',
    description: 'Privacy-first, runs entirely on your hardware',
  },
} as const;

export type ModelProvider = keyof typeof MODEL_PROVIDERS;

export const DEFAULT_CONFIG = {
  platforms: ['telegram', 'discord'] as SupportedPlatform[],
  modelProvider: 'claude' as ModelProvider,
  integrations: [
    'gmail',
    'calendar',
    'web-browse',
    'file-system',
    'shell',
  ] as string[],
  memory: true,
  proactiveMode: false,
  cronJobs: false,
} as const;
