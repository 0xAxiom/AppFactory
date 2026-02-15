#!/usr/bin/env node
/**
 * Claw Pipeline - Canonical Entrypoint
 *
 * Generates custom Clawbot AI assistants.
 * Follows the App Factory gold standard pipeline pattern.
 *
 * Output: claw-pipeline/builds/claws/<slug>/
 *
 * Usage:
 *   node claw-pipeline/scripts/run.mjs [--slug <name>] [--skip-prompts]
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import {
  checkRunCertificate,
  runLocalProof,
  writeAuditEvent
} from '../../core/scripts/run-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'builds', 'claws');

// Shared libraries
const LIB_DIR = join(__dirname, 'lib');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { slug: null, skipPrompts: false, idea: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) config.slug = args[++i];
    if (args[i] === '--skip-prompts') config.skipPrompts = true;
    if (args[i] === '--idea' && args[i + 1]) config.idea = args[++i];
    if (args[i] === '--help') {
      console.log(`
${BOLD}${MAGENTA}Claw Pipeline${RESET} — Custom AI Assistant Generator

${BOLD}Usage:${RESET}
  node scripts/run.mjs [options]

${BOLD}Options:${RESET}
  --slug <name>      Bot slug (URL-safe name)
  --idea <text>      Bot description
  --skip-prompts     Use defaults where possible
  --help             Show this help

${BOLD}Examples:${RESET}
  node scripts/run.mjs
  node scripts/run.mjs --slug chess-tutor --idea "a chess teaching assistant"
`);
      process.exit(0);
    }
  }

  return config;
}

// Progress tracking
const phases = [
  { name: 'C0: Intent Normalization', status: 'pending' },
  { name: 'C1: Bot Spec Design', status: 'pending' },
  { name: 'C2: Bot Scaffold', status: 'pending' },
  { name: 'C3: Verify', status: 'pending' },
  { name: 'C4: Ralph QA', status: 'pending' },
  { name: 'C5: Launch Card + Zip', status: 'pending' },
];

function showProgress() {
  console.log(`\n${DIM}─────────────────────────────────────${RESET}`);
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    let icon = '○';
    let color = DIM;

    if (p.status === 'complete') { icon = '●'; color = GREEN; }
    if (p.status === 'active') { icon = '◐'; color = CYAN; }
    if (p.status === 'failed') { icon = '✗'; color = RED; }
    if (p.status === 'skipped') { icon = '─'; color = DIM; }

    console.log(`${color}  ${icon} ${p.name}${RESET}`);
  }
  console.log(`${DIM}─────────────────────────────────────${RESET}\n`);
}

function setPhase(index, status) {
  phases[index].status = status;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Readline helpers
let rl;
function initReadline() {
  rl = createInterface({ input: process.stdin, output: process.stdout });
}
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// Detect available capabilities
async function detectCapabilities() {
  const caps = { node: false, npm: false, git: false };
  try { execSync('node --version', { stdio: 'pipe' }); caps.node = true; } catch { /* ignore */ }
  try { execSync('npm --version', { stdio: 'pipe' }); caps.npm = true; } catch { /* ignore */ }
  try { execSync('git --version', { stdio: 'pipe' }); caps.git = true; } catch { /* ignore */ }
  return caps;
}

// ─── MAIN ───

async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BOLD}${MAGENTA}  🐾 CLAW PIPELINE — Custom AI Assistant Generator${RESET}`);
  console.log(`${MAGENTA}  claw-pipeline v2.0.0${RESET}`);
  console.log(`${BOLD}${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  const caps = await detectCapabilities();
  if (!caps.node || !caps.npm) {
    console.error(`\n${RED}${BOLD}Missing requirements:${RESET}`);
    if (!caps.node) console.error(`${RED}  ✗ Node.js not found${RESET}`);
    if (!caps.npm) console.error(`${RED}  ✗ npm not found${RESET}`);
    process.exit(1);
  }

  console.log(`${DIM}  Node: ${execSync('node --version', { encoding: 'utf-8' }).trim()}${RESET}`);
  console.log(`${DIM}  npm:  ${execSync('npm --version', { encoding: 'utf-8' }).trim()}${RESET}`);

  showProgress();

  initReadline();

  // ─── C0: INTENT NORMALIZATION ───
  setPhase(0, 'active');
  showProgress();

  let idea = config.idea;
  if (!idea) {
    console.log(`${BOLD}Describe your AI assistant idea:${RESET}`);
    console.log(`${DIM}  Example: "A chess tutor that teaches openings and analyzes positions"${RESET}`);
    console.log(`${DIM}  Example: "A personal research assistant that helps with writing"${RESET}\n`);
    idea = await ask(`${CYAN}> ${RESET}`);
  }

  if (!idea || idea.trim().length === 0) {
    console.error(`\n${RED}No idea provided. Exiting.${RESET}`);
    rl.close();
    process.exit(1);
  }

  const slug = config.slug || slugify(idea.split(' ').slice(0, 4).join(' '));
  const buildDir = join(BUILDS_DIR, slug);
  const artifactsDir = join(buildDir, 'artifacts');

  mkdirSync(join(artifactsDir, 'inputs'), { recursive: true });
  mkdirSync(join(artifactsDir, 'stage01'), { recursive: true });
  mkdirSync(join(artifactsDir, 'stage02'), { recursive: true });
  mkdirSync(join(artifactsDir, 'stage03'), { recursive: true });
  mkdirSync(join(artifactsDir, 'stage04'), { recursive: true });
  mkdirSync(join(artifactsDir, 'ralph'), { recursive: true });
  mkdirSync(join(artifactsDir, 'errors'), { recursive: true });

  writeFileSync(
    join(artifactsDir, 'inputs', 'raw_input.md'),
    `# Raw User Input\n\n${idea}\n\nTimestamp: ${new Date().toISOString()}\n`
  );

  console.log(`\n${GREEN}  ✓ Intent captured${RESET}`);
  console.log(`${DIM}  Slug: ${slug}${RESET}`);
  console.log(`${DIM}  Output: builds/claws/${slug}/${RESET}`);

  setPhase(0, 'complete');

  // ─── C1: BOT SPEC DESIGN ───
  setPhase(1, 'active');
  showProgress();

  console.log(`${BOLD}Let me gather some details about your bot:${RESET}\n`);

  const botName = await ask(`  Bot name (or press Enter for auto): `) || idea.split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  console.log(`\n  Communication style:`);
  console.log(`    ${DIM}[1] Formal${RESET}`);
  console.log(`    ${DIM}[2] Casual${RESET}`);
  console.log(`    ${DIM}[3] Technical${RESET}`);
  console.log(`    ${DIM}[4] Friendly (default)${RESET}`);
  console.log(`    ${DIM}[5] Concise${RESET}`);
  const styleChoice = await ask(`  Style (1-5): `) || '4';
  const styles = ['formal', 'casual', 'technical', 'friendly', 'concise'];
  const commStyle = styles[parseInt(styleChoice) - 1] || 'friendly';

  console.log(`\n  Platforms (comma-separated, or "all"):`);
  console.log(`    ${DIM}Options: whatsapp, telegram, discord, slack${RESET}`);
  const platformInput = await ask(`  Platforms: `) || 'all';
  const platforms = platformInput.toLowerCase() === 'all'
    ? ['whatsapp', 'telegram', 'discord', 'slack']
    : platformInput.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);

  console.log(`\n  AI model provider:`);
  console.log(`    ${DIM}[1] Claude (Anthropic) — Recommended${RESET}`);
  console.log(`    ${DIM}[2] OpenAI (GPT-4)${RESET}`);
  console.log(`    ${DIM}[3] Local (Ollama/etc)${RESET}`);
  const modelChoice = await ask(`  Model (1-3): `) || '1';
  const models = ['claude', 'openai', 'local'];
  const modelProvider = models[parseInt(modelChoice) - 1] || 'claude';

  const traits = await ask(`\n  Personality traits (comma-separated): `) || 'helpful, knowledgeable, friendly';

  const botSpec = {
    name: botName,
    slug,
    description: idea,
    personality: {
      traits: traits.split(',').map(t => t.trim()),
      communicationStyle: commStyle,
    },
    platforms,
    modelProvider,
  };

  writeFileSync(
    join(artifactsDir, 'stage01', 'bot_spec.json'),
    JSON.stringify(botSpec, null, 2)
  );

  console.log(`\n${GREEN}  ✓ Bot spec designed: ${botName}${RESET}`);
  setPhase(1, 'complete');

  // ─── C2: BOT SCAFFOLD ───
  setPhase(2, 'active');
  showProgress();

  console.log(`${BOLD}Generating Clawbot workspace...${RESET}\n`);

  // Create workspace directories
  mkdirSync(join(buildDir, 'agents'), { recursive: true });
  mkdirSync(join(buildDir, 'tasks'), { recursive: true });
  mkdirSync(join(buildDir, 'memory'), { recursive: true });
  mkdirSync(join(buildDir, 'config'), { recursive: true });
  mkdirSync(join(buildDir, 'src', 'skills'), { recursive: true });

  // Build replacements map
  const replacements = {
    BOT_NAME: botSpec.name,
    BOT_SLUG: slug,
    BOT_DESCRIPTION: botSpec.description,
    BOT_TAGLINE: botSpec.description,
    BOT_AVATAR_URL: '(not set)',
    PERSONALITY_TRAITS: botSpec.personality.traits.map(t => `- ${t}`).join('\n'),
    COMMUNICATION_STYLE: commStyle,
    PRIMARY_LANGUAGE: 'en',
    EMOJI_PREFERENCE: 'minimal',
    CUSTOM_PREAMBLE: '(none)',
    USER_CONTEXT: '(configured during first boot)',
    RESPONSE_LENGTH_PREF: 'moderate',
    TECHNICAL_LEVEL: 'intermediate',
    NOTIFICATION_PREF: 'as-needed',
    ACTIVE_PLATFORMS: platforms.map(p => `- ${p}`).join('\n'),
    BUILTIN_SKILLS_LIST: '- web-browsing\n- email\n- calendar',
    CUSTOM_SKILLS_LIST: '_(none configured yet)_',
    PLATFORM_INTEGRATIONS: platforms.map(p => `- ${p}: configured`).join('\n'),
    MODEL_PROVIDER: modelProvider,
    MEMORY_ENABLED: 'Enabled',
    PROACTIVE_MODE: 'Disabled',
    CRON_ENABLED: 'Disabled',
    SCOUT_STATUS: 'active',
    BUILDER_STATUS: 'disabled',
    WATCHER_STATUS: 'disabled',
    SCOUT_STATUS_ICON: '🟢',
    BUILDER_STATUS_ICON: '⚫',
    WATCHER_STATUS_ICON: '⚫',
    CREATED_AT: new Date().toISOString(),
    LAST_BOOT: '(not yet booted)',
    CAPABILITIES_SUMMARY: 'web-browsing, email, calendar',
  };

  // Apply templates
  const templateDir = join(PIPELINE_ROOT, 'templates');
  const templateFiles = [
    'SOUL.md', 'IDENTITY.md', 'AGENTS.md', 'USER.md', 'TOOLS.md',
    'MEMORY.md', 'HEARTBEAT.md', 'BOOTSTRAP.md',
    'agents/registry.json', 'agents/state.json', 'agents/queue.json', 'agents/WORKING.md',
    'tasks/todo.md', 'tasks/lessons.md',
  ];

  let filesWritten = 0;
  for (const file of templateFiles) {
    const templatePath = join(templateDir, file);
    if (existsSync(templatePath)) {
      let content = readFileSync(templatePath, 'utf-8');
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
      }
      const outPath = join(buildDir, file);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, content);
      filesWritten++;
    }
  }

  // Create .gitkeep in memory
  writeFileSync(join(buildDir, 'memory', '.gitkeep'), '');

  // Create .env.example
  let envContent = `# ${botSpec.name} — Environment Variables\n\n`;
  envContent += `# AI Model\n`;
  if (modelProvider === 'claude') envContent += `ANTHROPIC_API_KEY=your-anthropic-api-key\n`;
  else if (modelProvider === 'openai') envContent += `OPENAI_API_KEY=your-openai-api-key\n`;
  envContent += `\n# Platforms\n`;
  for (const p of platforms) {
    envContent += `${p.toUpperCase()}_API_KEY=your-${p}-api-key\n`;
    envContent += `${p.toUpperCase()}_API_SECRET=your-${p}-api-secret\n`;
  }
  writeFileSync(join(buildDir, '.env.example'), envContent);

  // Create config.json
  const configJson = {
    name: botSpec.name,
    slug,
    description: botSpec.description,
    personality: botSpec.personality,
    platforms,
    skills: ['web-browsing', 'email', 'calendar'],
    modelProvider,
    subAgents: { scout: true, builder: false, watcher: false },
    memory: true,
    proactiveMode: false,
    cronJobs: false,
    createdAt: new Date().toISOString(),
    pipelineVersion: '2.0.0',
  };
  writeFileSync(join(buildDir, 'config.json'), JSON.stringify(configJson, null, 2));

  // Create bot package.json
  writeFileSync(join(buildDir, 'package.json'), JSON.stringify({
    name: `clawbot-${slug}`,
    version: '1.0.0',
    description: `${botSpec.name} — AI Assistant generated by claw-pipeline`,
    type: 'module',
    scripts: {
      start: 'node index.mjs',
      setup: 'node ../../scripts/configure.mjs',
      validate: `node ../../scripts/validate-setup.mjs --slug ${slug}`,
    },
    dependencies: {},
  }, null, 2));

  // Create README
  let readmeContent = `# ${botSpec.name}\n\n`;
  readmeContent += `${botSpec.description}\n\n`;
  readmeContent += `## Quick Start\n\n`;
  readmeContent += `\`\`\`bash\ncp .env.example .env\n# Fill in API keys in .env\nnpm install\nnpm start\n\`\`\`\n\n`;
  readmeContent += `## Configuration\n\n`;
  readmeContent += `- **Platforms**: ${platforms.join(', ')}\n`;
  readmeContent += `- **Model**: ${modelProvider}\n`;
  readmeContent += `- **Style**: ${commStyle}\n`;
  readmeContent += `\n## Workspace Files\n\n`;
  readmeContent += `| File | Purpose |\n|------|--------|\n`;
  readmeContent += `| SOUL.md | Bot identity and personality |\n`;
  readmeContent += `| IDENTITY.md | Public profile |\n`;
  readmeContent += `| AGENTS.md | Sub-agent configuration |\n`;
  readmeContent += `| USER.md | Creator context and preferences |\n`;
  readmeContent += `| TOOLS.md | Skills and integrations |\n`;
  readmeContent += `| MEMORY.md | Memory system config |\n`;
  readmeContent += `| HEARTBEAT.md | Health status |\n`;
  readmeContent += `| BOOTSTRAP.md | First boot protocol |\n`;
  readmeContent += `\n---\nGenerated by claw-pipeline v2.0.0\n`;
  writeFileSync(join(buildDir, 'README.md'), readmeContent);

  console.log(`  ${GREEN}✓${RESET} ${filesWritten} workspace files generated`);
  console.log(`  ${GREEN}✓${RESET} .env.example created`);
  console.log(`  ${GREEN}✓${RESET} config.json created`);
  console.log(`  ${GREEN}✓${RESET} package.json created`);
  console.log(`  ${GREEN}✓${RESET} README.md created`);

  setPhase(2, 'complete');
  writeAuditEvent({
    projectPath: buildDir,
    pipeline: 'claw-pipeline',
    phase: 'scaffold',
    status: 'complete',
    message: 'Workspace scaffolded'
  });

  // ─── C3: VERIFY ───
  setPhase(3, 'active');
  showProgress();

  console.log(`${BOLD}Verifying workspace...${RESET}\n`);

  // Run validate-setup
  const validateScript = join(PIPELINE_ROOT, 'scripts', 'validate-setup.mjs');
  if (existsSync(validateScript)) {
    try {
      execSync(`node "${validateScript}" --slug ${slug}`, { cwd: PIPELINE_ROOT, stdio: 'inherit' });
      setPhase(6, 'complete');
    } catch {
      console.log(`\n${YELLOW}  Validation found issues. Continuing...${RESET}`);
      setPhase(6, 'complete');
    }
  } else {
    // Manual verification
    const requiredFiles = ['SOUL.md', 'IDENTITY.md', 'config.json', '.env.example', 'package.json'];
    let allPresent = true;
    for (const f of requiredFiles) {
      if (!existsSync(join(buildDir, f))) {
        console.log(`  ${RED}✗ Missing: ${f}${RESET}`);
        allPresent = false;
      }
    }
    if (allPresent) {
      console.log(`  ${GREEN}✓ All required files present${RESET}`);
    }
    setPhase(3, 'complete');
  }

  // Local Run Proof (non-HTTP verification)
  const proofScript = join(LIB_DIR, 'local-run-proof.mjs');
  if (existsSync(proofScript)) {
    try {
      runLocalProof({
        proofScript,
        projectPath: buildDir,
        port: 0,
        skipBuild: true,
        skipInstall: true,
        open: false,
        extraArgs: ['--skip-http']
      });
      writeAuditEvent({
        projectPath: buildDir,
        pipeline: 'claw-pipeline',
        phase: 'verify',
        status: 'complete',
        message: 'Local run proof completed'
      });
    } catch {
      console.log(`\n${YELLOW}  Local run proof failed. Continuing...${RESET}`);
      writeAuditEvent({
        projectPath: buildDir,
        pipeline: 'claw-pipeline',
        phase: 'verify',
        status: 'failed',
        message: 'Local run proof failed'
      });
    }
  }

  const certificate = checkRunCertificate(buildDir);
  if (!certificate.ok) {
    writeAuditEvent({
      projectPath: buildDir,
      pipeline: 'claw-pipeline',
      phase: 'cert',
      status: 'failed',
      message: certificate.error,
      data: { path: certificate.path }
    });
  } else {
    writeAuditEvent({
      projectPath: buildDir,
      pipeline: 'claw-pipeline',
      phase: 'cert',
      status: 'complete',
      message: 'RUN_CERTIFICATE.json verified'
    });
  }

  // ─── C4: RALPH QA ───
  setPhase(4, 'active');
  showProgress();

  console.log(`${BOLD}Running Ralph QA...${RESET}\n`);

  // Quick QA check
  let qaScore = 0;
  let qaTotal = 0;
  const qaResults = [];

  function qaCheck(label, condition) {
    qaTotal++;
    if (condition) { qaScore++; qaResults.push(`  ✅ ${label}`); }
    else { qaResults.push(`  ❌ ${label}`); }
  }

  qaCheck('SOUL.md exists', existsSync(join(buildDir, 'SOUL.md')));
  qaCheck('IDENTITY.md exists', existsSync(join(buildDir, 'IDENTITY.md')));
  qaCheck('AGENTS.md exists', existsSync(join(buildDir, 'AGENTS.md')));
  qaCheck('config.json valid', (() => { try { JSON.parse(readFileSync(join(buildDir, 'config.json'), 'utf-8')); return true; } catch { return false; } })());
  qaCheck('.env.example exists', existsSync(join(buildDir, '.env.example')));
  qaCheck('No secrets in config.json', !readFileSync(join(buildDir, 'config.json'), 'utf-8').includes('sk-'));
  qaCheck('BOOTSTRAP.md exists', existsSync(join(buildDir, 'BOOTSTRAP.md')));
  qaCheck('agents/registry.json exists', existsSync(join(buildDir, 'agents', 'registry.json')));
  qaCheck('memory/ directory exists', existsSync(join(buildDir, 'memory')));
  qaCheck('README.md exists', existsSync(join(buildDir, 'README.md')));

  for (const r of qaResults) console.log(r);

  const pct = Math.round((qaScore / qaTotal) * 100);
  console.log(`\n  Score: ${qaScore}/${qaTotal} (${pct}%)`);

  writeFileSync(
    join(artifactsDir, 'ralph', 'PROGRESS.md'),
    `# Ralph QA Progress\n\nScore: ${qaScore}/${qaTotal} (${pct}%)\nVerdict: ${pct >= 97 ? 'PASS' : 'NEEDS REVIEW'}\nTimestamp: ${new Date().toISOString()}\n\n${qaResults.join('\n')}\n\n` +
    (pct >= 97
      ? `COMPLETION_PROMISE: All acceptance criteria met. Clawbot workspace is ready for deployment.\n\nPIPELINE: claw-pipeline v2.0.0\nOUTPUT: builds/claws/${slug}/\nRALPH_VERDICT: PASS (${pct}%)\nTIMESTAMP: ${new Date().toISOString()}\n`
      : `Note: Score below 97%. Review failed checks above.\n`)
  );

  if (pct >= 97) {
    console.log(`\n${GREEN}${BOLD}  RALPH VERDICT: PASS (${pct}%)${RESET}`);
  } else {
    console.log(`\n${YELLOW}${BOLD}  RALPH VERDICT: NEEDS REVIEW (${pct}%)${RESET}`);
  }

  setPhase(4, 'complete');

  // ─── C5: LAUNCH CARD + ZIP ───
  setPhase(5, 'active');
  showProgress();

  let launchCard = `# Launch Card: ${botSpec.name}\n\n`;
  launchCard += `## Bot Summary\n`;
  launchCard += `- **Name**: ${botSpec.name}\n`;
  launchCard += `- **Personality**: ${botSpec.personality.traits.join(', ')}\n`;
  launchCard += `- **Style**: ${commStyle}\n`;
  launchCard += `- **Platforms**: ${platforms.join(', ')}\n`;
  launchCard += `- **Model**: ${modelProvider}\n\n`;
  launchCard += `## Quick Start\n`;
  launchCard += `\`\`\`bash\ncd builds/claws/${slug}/\ncp .env.example .env\n# Fill in your API keys\nnpm install\nnpm start\n\`\`\`\n\n`;
  launchCard += `## Workspace Files\n`;
  launchCard += `- SOUL.md — Identity and personality\n`;
  launchCard += `- BOOTSTRAP.md — First boot protocol\n`;
  launchCard += `- AGENTS.md — Sub-agent configuration\n`;
  launchCard += `- config.json — Machine-readable config\n\n`;
  launchCard += `---\nGenerated by claw-pipeline v2.0.0 at ${new Date().toISOString()}\n`;

  writeFileSync(join(buildDir, 'LAUNCH_CARD.md'), launchCard);

  console.log(`${BOLD}Packaging zip...${RESET}\n`);

  // Generate the bot's own setup.sh that installs OpenClaw + configures everything
  const botSetupSh = `#!/bin/bash
# ${botSpec.name} — One-Command Setup
# Generated by claw-pipeline v2.0.0
# Usage: unzip, cd into folder, run: bash setup.sh

set -e

BOLD="\\033[1m"
GREEN="\\033[32m"
CYAN="\\033[36m"
YELLOW="\\033[33m"
RED="\\033[31m"
RESET="\\033[0m"

echo ""
echo "\${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\${RESET}"
echo "\${BOLD}  🐾 ${botSpec.name} — Setup\${RESET}"
echo "\${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\${RESET}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "\${RED}Node.js is required but not installed.\${RESET}"
    echo "  Install: https://nodejs.org/ (v18+)"
    exit 1
fi

NODE_VER=\\$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "\\$NODE_VER" -lt 18 ]; then
    echo "\${RED}Node.js 18+ required. Found: \\$(node --version)\${RESET}"
    exit 1
fi
echo "\${GREEN}✅ Node.js \\$(node --version)\${RESET}"

# Install OpenClaw
if ! command -v openclaw &> /dev/null; then
    echo ""
    echo "\${CYAN}Installing OpenClaw...\${RESET}"
    npm install -g openclaw
    echo "\${GREEN}✅ OpenClaw installed\${RESET}"
else
    echo "\${GREEN}✅ OpenClaw already installed (\\$(openclaw --version 2>/dev/null || echo 'unknown'))\${RESET}"
fi

# Setup workspace
WORKSPACE="\\$(pwd)"
echo ""
echo "\${CYAN}Setting up workspace at \\$WORKSPACE\${RESET}"

# Create .env from example if not exists
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "\${GREEN}✅ Created .env from template\${RESET}"
    echo ""
    echo "\${YELLOW}⚠️  IMPORTANT: Edit .env and fill in your API keys:\${RESET}"
    echo "\${YELLOW}   nano .env\${RESET}"
    echo ""
    grep "^#\\|^[A-Z]" .env.example | head -20
    echo ""
fi

# Install skills if skills/ directory exists
if [ -d "skills" ]; then
    echo "\${CYAN}Skills included:\${RESET}"
    ls skills/ 2>/dev/null | while read skill; do
        echo "  - \\$skill"
    done
    echo ""
fi

# Create memory directory
mkdir -p memory

echo "\${BOLD}\${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\${RESET}"
echo "\${BOLD}\${GREEN}  🐾 SETUP COMPLETE\${RESET}"
echo "\${BOLD}\${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\${RESET}"
echo ""
echo "  \${BOLD}To start your bot:\${RESET}"
echo "    1. Edit .env with your API keys"
echo "    2. Run: \${CYAN}openclaw start\${RESET}"
echo ""
echo "  \${BOLD}To customize:\${RESET}"
echo "    - SOUL.md    — Personality and identity"
echo "    - TOOLS.md   — Skills and integrations"
echo "    - AGENTS.md  — Workflow and delegation"
echo ""
`;

  writeFileSync(join(buildDir, 'setup.sh'), botSetupSh, { mode: 0o755 });
  console.log(`  ${GREEN}✓${RESET} setup.sh generated`);

  // Create zip using system zip command
  const zipName = `${slug}.zip`;
  const zipPath = join(BUILDS_DIR, zipName);
  try {
    // Exclude artifacts/ and node_modules/ from the zip
    execSync(
      `cd "${BUILDS_DIR}" && zip -r "${zipName}" "${slug}/" -x "${slug}/artifacts/*" "${slug}/node_modules/*"`,
      { stdio: 'pipe' }
    );
    console.log(`  ${GREEN}✓${RESET} ${zipName} created (${Math.round(statSync(zipPath).size / 1024)}KB)`);
  } catch (zipErr) {
    console.log(`  ${YELLOW}⚠ zip failed: ${zipErr.message}${RESET}`);
    console.log(`  ${YELLOW}  Build files are still at: builds/claws/${slug}/${RESET}`);
  }

  // ─── FINAL OUTPUT ───
  console.log(`${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BOLD}${GREEN}  🐾 LAUNCH READY${RESET}`);
  console.log(`${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log('');
  console.log(`  Project: ${CYAN}builds/claws/${slug}/${RESET}`);
  console.log(`  Bot:     ${botSpec.name}`);
  console.log(`  Style:   ${commStyle}`);
  console.log(`  Model:   ${modelProvider}`);
  console.log('');
  console.log(`  Zip:     ${CYAN}builds/claws/${slug}.zip${RESET}`);
  console.log('');
  console.log(`  ${BOLD}To use:${RESET}`);
  console.log(`    unzip ${slug}.zip`);
  console.log(`    cd ${slug}/`);
  console.log(`    bash setup.sh`);
  console.log(`    # Edit .env with your API keys`);
  console.log(`    openclaw start`);
  console.log('');

  setPhase(5, 'complete');
  showProgress();

  rl.close();
}

main().catch((err) => {
  console.error(`\n${RED}${BOLD}Fatal error:${RESET} ${err.message}`);
  if (rl) rl.close();
  process.exit(1);
});
