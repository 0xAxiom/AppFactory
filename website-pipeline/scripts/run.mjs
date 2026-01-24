#!/usr/bin/env node
/**
 * Website Pipeline - Canonical Entrypoint
 *
 * This is the GOLD STANDARD for App Factory pipeline execution.
 * All other pipelines should follow this pattern.
 *
 * Flow:
 * 1. Gather inputs (≤6 questions, or use defaults)
 * 2. Scaffold project immediately
 * 3. Install dependencies
 * 4. Run local verification (dev server + HTTP 200)
 * 5. Output launch card with proven instructions
 *
 * Usage:
 *   node website-pipeline/scripts/run.mjs [--slug <name>] [--skip-prompts]
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PIPELINE_ROOT, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'website-builds');

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
  siteType: null,
  vibe: null,
  contentModel: null,
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
    state.siteType = { value: 'portfolio', label: 'Portfolio' };
    state.vibe = { value: 'minimal', label: 'Minimal' };
    state.contentModel = { value: 'static', label: 'Static pages' };
    state.features = ['darkMode'];
    console.log('Using defaults: Portfolio, Minimal, Static, Dark mode\n');
    setPhase(0, 'complete');
    return;
  }

  // Q1: Site type
  state.siteType = await ask('What type of site?', [
    { value: 'portfolio', label: 'Portfolio (showcase work)' },
    { value: 'blog', label: 'Blog (articles)' },
    { value: 'landing', label: 'Landing page (single page)' },
    { value: 'hybrid', label: 'Hybrid (portfolio + blog)' }
  ]);
  console.log(`${GREEN}→ ${state.siteType.label}${RESET}\n`);

  // Q2: Visual vibe
  state.vibe = await ask('Visual style?', [
    { value: 'minimal', label: 'Minimal (clean, whitespace)' },
    { value: 'bold', label: 'Bold (high contrast)' },
    { value: 'dark', label: 'Dark mode default' },
    { value: 'editorial', label: 'Editorial (typography-first)' }
  ]);
  console.log(`${GREEN}→ ${state.vibe.label}${RESET}\n`);

  // Q3: Content model
  state.contentModel = await ask('Content setup?', [
    { value: 'static', label: 'Static pages (recommended)' },
    { value: 'mdx', label: 'MDX files for blog posts' }
  ]);
  console.log(`${GREEN}→ ${state.contentModel.label}${RESET}\n`);

  // Q4: Features (simple yes/no for dark mode)
  const darkMode = await ask('Include dark mode toggle? (y/n): ');
  if (darkMode.toLowerCase().startsWith('y')) {
    state.features.push('darkMode');
    console.log(`${GREEN}→ Dark mode enabled${RESET}\n`);
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

  // Determine colors based on vibe
  const isDark = state.vibe.value === 'dark' || state.vibe.value === 'bold';
  const colors = {
    minimal: { bg: '#ffffff', fg: '#111111', accent: '#0066cc' },
    bold: { bg: '#000000', fg: '#ffffff', accent: '#ff3366' },
    dark: { bg: '#0a0a0f', fg: '#e0e0e0', accent: '#00ff88' },
    editorial: { bg: '#fafaf9', fg: '#1c1917', accent: '#dc2626' }
  }[state.vibe.value] || { bg: '#ffffff', fg: '#111111', accent: '#0066cc' };

  // package.json
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
      'react-dom': '^18.2.0'
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
        accent: '${colors.accent}'
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
  --background: ${colors.bg};
  --foreground: ${colors.fg};
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
  description: 'Built with App Factory Website Pipeline'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"${isDark ? ' className="dark"' : ''}>
      <body>{children}</body>
    </html>
  )
}
`);

  // page.tsx - content varies by site type
  const pageContent = generatePageContent(slug);
  writeFileSync(join(projectPath, 'src', 'app', 'page.tsx'), pageContent);

  console.log(`${GREEN}Scaffold complete${RESET}\n`);
  setPhase(1, 'complete');

  return projectPath;
}

// Generate page content based on site type
function generatePageContent(slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  switch (state.siteType.value) {
    case 'portfolio':
      return `export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-5xl font-bold mb-4">${title}</h1>
        <p className="text-xl opacity-70 mb-8">Portfolio & Work Showcase</p>
        <nav className="flex gap-4">
          <a href="#work" className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90">View Work</a>
          <a href="#contact" className="px-6 py-3 border rounded-lg hover:bg-accent hover:text-white">Contact</a>
        </nav>
      </section>

      <section id="work" className="py-24 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Selected Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video bg-foreground/5 rounded-lg flex items-center justify-center">
              <span className="opacity-50">Project {i}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-24 px-8 bg-foreground/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="opacity-70 mb-8">Interested in working together?</p>
          <a href="mailto:hello@example.com" className="inline-block px-8 py-4 bg-accent text-white rounded-lg">
            Say Hello
          </a>
        </div>
      </section>
    </main>
  )
}
`;

    case 'blog':
      return `export default function Home() {
  const posts = [
    { title: 'Getting Started', date: '2024-01-15', excerpt: 'An introduction to building with Next.js...' },
    { title: 'Design Systems', date: '2024-01-10', excerpt: 'How to create a consistent design language...' },
    { title: 'Performance Tips', date: '2024-01-05', excerpt: 'Optimizing your website for speed...' }
  ]

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-8 py-16">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-2">${title}</h1>
        <p className="opacity-70">Thoughts, ideas, and explorations</p>
      </header>

      <div className="space-y-12">
        {posts.map((post, i) => (
          <article key={i} className="group">
            <time className="text-sm opacity-50">{post.date}</time>
            <h2 className="text-2xl font-semibold mt-1 group-hover:text-accent transition-colors">
              <a href="#">{post.title}</a>
            </h2>
            <p className="mt-2 opacity-70">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
`;

    case 'landing':
      return `export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <span className="font-bold text-xl">${title}</span>
        <nav className="flex gap-6">
          <a href="#features" className="hover:text-accent">Features</a>
          <a href="#pricing" className="hover:text-accent">Pricing</a>
          <a href="#" className="px-4 py-2 bg-accent text-white rounded-lg">Get Started</a>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-8 py-24">
        <h1 className="text-6xl font-bold mb-6 max-w-4xl">
          Build something amazing today
        </h1>
        <p className="text-xl opacity-70 mb-8 max-w-2xl">
          A powerful platform that helps you create, launch, and grow your ideas faster than ever.
        </p>
        <div className="flex gap-4">
          <a href="#" className="px-8 py-4 bg-accent text-white rounded-lg text-lg">
            Start Free Trial
          </a>
          <a href="#" className="px-8 py-4 border rounded-lg text-lg hover:bg-foreground/5">
            Watch Demo
          </a>
        </div>
      </section>

      <section id="features" className="py-24 px-8 bg-foreground/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Fast', 'Secure', 'Scalable'].map((feature, i) => (
              <div key={i} className="p-6 bg-background rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                <p className="opacity-70">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
`;

    default: // hybrid
      return `export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-5xl font-bold mb-4">${title}</h1>
        <p className="text-xl opacity-70 mb-8">Designer & Developer</p>
        <nav className="flex gap-4">
          <a href="#work" className="px-6 py-3 bg-accent text-white rounded-lg">Work</a>
          <a href="#writing" className="px-6 py-3 border rounded-lg">Writing</a>
        </nav>
      </section>

      <section id="work" className="py-24 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Recent Work</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-video bg-foreground/5 rounded-lg" />
          ))}
        </div>
      </section>

      <section id="writing" className="py-24 px-8 bg-foreground/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Latest Writing</h2>
          <div className="space-y-8">
            {['Post One', 'Post Two'].map((title, i) => (
              <article key={i}>
                <h3 className="text-xl font-semibold hover:text-accent">
                  <a href="#">{title}</a>
                </h3>
                <p className="opacity-70 mt-2">A brief excerpt from the article...</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
`;
  }
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

${DIM}Generated by App Factory Website Pipeline${RESET}
`);
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}Website Pipeline${RESET}\n`);

  // Phase 1: Inputs
  await gatherInputs(config.skipPrompts);

  // Generate slug
  const slug = config.slug || `${state.siteType.value}-${Date.now().toString(36)}`;

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
