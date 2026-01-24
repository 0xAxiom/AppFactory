#!/usr/bin/env node
/**
 * App Factory - Canonical Entrypoint
 *
 * Generates mobile applications with Expo + React Native.
 * Follows the website-pipeline gold standard pattern.
 *
 * Output: app-factory/builds/<slug>/
 *
 * Usage:
 *   node app-factory/scripts/run.mjs [--slug <name>] [--skip-prompts]
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PIPELINE_ROOT, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'builds');

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
  const config = { slug: null, skipPrompts: false, port: 8081 };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) config.slug = args[++i];
    if (args[i] === '--skip-prompts') config.skipPrompts = true;
    if (args[i] === '--port' && args[i + 1]) config.port = parseInt(args[++i], 10);
  }

  return config;
}

// State
const state = {
  appType: null,
  platform: null,
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
    state.appType = { value: 'utility', label: 'Utility App' };
    state.platform = { value: 'both', label: 'iOS + Android' };
    state.features = ['navigation'];
    console.log('Using defaults: Utility App, iOS + Android, Navigation\n');
    setPhase(0, 'complete');
    return;
  }

  // Q1: App type
  state.appType = await ask('What type of mobile app?', [
    { value: 'utility', label: 'Utility App' },
    { value: 'social', label: 'Social/Community' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'content', label: 'Content/Media' }
  ]);
  console.log(`${GREEN}→ ${state.appType.label}${RESET}\n`);

  // Q2: Platform
  state.platform = await ask('Target platform?', [
    { value: 'both', label: 'iOS + Android' },
    { value: 'ios', label: 'iOS only' },
    { value: 'android', label: 'Android only' }
  ]);
  console.log(`${GREEN}→ ${state.platform.label}${RESET}\n`);

  // Q3: Navigation
  const nav = await ask('Include navigation? (y/n): ');
  if (nav.toLowerCase().startsWith('y')) {
    state.features.push('navigation');
    console.log(`${GREEN}→ Navigation enabled${RESET}\n`);
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
  mkdirSync(join(projectPath, 'app'), { recursive: true });
  mkdirSync(join(projectPath, 'components'), { recursive: true });
  mkdirSync(join(projectPath, 'assets'), { recursive: true });
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  // package.json for Expo
  const packageJson = {
    name: slug,
    version: '1.0.0',
    main: 'expo-router/entry',
    scripts: {
      start: 'expo start',
      dev: 'expo start --web --port 8081',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web'
    },
    dependencies: {
      'expo': '~50.0.0',
      'expo-router': '~3.4.0',
      'expo-status-bar': '~1.11.0',
      'react': '18.2.0',
      'react-native': '0.73.0',
      'react-native-web': '~0.19.6',
      'react-dom': '18.2.0',
      '@expo/webpack-config': '~19.0.0'
    },
    devDependencies: {
      '@babel/core': '^7.20.0',
      '@types/react': '~18.2.0',
      'typescript': '^5.1.0'
    }
  };
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // app.json for Expo
  const appJson = {
    expo: {
      name: slug,
      slug: slug,
      version: '1.0.0',
      orientation: 'portrait',
      scheme: slug,
      web: {
        bundler: 'metro',
        output: 'single',
        favicon: './assets/favicon.png'
      },
      plugins: ['expo-router']
    }
  };
  writeFileSync(join(projectPath, 'app.json'), JSON.stringify(appJson, null, 2));

  // tsconfig.json
  const tsconfig = {
    extends: 'expo/tsconfig.base',
    compilerOptions: {
      strict: true
    }
  };
  writeFileSync(join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  // babel.config.js
  writeFileSync(join(projectPath, 'babel.config.js'), `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo']
  };
};
`);

  // app/_layout.tsx
  writeFileSync(join(projectPath, 'app', '_layout.tsx'), `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '${slug}' }} />
    </Stack>
  );
}
`);

  // app/index.tsx - main screen
  const indexContent = generateAppScreen(slug);
  writeFileSync(join(projectPath, 'app', 'index.tsx'), indexContent);

  console.log(`${GREEN}Scaffold complete${RESET}\n`);
  setPhase(1, 'complete');

  return projectPath;
}

function generateAppScreen(slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return `import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>${title}</Text>
        <Text style={styles.subtitle}>Built with App Factory</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.cardText}>
            Your mobile app is ready. Start building!
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
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

// Phase 4: Verify with local run proof (Expo web mode)
async function verifyProject(projectPath, port) {
  setPhase(3, 'active');
  showProgress();

  console.log('Running verification (Expo web mode)...\n');

  const proofScript = join(LIB_DIR, 'local-run-proof.mjs');

  if (!existsSync(proofScript)) {
    console.error(`${RED}ERROR: Local run proof script not found: ${proofScript}${RESET}`);
    setPhase(3, 'failed');
    return false;
  }

  try {
    // Use Expo web for verification
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

// Phase 4.5: Optional Skills Audits
async function runSkillsAudits(projectPath) {
  console.log(`\n${CYAN}Checking for optional quality enhancements...${RESET}\n`);

  try {
    // Import skill detection library
    const { detectSkill, getDegradationMessage } = await import('./lib/skill-detection.mjs');

    // Check for React Native skills (if applicable)
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

${BOLD}Run (Web Preview):${RESET}
  cd ${projectPath}
  npm run web

${BOLD}Run (iOS Simulator):${RESET}
  cd ${projectPath}
  npm run ios

${BOLD}Run (Android Emulator):${RESET}
  cd ${projectPath}
  npm run android

${BOLD}Open:${RESET} http://localhost:${port}

${BOLD}Next steps:${RESET}
  - Install Expo Go on your device
  - Scan the QR code to test on device
  - Build with: npx expo build

${DIM}Generated by App Factory Mobile Pipeline${RESET}
`);
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}App Factory (Mobile)${RESET}\n`);

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
  const slug = config.slug || `${state.appType.value}-${Date.now().toString(36)}`;

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

  // Phase 4.5: Optional Skills Audits (non-blocking)
  await runSkillsAudits(projectPath);

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
            execSync(`bash "${ralphScript}" app-factory 1`, { stdio: 'inherit' });
            console.log(`\n${GREEN}✓ Ralph QA iteration 1 complete${RESET}`);
            console.log(`${DIM}Continue manually: ./ralph/run-ralph.sh app-factory 2${RESET}\n`);
          } else {
            console.log(`${YELLOW}⚠️  Skipping Ralph QA - manual review recommended for production${RESET}\n`);
          }
        }
      } else {
        console.log(`${DIM}Ralph QA not configured (optional)${RESET}`);
        console.log(`${DIM}Manual: ./ralph/run-ralph.sh app-factory 1${RESET}\n`);
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
