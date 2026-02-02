#!/usr/bin/env node
/**
 * configure.mjs — Interactive Clawbot Configuration Wizard
 *
 * Walks the user through configuring their AI assistant:
 * - Identity (name, slug, description, avatar)
 * - Personality (traits, communication style, preamble)
 * - Human context (who the user is, preferences)
 * - Capabilities (platforms, skills, model, sub-agents)
 * - Token launch (chain selection, wallet, token details)
 * - Advanced (memory, proactive mode, cron jobs)
 *
 * Usage: node scripts/configure.mjs
 * Output: builds/claws/<slug>/ with populated workspace files
 */

import { createInterface } from 'readline';
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readTemplate(templateName) {
  const templatePath = join(ROOT, 'templates', templateName);
  if (!existsSync(templatePath)) {
    console.warn(`  ⚠️  Template not found: ${templateName}`);
    return '';
  }
  return readFileSync(templatePath, 'utf-8');
}

function applyReplacements(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }
  return result;
}

function writeOutput(outputDir, fileName, content) {
  const filePath = join(outputDir, fileName);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  console.log(`  ✅ ${fileName}`);
}

async function main() {
  console.log('\n' + '━'.repeat(60));
  console.log('  🐾 CLAWBOT CONFIGURATION WIZARD');
  console.log('  Create your custom AI assistant');
  console.log('━'.repeat(60) + '\n');

  const config = {};

  // ─── SECTION 1: IDENTITY ───
  console.log('📝 SECTION 1: Identity\n');

  config.botName = await ask('  1. Bot name: ');
  config.botSlug = slugify(config.botName);
  console.log(`     → Slug: ${config.botSlug}`);

  config.botDescription = await ask('  2. Short description (one line): ');
  config.botTagline = await ask('  3. Tagline (e.g. "your AI chess tutor"): ');
  config.botAvatar = await ask('  4. Avatar image URL (or press Enter to skip): ');

  // ─── SECTION 2: PERSONALITY ───
  console.log('\n🎭 SECTION 2: Personality\n');

  config.personalityTraits = await ask('  5. Personality traits (comma-separated, e.g. "witty, helpful, concise"): ');

  console.log('  6. Communication style:');
  console.log('     [1] Formal');
  console.log('     [2] Casual');
  console.log('     [3] Technical');
  console.log('     [4] Friendly');
  console.log('     [5] Concise');
  const styleChoice = await ask('     Choose (1-5): ');
  const styles = ['formal', 'casual', 'technical', 'friendly', 'concise'];
  config.communicationStyle = styles[parseInt(styleChoice) - 1] || 'friendly';
  console.log(`     → ${config.communicationStyle}`);

  config.language = (await ask('  7. Primary language (default: en): ')) || 'en';
  config.emojiPreference = (await ask('  8. Emoji usage (none/minimal/moderate/heavy, default: minimal): ')) || 'minimal';
  config.customPreamble = await ask('  9. Custom system prompt preamble (or press Enter to skip): ');

  // ─── SECTION 3: HUMAN CONTEXT ───
  console.log('\n👤 SECTION 3: About You\n');

  config.userContext = await ask('  10. Tell the bot about yourself (interests, role, etc.): ');

  console.log('  11. Preferred response length:');
  console.log('      [1] Brief (1-2 sentences)');
  console.log('      [2] Moderate (paragraph)');
  console.log('      [3] Detailed (full explanation)');
  const lengthChoice = await ask('      Choose (1-3): ');
  const lengths = ['brief', 'moderate', 'detailed'];
  config.responseLengthPref = lengths[parseInt(lengthChoice) - 1] || 'moderate';

  console.log('  12. Technical level:');
  console.log('      [1] Beginner');
  console.log('      [2] Intermediate');
  console.log('      [3] Advanced');
  const techChoice = await ask('      Choose (1-3): ');
  const techLevels = ['beginner', 'intermediate', 'advanced'];
  config.technicalLevel = techLevels[parseInt(techChoice) - 1] || 'intermediate';

  // ─── SECTION 4: CAPABILITIES ───
  console.log('\n⚡ SECTION 4: Capabilities\n');

  console.log('  13. Platforms (comma-separated, or "all"):');
  console.log('      Options: whatsapp, telegram, discord, slack');
  const platformInput = await ask('      Platforms: ');
  if (platformInput.toLowerCase() === 'all') {
    config.platforms = ['whatsapp', 'telegram', 'discord', 'slack'];
  } else {
    config.platforms = platformInput.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  }
  console.log(`      → ${config.platforms.join(', ')}`);

  console.log('  14. Skills to enable (comma-separated, or "all"):');
  console.log('      Options: email, calendar, web-browsing, code-execution,');
  console.log('               file-management, image-generation, token-info,');
  console.log('               price-watch, social, agent-ops');
  const skillInput = await ask('      Skills: ');
  if (skillInput.toLowerCase() === 'all') {
    config.skills = ['email', 'calendar', 'web-browsing', 'code-execution', 'file-management', 'image-generation', 'token-info', 'price-watch', 'social', 'agent-ops'];
  } else {
    config.skills = skillInput.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  }

  console.log('  15. AI model provider:');
  console.log('      [1] Claude (Anthropic) — Recommended');
  console.log('      [2] OpenAI (GPT-4)');
  console.log('      [3] Local (Ollama/etc)');
  const modelChoice = await ask('      Choose (1-3): ');
  const models = ['claude', 'openai', 'local'];
  config.modelProvider = models[parseInt(modelChoice) - 1] || 'claude';

  console.log('  16. Sub-agents to enable:');
  console.log('      [1] None');
  console.log('      [2] Scout only (research)');
  console.log('      [3] Scout + Builder');
  console.log('      [4] All (Scout + Builder + Watcher)');
  const agentChoice = await ask('      Choose (1-4): ');
  config.scoutEnabled = ['2', '3', '4'].includes(agentChoice);
  config.builderEnabled = ['3', '4'].includes(agentChoice);
  config.watcherEnabled = agentChoice === '4';

  // ─── SECTION 5: TOKEN LAUNCH ───
  console.log('\n🪙 SECTION 5: Token Launch\n');

  console.log('  17. Launch a token for your bot?');
  console.log('      [1] No token');
  console.log('      [2] Solana (via Bags.fm)');
  console.log('      [3] Base (via Clanker)');
  const tokenChoice = await ask('      Choose (1-3): ');

  config.tokenLaunch = tokenChoice !== '1';
  config.tokenChain = tokenChoice === '2' ? 'solana' : tokenChoice === '3' ? 'base' : 'none';

  if (config.tokenLaunch) {
    config.tokenName = await ask('      Token name: ');
    config.tokenSymbol = await ask('      Token symbol (uppercase): ');
    config.tokenDescription = await ask('      Token description: ');
    config.tokenImage = await ask('      Token image URL (or Enter to skip): ');

    if (config.tokenChain === 'solana') {
      config.creatorWallet = await ask('      Creator wallet (Solana Base58): ');
      if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(config.creatorWallet)) {
        console.log('      ⚠️  Warning: wallet format may be invalid');
      }
    } else {
      config.creatorWallet = await ask('      Admin wallet (0x...): ');
      if (!/^0x[a-fA-F0-9]{40}$/.test(config.creatorWallet)) {
        console.log('      ⚠️  Warning: wallet format may be invalid');
      }
    }
  }

  // ─── SECTION 6: ADVANCED ───
  console.log('\n🔧 SECTION 6: Advanced Options\n');

  const memoryInput = (await ask('  Memory enabled? (yes/no, default: yes): ')) || 'yes';
  config.memoryEnabled = memoryInput.toLowerCase() === 'yes';

  const proactiveInput = (await ask('  Proactive mode? (yes/no, default: no): ')) || 'no';
  config.proactiveMode = proactiveInput.toLowerCase() === 'yes';

  const cronInput = (await ask('  Cron jobs enabled? (yes/no, default: no): ')) || 'no';
  config.cronEnabled = cronInput.toLowerCase() === 'yes';

  // ─── GENERATE OUTPUT ───
  console.log('\n' + '━'.repeat(60));
  console.log('  🔨 GENERATING CLAWBOT WORKSPACE');
  console.log('━'.repeat(60) + '\n');

  const outputDir = join(ROOT, 'builds', 'claws', config.botSlug);
  mkdirSync(join(outputDir, 'agents'), { recursive: true });
  mkdirSync(join(outputDir, 'tasks'), { recursive: true });
  mkdirSync(join(outputDir, 'memory'), { recursive: true });
  mkdirSync(join(outputDir, 'config'), { recursive: true });
  mkdirSync(join(outputDir, 'src', 'skills'), { recursive: true });
  mkdirSync(join(outputDir, 'artifacts'), { recursive: true });

  const replacements = {
    BOT_NAME: config.botName,
    BOT_SLUG: config.botSlug,
    BOT_DESCRIPTION: config.botDescription,
    BOT_TAGLINE: config.botTagline,
    BOT_AVATAR_URL: config.botAvatar || '(not set)',
    PERSONALITY_TRAITS: config.personalityTraits.split(',').map((t) => `- ${t.trim()}`).join('\n'),
    COMMUNICATION_STYLE: config.communicationStyle,
    PRIMARY_LANGUAGE: config.language,
    EMOJI_PREFERENCE: config.emojiPreference,
    CUSTOM_PREAMBLE: config.customPreamble || '(none)',
    USER_CONTEXT: config.userContext || '(not provided)',
    RESPONSE_LENGTH_PREF: config.responseLengthPref,
    TECHNICAL_LEVEL: config.technicalLevel,
    NOTIFICATION_PREF: 'as-needed',
    ACTIVE_PLATFORMS: config.platforms.map((p) => `- ${p}`).join('\n'),
    BUILTIN_SKILLS_LIST: config.skills.map((s) => `- ${s}`).join('\n'),
    CUSTOM_SKILLS_LIST: '_(none configured yet)_',
    PLATFORM_INTEGRATIONS: config.platforms.map((p) => `- ${p}: configured`).join('\n'),
    MODEL_PROVIDER: config.modelProvider,
    MEMORY_ENABLED: config.memoryEnabled ? 'Enabled' : 'Disabled',
    PROACTIVE_MODE: config.proactiveMode ? 'Enabled' : 'Disabled',
    CRON_ENABLED: config.cronEnabled ? 'Enabled' : 'Disabled',
    SCOUT_STATUS: config.scoutEnabled ? 'active' : 'disabled',
    BUILDER_STATUS: config.builderEnabled ? 'active' : 'disabled',
    WATCHER_STATUS: config.watcherEnabled ? 'active' : 'disabled',
    SCOUT_STATUS_ICON: config.scoutEnabled ? '🟢' : '⚫',
    BUILDER_STATUS_ICON: config.builderEnabled ? '🟢' : '⚫',
    WATCHER_STATUS_ICON: config.watcherEnabled ? '🟢' : '⚫',
    TOKEN_CHAIN: config.tokenChain || 'none',
    TOKEN_NAME: config.tokenName || '(no token)',
    TOKEN_SYMBOL: config.tokenSymbol || '—',
    TOKEN_ADDRESS: '(pending launch)',
    TOKEN_EXPLORER_URL: '(pending launch)',
    CREATOR_WALLET: config.creatorWallet || '(not set)',
    CREATED_AT: new Date().toISOString(),
    LAST_BOOT: '(not yet booted)',
    CAPABILITIES_SUMMARY: config.skills.slice(0, 5).join(', ') + (config.skills.length > 5 ? `, and ${config.skills.length - 5} more` : ''),
    TOKEN_GREETING: config.tokenLaunch ? `I also have an onchain presence via $${config.tokenSymbol} on ${config.tokenChain}.` : '',
  };

  // Write workspace files
  const templateFiles = [
    ['SOUL.md', 'SOUL.md'],
    ['IDENTITY.md', 'IDENTITY.md'],
    ['AGENTS.md', 'AGENTS.md'],
    ['USER.md', 'USER.md'],
    ['TOOLS.md', 'TOOLS.md'],
    ['MEMORY.md', 'MEMORY.md'],
    ['HEARTBEAT.md', 'HEARTBEAT.md'],
    ['BOOTSTRAP.md', 'BOOTSTRAP.md'],
    ['agents/registry.json', 'agents/registry.json'],
    ['agents/state.json', 'agents/state.json'],
    ['agents/queue.json', 'agents/queue.json'],
    ['agents/WORKING.md', 'agents/WORKING.md'],
    ['tasks/todo.md', 'tasks/todo.md'],
    ['tasks/lessons.md', 'tasks/lessons.md'],
  ];

  for (const [templateName, outputName] of templateFiles) {
    const template = readTemplate(templateName);
    if (template) {
      const content = applyReplacements(template, replacements);
      writeOutput(outputDir, outputName, content);
    }
  }

  // Create .gitkeep in memory
  writeOutput(outputDir, 'memory/.gitkeep', '');

  // Write .env.example
  let envContent = `# ${config.botName} — Environment Variables\n\n`;
  envContent += `# AI Model\n`;
  if (config.modelProvider === 'claude') {
    envContent += `ANTHROPIC_API_KEY=your-anthropic-api-key\n`;
  } else if (config.modelProvider === 'openai') {
    envContent += `OPENAI_API_KEY=your-openai-api-key\n`;
  }
  envContent += `\n# Platforms\n`;
  for (const platform of config.platforms) {
    envContent += `${platform.toUpperCase()}_API_KEY=your-${platform}-api-key\n`;
    envContent += `${platform.toUpperCase()}_API_SECRET=your-${platform}-api-secret\n`;
  }
  if (config.tokenLaunch) {
    envContent += `\n# Token Launch (${config.tokenChain})\n`;
    if (config.tokenChain === 'solana') {
      envContent += `BAGS_API_KEY=your-bags-api-key\n`;
      envContent += `SOLANA_RPC_URL=https://api.mainnet-beta.solana.com\n`;
      envContent += `CREATOR_WALLET_ADDRESS=${config.creatorWallet}\n`;
    } else {
      envContent += `CLANKER_API_KEY=your-clanker-api-key\n`;
      envContent += `ADMIN_WALLET_ADDRESS=${config.creatorWallet}\n`;
    }
  }
  writeOutput(outputDir, '.env.example', envContent);

  // Write config.json (machine-readable config)
  const configJson = {
    name: config.botName,
    slug: config.botSlug,
    description: config.botDescription,
    personality: {
      traits: config.personalityTraits.split(',').map((t) => t.trim()),
      communicationStyle: config.communicationStyle,
      language: config.language,
      emojiPreference: config.emojiPreference,
      customPreamble: config.customPreamble || null,
    },
    platforms: config.platforms,
    skills: config.skills,
    modelProvider: config.modelProvider,
    subAgents: {
      scout: config.scoutEnabled,
      builder: config.builderEnabled,
      watcher: config.watcherEnabled,
    },
    token: config.tokenLaunch
      ? {
          chain: config.tokenChain,
          name: config.tokenName,
          symbol: config.tokenSymbol,
          description: config.tokenDescription,
          image: config.tokenImage || null,
          wallet: config.creatorWallet,
        }
      : null,
    memory: config.memoryEnabled,
    proactiveMode: config.proactiveMode,
    cronJobs: config.cronEnabled,
    createdAt: new Date().toISOString(),
    pipelineVersion: '1.0.0',
  };
  writeOutput(outputDir, 'config.json', JSON.stringify(configJson, null, 2));

  console.log('\n' + '━'.repeat(60));
  console.log(`  ✅ Clawbot workspace created: builds/claws/${config.botSlug}/`);
  console.log('━'.repeat(60));

  if (config.tokenLaunch) {
    console.log(`\n  🪙 Token launch configured for ${config.tokenChain}`);
    console.log(`     Run: node scripts/launch-token.mjs --slug ${config.botSlug}`);
  }

  console.log(`\n  📋 Next steps:`);
  console.log(`     1. cd builds/claws/${config.botSlug}/`);
  console.log(`     2. cp .env.example .env`);
  console.log(`     3. Fill in API keys in .env`);
  if (config.tokenLaunch) {
    console.log(`     4. node ../../scripts/launch-token.mjs --slug ${config.botSlug}`);
    console.log(`     5. npm install && npm start`);
  } else {
    console.log(`     4. npm install && npm start`);
  }
  console.log('');

  rl.close();
}

main().catch((err) => {
  console.error(`\nFatal error: ${err.message}`);
  process.exit(1);
});
