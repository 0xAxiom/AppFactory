#!/usr/bin/env node
/**
 * generate-identity.mjs — Generate/regenerate identity files for a Clawbot
 *
 * Reads config.json and regenerates workspace markdown files.
 * Useful after updating config or launching a token.
 *
 * Usage: node scripts/generate-identity.mjs --slug <bot-slug>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

function getSlug() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf('--slug');
  if (slugIndex !== -1 && args[slugIndex + 1]) {
    return args[slugIndex + 1];
  }
  return null;
}

function readTemplate(name) {
  const path = join(ROOT, 'templates', name);
  return existsSync(path) ? readFileSync(path, 'utf-8') : '';
}

function applyReplacements(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }
  return result;
}

function main() {
  console.log('\n🔄 Regenerating identity files...\n');

  const slug = getSlug();
  if (!slug) {
    console.error('Usage: node scripts/generate-identity.mjs --slug <bot-slug>');
    process.exit(1);
  }

  const dir = join(ROOT, 'builds', 'claws', slug);
  const configPath = join(dir, 'config.json');

  if (!existsSync(configPath)) {
    console.error(`Workspace not found: builds/claws/${slug}/`);
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  const replacements = {
    BOT_NAME: config.name,
    BOT_SLUG: config.slug,
    BOT_DESCRIPTION: config.description || '',
    BOT_TAGLINE: config.description || '',
    BOT_AVATAR_URL: config.personality?.avatarUrl || '(not set)',
    PERSONALITY_TRAITS: (config.personality?.traits || []).map((t) => `- ${t}`).join('\n'),
    COMMUNICATION_STYLE: config.personality?.communicationStyle || 'friendly',
    PRIMARY_LANGUAGE: config.personality?.language || 'en',
    EMOJI_PREFERENCE: config.personality?.emojiPreference || 'minimal',
    CUSTOM_PREAMBLE: config.personality?.customPreamble || '(none)',
    MODEL_PROVIDER: config.modelProvider || 'claude',
    ACTIVE_PLATFORMS: (config.platforms || []).map((p) => `- ${p}`).join('\n'),
    BUILTIN_SKILLS_LIST: (config.skills || []).map((s) => `- ${s}`).join('\n'),
    CUSTOM_SKILLS_LIST: '_(none)_',
    PLATFORM_INTEGRATIONS: (config.platforms || []).map((p) => `- ${p}: configured`).join('\n'),
    MEMORY_ENABLED: config.memory ? 'Enabled' : 'Disabled',
    PROACTIVE_MODE: config.proactiveMode ? 'Enabled' : 'Disabled',
    CRON_ENABLED: config.cronJobs ? 'Enabled' : 'Disabled',
    SCOUT_STATUS: config.subAgents?.scout ? 'active' : 'disabled',
    BUILDER_STATUS: config.subAgents?.builder ? 'active' : 'disabled',
    WATCHER_STATUS: config.subAgents?.watcher ? 'active' : 'disabled',
    SCOUT_STATUS_ICON: config.subAgents?.scout ? '🟢' : '⚫',
    BUILDER_STATUS_ICON: config.subAgents?.builder ? '🟢' : '⚫',
    WATCHER_STATUS_ICON: config.subAgents?.watcher ? '🟢' : '⚫',
    TOKEN_CHAIN: config.token?.chain || 'none',
    TOKEN_NAME: config.token?.name || '(no token)',
    TOKEN_SYMBOL: config.token?.symbol || '—',
    TOKEN_ADDRESS: config.token?.address || '(not launched)',
    TOKEN_EXPLORER_URL: config.token?.explorerUrl || '(not launched)',
    CREATOR_WALLET: config.token?.wallet || '(not set)',
    CREATED_AT: config.createdAt || new Date().toISOString(),
    LAST_BOOT: '(not yet booted)',
    USER_CONTEXT: '(see USER.md)',
    RESPONSE_LENGTH_PREF: 'moderate',
    TECHNICAL_LEVEL: 'intermediate',
    NOTIFICATION_PREF: 'as-needed',
    CAPABILITIES_SUMMARY: (config.skills || []).slice(0, 5).join(', '),
    TOKEN_GREETING: config.token ? `I also have an onchain presence via $${config.token.symbol} on ${config.token.chain}.` : '',
  };

  const filesToRegenerate = ['IDENTITY.md', 'HEARTBEAT.md', 'AGENTS.md', 'agents/registry.json'];

  for (const file of filesToRegenerate) {
    const template = readTemplate(file);
    if (template) {
      const content = applyReplacements(template, replacements);
      const outPath = join(dir, file);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, content);
      console.log(`  ✅ ${file}`);
    }
  }

  console.log('\n  Done!\n');
}

main();
