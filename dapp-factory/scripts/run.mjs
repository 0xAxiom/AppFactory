#!/usr/bin/env node
/**
 * dApp Factory - Canonical Entrypoint
 *
 * Generates decentralized applications (dApps) with blockchain integration.
 * Follows the website-pipeline gold standard pattern.
 *
 * Output: dapp-factory/dapp-builds/<slug>/
 *
 * Usage:
 *   node dapp-factory/scripts/run.mjs [--slug <name>] [--skip-prompts]
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  checkRunCertificate,
  copyTemplate,
  ensureDir,
  runLocalProof,
  writeAuditEvent
} from '../../core/scripts/run-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PIPELINE_ROOT, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'dapp-builds');
const TEMPLATE_ROOT = join(REPO_ROOT, 'templates', 'dapp');

// Shared libraries
const LIB_DIR = join(__dirname, 'lib');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { slug: null, skipPrompts: false, port: 3000 };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) config.slug = args[++i];
    if (args[i] === '--skip-prompts') config.skipPrompts = true;
    if (args[i] === '--port' && args[i + 1]) config.port = parseInt(args[++i], 10);
  }

  return config;
}

// State
const state = {
  dappType: null,
  chain: null,
  features: []
};

// Progress tracking
const phases = [
  { name: 'Inputs', status: 'pending' },
  { name: 'Scaffold', status: 'pending' },
  { name: 'Install', status: 'pending' },
  { name: 'Verify', status: 'pending' },
  { name: 'Launch', status: 'pending' }
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

    console.log(`${color}${icon} ${p.name}${RESET}`);
  }
  console.log(`${DIM}─────────────────────────────────────${RESET}\n`);
}

function setPhase(index, status) {
  phases[index].status = status;
}

// (Run certificate validation uses shared core helper)

// Readline helper
function ask(question, options = null) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (options) {
      console.log(question);
      options.forEach((opt, i) => console.log(`  ${CYAN}${i + 1}${RESET}. ${opt.label}`));

      rl.question(`\nChoice (1-${options.length}): `, (answer) => {
        rl.close();
        const idx = parseInt(answer, 10) - 1;
        resolve(options[Math.max(0, Math.min(idx, options.length - 1))]);
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

// Phase 1: Gather inputs
async function gatherInputs(skipPrompts) {
  setPhase(0, 'active');
  showProgress();

  if (skipPrompts) {
    state.dappType = { value: 'defi', label: 'DeFi Dashboard' };
    state.chain = { value: 'base', label: 'Base (L2)' };
    state.features = ['wallet'];
    console.log('Using defaults: DeFi Dashboard, Base chain, Wallet connect\n');
    setPhase(0, 'complete');
    return;
  }

  // Q1: dApp type
  state.dappType = await ask('What type of dApp?', [
    { value: 'defi', label: 'DeFi Dashboard' },
    { value: 'nft', label: 'NFT Marketplace' },
    { value: 'dao', label: 'DAO Governance' },
    { value: 'token', label: 'Token Interface' }
  ]);
  console.log(`${GREEN}→ ${state.dappType.label}${RESET}\n`);

  // Q2: Chain
  state.chain = await ask('Target blockchain?', [
    { value: 'base', label: 'Base (L2)' },
    { value: 'ethereum', label: 'Ethereum Mainnet' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'arbitrum', label: 'Arbitrum' }
  ]);
  console.log(`${GREEN}→ ${state.chain.label}${RESET}\n`);

  // Q3: Wallet connect
  const wallet = await ask('Include wallet connection? (y/n): ');
  if (wallet.toLowerCase().startsWith('y')) {
    state.features.push('wallet');
    console.log(`${GREEN}→ Wallet connect enabled${RESET}\n`);
  }

  setPhase(0, 'complete');
}

// Phase 2: Scaffold project
function scaffoldProject(slug) {
  setPhase(1, 'active');
  showProgress();

  const projectPath = join(BUILDS_DIR, slug);
  console.log(`Creating: ${projectPath}\n`);

  const templateByType = {
    defi: 'defi-starter',
    nft: 'nft-marketplace',
    general: 'defi-starter'
  };

  const templateName = templateByType[state.dappType?.value] || 'defi-starter';
  const templateDir = join(TEMPLATE_ROOT, templateName);

  if (copyTemplate({ templateDir, targetDir: projectPath })) {
    ensureDir(join(projectPath, '.appfactory'));
    writeFileSync(
      join(projectPath, '.appfactory', 'template.json'),
      JSON.stringify({ template: `templates/dapp/${templateName}` }, null, 2)
    );
    console.log(`${GREEN}Template scaffold complete (${templateName})${RESET}\n`);
    setPhase(1, 'complete');
    return projectPath;
  }

  // Create directory structure
  mkdirSync(join(projectPath, 'src', 'app'), { recursive: true });
  mkdirSync(join(projectPath, 'src', 'components'), { recursive: true });
  mkdirSync(join(projectPath, 'src', 'lib'), { recursive: true });
  mkdirSync(join(projectPath, 'public'), { recursive: true });
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  // package.json with web3 dependencies
  const packageJson = {
    name: slug,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      next: '^14.2.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      viem: '^2.0.0',
      wagmi: '^2.0.0',
      '@tanstack/react-query': '^5.0.0'
    },
    devDependencies: {
      typescript: '^5.3.0',
      '@types/node': '^20.10.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      tailwindcss: '^3.4.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.4.0'
    }
  };
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./src/*'] }
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  };
  writeFileSync(join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  // next.config.js
  writeFileSync(join(projectPath, 'next.config.js'), `/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
`);

  // tailwind.config.js
  writeFileSync(join(projectPath, 'tailwind.config.js'), `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: '#0052FF'
      }
    }
  },
  plugins: []
}
`);

  // postcss.config.js
  writeFileSync(join(projectPath, 'postcss.config.js'), `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
`);

  // globals.css
  writeFileSync(join(projectPath, 'src', 'app', 'globals.css'), `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0a0f;
  --foreground: #e0e0e0;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
}
`);

  // layout.tsx
  writeFileSync(join(projectPath, 'src', 'app', 'layout.tsx'), `import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${slug}',
  description: 'dApp built with App Factory'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
`);

  // page.tsx - dApp dashboard
  const pageContent = generateDappPage(slug);
  writeFileSync(join(projectPath, 'src', 'app', 'page.tsx'), pageContent);

  console.log(`${GREEN}Scaffold complete${RESET}\n`);
  setPhase(1, 'complete');

  return projectPath;
}

function generateDappPage(slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const chainName = state.chain?.label || 'Base';

  return `export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="flex justify-between items-center p-6 border-b border-white/10">
        <span className="font-bold text-xl">${title}</span>
        <button className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90">
          Connect Wallet
        </button>
      </header>

      <section className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="opacity-70">Connected to ${chainName}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Value Locked', value: '$0.00' },
            { label: 'Your Balance', value: '0 ETH' },
            { label: 'Transactions', value: '0' }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm opacity-70 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="opacity-50">No transactions yet. Connect your wallet to get started.</p>
        </div>
      </section>
    </main>
  )
}
`;
}

// Phase 3: Install dependencies
function installDeps(projectPath) {
  setPhase(2, 'active');
  showProgress();

  console.log('Installing dependencies...\n');

  try {
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    console.log(`\n${GREEN}Dependencies installed${RESET}\n`);
    setPhase(2, 'complete');
    return true;
  } catch (err) {
    console.error(`\n${RED}Install failed${RESET}\n`);
    setPhase(2, 'failed');
    return false;
  }
}

// Phase 4: Verify with local run proof
async function verifyProject(projectPath, port) {
  setPhase(3, 'active');
  showProgress();

  console.log('Running verification...\n');

  const proofScript = join(LIB_DIR, 'local-run-proof.mjs');

  if (!existsSync(proofScript)) {
    console.error(`${RED}ERROR: Local run proof script not found: ${proofScript}${RESET}`);
    setPhase(3, 'failed');
    return false;
  }

  try {
    runLocalProof({
      proofScript,
      projectPath,
      port,
      skipBuild: true,
      skipInstall: false,
      open: true
    });
    setPhase(3, 'complete');
    return true;
  } catch (err) {
    setPhase(3, 'failed');
    return false;
  }
}

// Phase 4.5: Optional Skills Audits
async function runSkillsAudits(projectPath) {
  console.log(`\n${CYAN}Checking for optional quality enhancements...${RESET}\n`);

  try {
    // Import skill detection library
    const { detectSkill, getDegradationMessage } = await import('./lib/skill-detection.mjs');

    // Check for React/Web3 skills
    const hasReactSkills = await detectSkill('vercel-agent-skills');

    if (hasReactSkills) {
      console.log(`${GREEN}✓ Skills audits available - running quality checks...${RESET}\n`);

      try {
        // Run skills audit script if available
        const auditScript = join(REPO_ROOT, 'scripts', 'run-skills-audit.sh');
        if (existsSync(auditScript)) {
          execSync(`bash "${auditScript}" "${projectPath}" --skill react-best-practices`, {
            stdio: 'inherit'
          });
          console.log(`${GREEN}✓ Skills audit passed${RESET}\n`);
        } else {
          console.log(`${YELLOW}${getDegradationMessage('vercel-agent-skills', 'skipping')}${RESET}\n`);
        }
      } catch (err) {
        // Skills audit failed, but this is not fatal
        console.log(`${YELLOW}⚠️  Skills audit failed - continuing anyway (audits are optional)${RESET}\n`);
      }
    } else {
      console.log(`${DIM}${getDegradationMessage('vercel-agent-skills', 'skipping')}${RESET}`);
      console.log(`${DIM}${getDegradationMessage('vercel-agent-skills', 'alternative')}${RESET}\n`);
    }
  } catch (err) {
    // Skill detection library not available - graceful degradation
    console.log(`${DIM}⚠️  Skill detection not available - skipping optional quality checks${RESET}\n`);
  }
}

// Phase 5: Launch card
function showLaunchCard(projectPath, port) {
  setPhase(4, 'complete');
  showProgress();

  console.log(`
${GREEN}${BOLD}════════════════════════════════════════${RESET}
${GREEN}${BOLD}          LAUNCH READY${RESET}
${GREEN}${BOLD}════════════════════════════════════════${RESET}

${BOLD}Project:${RESET} ${projectPath}

${BOLD}Run:${RESET}
  cd ${projectPath}
  npm run dev

${BOLD}Open:${RESET} http://localhost:${port}

${BOLD}Build for production:${RESET}
  npm run build

${BOLD}Next steps:${RESET}
  - Add wallet connection (wagmi/viem)
  - Configure chain settings
  - Deploy smart contracts

${DIM}Generated by App Factory dApp Pipeline${RESET}
`);
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}dApp Factory${RESET}\n`);

  // Phase 0: Capability Detection
  console.log(`${CYAN}Detecting available capabilities...${RESET}\n`);

  try {
    const { getDetailedCapabilities, printCapabilityReport } = await import('./lib/skill-detection.mjs');

    const capabilities = await getDetailedCapabilities({
      checkBaseline: true,
      checkQuality: true,
      checkAdvanced: false
    });

    printCapabilityReport(capabilities, {
      detailed: true,
      showAll: false
    });
  } catch (err) {
    console.log(`${DIM}Capability detection unavailable - continuing with baseline tier${RESET}\n`);
  }

  // Phase 1: Inputs
  await gatherInputs(config.skipPrompts);

  // Generate slug
  const slug = config.slug || `${state.dappType.value}-${Date.now().toString(36)}`;

  // Phase 2: Scaffold
  const projectPath = scaffoldProject(slug);
  writeAuditEvent({
    projectPath,
    pipeline: 'dapp-factory',
    phase: 'scaffold',
    status: 'complete',
    message: 'Project scaffolded'
  });

  // Phase 3: Install
  const installed = installDeps(projectPath);
  if (!installed) {
    writeAuditEvent({
      projectPath,
      pipeline: 'dapp-factory',
      phase: 'install',
      status: 'failed',
      message: 'Dependency install failed'
    });
    console.error(`\n${RED}Pipeline failed at install phase${RESET}`);
    process.exit(1);
  }
  writeAuditEvent({
    projectPath,
    pipeline: 'dapp-factory',
    phase: 'install',
    status: 'complete',
    message: 'Dependencies installed'
  });

  // Phase 4: Verify
  const verified = await verifyProject(projectPath, config.port);
  if (!verified) {
    writeAuditEvent({
      projectPath,
      pipeline: 'dapp-factory',
      phase: 'verify',
      status: 'failed',
      message: 'Verification failed'
    });
    console.error(`\n${RED}Pipeline failed at verification phase${RESET}`);
    console.log(`\nCheck logs at: ${projectPath}/.appfactory/logs/`);
    process.exit(1);
  }
  writeAuditEvent({
    projectPath,
    pipeline: 'dapp-factory',
    phase: 'verify',
    status: 'complete',
    message: 'Verification passed'
  });

  // Phase 4.5: Optional Skills Audits (non-blocking)
  await runSkillsAudits(projectPath);

  // Phase 5: Check for RUN_CERTIFICATE.json with PASS status
  const certificate = checkRunCertificate(projectPath);
  if (!certificate.ok) {
    writeAuditEvent({
      projectPath,
      pipeline: 'dapp-factory',
      phase: 'cert',
      status: 'failed',
      message: certificate.error,
      data: { path: certificate.path }
    });
    console.error(`\n${RED}Pipeline failed: No valid RUN_CERTIFICATE.json${RESET}`);
    console.log(`\nThis build has NOT passed the Local Run Proof Gate.`);
    console.log(`Fix the issues above and re-run verification.\n`);
    process.exit(1);
  }
  writeAuditEvent({
    projectPath,
    pipeline: 'dapp-factory',
    phase: 'cert',
    status: 'complete',
    message: 'RUN_CERTIFICATE.json verified'
  });

  // Phase 6: Launch card (only shown if certificate exists with PASS)
  showLaunchCard(projectPath, config.port);

  // Phase 7: Optional Ralph QA (if available and not skipping prompts)
  if (!config.skipPrompts) {
    try {
      const { detectSkill } = await import('./lib/skill-detection.mjs');
      const hasRalph = await detectSkill('ralph');

      if (hasRalph) {
        const ralphScript = join(REPO_ROOT, 'ralph', 'run-ralph.sh');
        if (existsSync(ralphScript)) {
          console.log(`\n${CYAN}${BOLD}Optional: Ralph QA Adversarial Review${RESET}`);
          console.log(`${DIM}Ralph provides automated adversarial testing to catch edge cases${RESET}\n`);

          const answer = await askQuestion('Run Ralph QA now? (y/n): ');

          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            console.log(`${CYAN}Starting Ralph QA iteration 1...${RESET}\n`);
            execSync(`bash "${ralphScript}" dapp-factory 1`, { stdio: 'inherit' });
            console.log(`\n${GREEN}✓ Ralph QA iteration 1 complete${RESET}`);
            console.log(`${DIM}Continue manually: ./ralph/run-ralph.sh dapp-factory 2${RESET}\n`);
          } else {
            console.log(`${YELLOW}⚠️  Skipping Ralph QA - manual review recommended for production${RESET}\n`);
          }
        }
      } else {
        console.log(`${DIM}Ralph QA not configured (optional)${RESET}`);
        console.log(`${DIM}Manual: ./ralph/run-ralph.sh dapp-factory 1${RESET}\n`);
      }
    } catch (err) {
      // Silently skip Ralph if detection fails
    }
  }
}

// Helper for asking yes/no questions
async function askQuestion(prompt) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

main().catch(err => {
  console.error(`\n${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
