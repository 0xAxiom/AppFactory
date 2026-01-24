#!/usr/bin/env node
/**
 * MiniApp Pipeline - Canonical Entrypoint
 *
 * Generates Base Mini Apps with MiniKit integration.
 * Follows the website-pipeline gold standard pattern.
 *
 * Output: miniapp-pipeline/builds/miniapps/<slug>/
 *
 * Usage:
 *   node miniapp-pipeline/scripts/run.mjs [--slug <name>] [--skip-prompts]
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PIPELINE_ROOT, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'builds', 'miniapps');

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
  const config = { slug: null, skipPrompts: false, port: 3003 };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) config.slug = args[++i];
    if (args[i] === '--skip-prompts') config.skipPrompts = true;
    if (args[i] === '--port' && args[i + 1]) config.port = parseInt(args[++i], 10);
  }

  return config;
}

// State
const state = {
  miniappType: null,
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

// Validate RUN_CERTIFICATE.json exists with PASS status
function checkRunCertificate(projectPath) {
  const certPath = join(projectPath, '.appfactory', 'RUN_CERTIFICATE.json');
  const failPath = join(projectPath, '.appfactory', 'RUN_FAILURE.json');

  // Check for failure first
  if (existsSync(failPath)) {
    try {
      const failure = JSON.parse(readFileSync(failPath, 'utf-8'));
      console.error(`\n${RED}${BOLD}BUILD VERIFICATION FAILED${RESET}\n`);
      console.error(`${RED}Error: ${failure.error}${RESET}\n`);
      console.error(`See details: ${failPath}\n`);
      return false;
    } catch (err) {
      console.error(`\n${RED}RUN_FAILURE.json exists but could not be read${RESET}\n`);
      return false;
    }
  }

  // Check for certificate
  if (!existsSync(certPath)) {
    console.error(`\n${RED}${BOLD}NO RUN CERTIFICATE FOUND${RESET}\n`);
    console.error(`${RED}Verification did not produce a valid RUN_CERTIFICATE.json${RESET}\n`);
    console.error(`Expected: ${certPath}\n`);
    return false;
  }

  // Validate certificate has PASS status
  try {
    const cert = JSON.parse(readFileSync(certPath, 'utf-8'));
    if (cert.status !== 'PASS') {
      console.error(`\n${RED}${BOLD}VERIFICATION FAILED${RESET}\n`);
      console.error(`${RED}Certificate status: ${cert.status}${RESET}\n`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`\n${RED}RUN_CERTIFICATE.json exists but could not be parsed${RESET}\n`);
    return false;
  }
}

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
    state.miniappType = { value: 'social', label: 'Social App' };
    state.features = ['wallet', 'frames'];
    console.log('Using defaults: Social App, Wallet connect, Frames\n');
    setPhase(0, 'complete');
    return;
  }

  // Q1: MiniApp type
  state.miniappType = await ask('What type of mini app?', [
    { value: 'social', label: 'Social App (community, sharing)' },
    { value: 'game', label: 'Game (interactive, leaderboards)' },
    { value: 'utility', label: 'Utility (tools, helpers)' },
    { value: 'commerce', label: 'Commerce (transactions, rewards)' }
  ]);
  console.log(`${GREEN}→ ${state.miniappType.label}${RESET}\n`);

  // Q2: Wallet connect
  const wallet = await ask('Include wallet connection? (y/n): ');
  if (wallet.toLowerCase().startsWith('y')) {
    state.features.push('wallet');
    console.log(`${GREEN}→ Wallet connect enabled${RESET}\n`);
  }

  // Q3: Frames
  const frames = await ask('Include Farcaster Frames? (y/n): ');
  if (frames.toLowerCase().startsWith('y')) {
    state.features.push('frames');
    console.log(`${GREEN}→ Frames enabled${RESET}\n`);
  }

  setPhase(0, 'complete');
}

// Phase 2: Scaffold project
function scaffoldProject(slug) {
  setPhase(1, 'active');
  showProgress();

  const projectPath = join(BUILDS_DIR, slug);
  console.log(`Creating: ${projectPath}\n`);

  // Create directory structure
  mkdirSync(join(projectPath, 'src', 'app'), { recursive: true });
  mkdirSync(join(projectPath, 'src', 'components'), { recursive: true });
  mkdirSync(join(projectPath, 'public'), { recursive: true });
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  // package.json with MiniKit dependencies
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
      '@worldcoin/minikit-js': '^1.0.0'
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
  theme: {
    extend: {
      colors: {
        base: '#0052FF',
        background: '#000000',
        foreground: '#ffffff'
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
  --base: #0052FF;
  --background: #000000;
  --foreground: #ffffff;
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
  description: 'Mini App built with App Factory'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`);

  // page.tsx
  const pageContent = generateMiniAppPage(slug);
  writeFileSync(join(projectPath, 'src', 'app', 'page.tsx'), pageContent);

  console.log(`${GREEN}Scaffold complete${RESET}\n`);
  setPhase(1, 'complete');

  return projectPath;
}

function generateMiniAppPage(slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const hasWallet = state.features?.includes('wallet');

  return `'use client';

import { useState } from 'react';

export default function Home() {
  const [connected, setConnected] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b border-white/10">
        <span className="font-bold">${title}</span>
        ${hasWallet ? `<button
          onClick={() => setConnected(!connected)}
          className="px-4 py-2 bg-base text-white rounded-lg text-sm"
        >
          {connected ? 'Connected' : 'Connect'}
        </button>` : ''}
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-base rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">⚡</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">${title}</h1>
        <p className="text-white/60 mb-8 max-w-xs">
          Your mini app is ready. Start building!
        </p>

        <button className="w-full max-w-xs px-6 py-4 bg-base text-white rounded-xl font-semibold">
          Get Started
        </button>
      </section>

      <footer className="p-4 text-center text-white/40 text-sm">
        Built with App Factory
      </footer>
    </main>
  );
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
    execSync(`node "${proofScript}" --cwd "${projectPath}" --port ${port} --skip-build --open`, {
      stdio: 'inherit'
    });
    setPhase(3, 'complete');
    return true;
  } catch (err) {
    setPhase(3, 'failed');
    return false;
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
  - Configure MiniKit with your app ID
  - Add World ID verification
  - Deploy to Vercel for Base integration

${DIM}Generated by App Factory MiniApp Pipeline${RESET}
`);
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}MiniApp Pipeline${RESET}\n`);

  // Phase 1: Inputs
  await gatherInputs(config.skipPrompts);

  // Generate slug
  const slug = config.slug || `${state.miniappType.value}-${Date.now().toString(36)}`;

  // Phase 2: Scaffold
  const projectPath = scaffoldProject(slug);

  // Phase 3: Install
  const installed = installDeps(projectPath);
  if (!installed) {
    console.error(`\n${RED}Pipeline failed at install phase${RESET}`);
    process.exit(1);
  }

  // Phase 4: Verify
  const verified = await verifyProject(projectPath, config.port);
  if (!verified) {
    console.error(`\n${RED}Pipeline failed at verification phase${RESET}`);
    console.log(`\nCheck logs at: ${projectPath}/.appfactory/logs/`);
    process.exit(1);
  }

  // Phase 5: Check for RUN_CERTIFICATE.json with PASS status
  const certified = checkRunCertificate(projectPath);
  if (!certified) {
    console.error(`\n${RED}Pipeline failed: No valid RUN_CERTIFICATE.json${RESET}`);
    console.log(`\nThis build has NOT passed the Local Run Proof Gate.`);
    console.log(`Fix the issues above and re-run verification.\n`);
    process.exit(1);
  }

  // Phase 6: Launch card (only shown if certificate exists with PASS)
  showLaunchCard(projectPath, config.port);
}

main().catch(err => {
  console.error(`\n${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
