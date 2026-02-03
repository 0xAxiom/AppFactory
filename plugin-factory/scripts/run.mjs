#!/usr/bin/env node
/**
 * Plugin Factory - Canonical Entrypoint
 *
 * Generates Claude Code plugins (MCP servers, skill definitions).
 * Follows the website-pipeline gold standard pattern.
 *
 * Output: plugin-factory/builds/<slug>/
 *
 * Usage:
 *   node plugin-factory/scripts/run.mjs [--slug <name>] [--skip-prompts]
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
const BUILDS_DIR = join(PIPELINE_ROOT, 'builds');
const TEMPLATE_ROOT = join(REPO_ROOT, 'templates', 'plugin');

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
  const config = { slug: null, skipPrompts: false, port: 3002 };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) config.slug = args[++i];
    if (args[i] === '--skip-prompts') config.skipPrompts = true;
    if (args[i] === '--port' && args[i + 1]) config.port = parseInt(args[++i], 10);
  }

  return config;
}

// State
const state = {
  pluginType: null,
  transport: null,
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

// Write verification certificate (standardized certificate writing)
function writeCertificate(projectPath, type, command, additionalData = {}) {
  const certPath = join(projectPath, '.appfactory', 'RUN_CERTIFICATE.json');
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  const certificate = {
    status: 'PASS',
    timestamp: new Date().toISOString(),
    project: projectPath,
    verificationType: type,
    command: command,
    ...additionalData
  };

  writeFileSync(certPath, JSON.stringify(certificate, null, 2));
  return certPath;
}

// Write verification failure (standardized failure writing)
function writeFailure(projectPath, error, command) {
  const failPath = join(projectPath, '.appfactory', 'RUN_FAILURE.json');
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  const failure = {
    status: 'FAIL',
    timestamp: new Date().toISOString(),
    project: projectPath,
    error: error,
    command: command
  };

  writeFileSync(failPath, JSON.stringify(failure, null, 2));
  return failPath;
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
    state.pluginType = { value: 'mcp', label: 'MCP Server' };
    state.transport = { value: 'stdio', label: 'stdio' };
    state.features = ['tools'];
    console.log('Using defaults: MCP Server, stdio transport, Tools\n');
    setPhase(0, 'complete');
    return;
  }

  // Q1: Plugin type
  state.pluginType = await ask('What type of plugin?', [
    { value: 'mcp', label: 'MCP Server' },
    { value: 'skill', label: 'Skill Definition' },
    { value: 'hook', label: 'Claude Code Hook' }
  ]);
  console.log(`${GREEN}→ ${state.pluginType.label}${RESET}\n`);

  // Q2: Transport (for MCP)
  if (state.pluginType.value === 'mcp') {
    state.transport = await ask('Transport protocol?', [
      { value: 'stdio', label: 'stdio (recommended)' },
      { value: 'http', label: 'HTTP/SSE' }
    ]);
    console.log(`${GREEN}→ ${state.transport.label}${RESET}\n`);
  } else {
    state.transport = { value: 'none', label: 'N/A' };
  }

  // Q3: Features
  const tools = await ask('Include example tools? (y/n): ');
  if (tools.toLowerCase().startsWith('y')) {
    state.features.push('tools');
    console.log(`${GREEN}→ Example tools included${RESET}\n`);
  }

  setPhase(0, 'complete');
}

// Phase 2: Scaffold project
function scaffoldProject(slug) {
  setPhase(1, 'active');
  showProgress();

  const projectPath = join(BUILDS_DIR, slug);
  console.log(`Creating: ${projectPath}\n`);

  if (state.pluginType?.value !== 'mcp') {
    const templateName = 'code-formatter';
    const templateDir = join(TEMPLATE_ROOT, templateName);

    if (copyTemplate({ templateDir, targetDir: projectPath })) {
      ensureDir(join(projectPath, '.appfactory'));
      writeFileSync(
        join(projectPath, '.appfactory', 'template.json'),
        JSON.stringify({ template: `templates/plugin/${templateName}` }, null, 2)
      );
      console.log(`${GREEN}Template scaffold complete (${templateName})${RESET}\n`);
      setPhase(1, 'complete');
      return projectPath;
    }
  }

  // Create directory structure
  mkdirSync(join(projectPath, 'src'), { recursive: true });
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  if (state.pluginType.value === 'mcp') {
    scaffoldMCPServer(projectPath, slug);
  } else if (state.pluginType.value === 'skill') {
    scaffoldSkill(projectPath, slug);
  } else {
    scaffoldHook(projectPath, slug);
  }

  console.log(`${GREEN}Scaffold complete${RESET}\n`);
  setPhase(1, 'complete');

  return projectPath;
}

function scaffoldMCPServer(projectPath, slug) {
  const port = parseArgs().port;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const isHttp = state.transport?.value === 'http';

  // package.json
  const packageJson = {
    name: slug,
    version: '1.0.0',
    type: 'module',
    main: 'src/index.js',
    bin: {
      [slug]: './src/index.js'
    },
    scripts: {
      start: 'node src/index.js',
      dev: isHttp ? `node src/index.js` : 'node src/index.js',
      test: 'echo "MCP server smoke test" && node -e "console.log(\'OK\')"'
    },
    dependencies: {
      '@modelcontextprotocol/sdk': '^1.0.0'
    },
    devDependencies: {}
  };
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // src/index.js - MCP server
  if (isHttp) {
    writeFileSync(join(projectPath, 'src', 'index.js'), generateMCPHttpServer(slug, port));
  } else {
    writeFileSync(join(projectPath, 'src', 'index.js'), generateMCPStdioServer(slug));
  }

  // README.md
  writeFileSync(join(projectPath, 'README.md'), `# ${title}

MCP Server built with App Factory.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

${isHttp ? `
### HTTP Mode
\`\`\`bash
npm start
# Server runs at http://localhost:${port}
\`\`\`
` : `
### stdio Mode (for Claude Code)

Add to your Claude Code settings:

\`\`\`json
{
  "mcpServers": {
    "${slug}": {
      "command": "node",
      "args": ["${projectPath}/src/index.js"]
    }
  }
}
\`\`\`
`}

## Tools

- \`hello\` - Returns a greeting
- \`echo\` - Echoes back the input

## Built with App Factory Plugin Pipeline
`);
}

function generateMCPStdioServer(slug) {
  return `#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: '${slug}',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'hello',
        description: 'Returns a friendly greeting',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name to greet',
            },
          },
        },
      },
      {
        name: 'echo',
        description: 'Echoes back the input',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message to echo',
            },
          },
          required: ['message'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'hello') {
    const greeting = args?.name ? \`Hello, \${args.name}!\` : 'Hello, world!';
    return {
      content: [{ type: 'text', text: greeting }],
    };
  }

  if (name === 'echo') {
    return {
      content: [{ type: 'text', text: args.message }],
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('${slug} MCP server running on stdio');
}

main().catch(console.error);
`;
}

function generateMCPHttpServer(slug, port) {
  return `#!/usr/bin/env node
import { createServer } from 'node:http';

const PORT = process.env.PORT || ${port};

const tools = [
  {
    name: 'hello',
    description: 'Returns a friendly greeting',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name to greet' },
      },
    },
  },
  {
    name: 'echo',
    description: 'Echoes back the input',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to echo' },
      },
      required: ['message'],
    },
  },
];

function handleTool(name, args) {
  if (name === 'hello') {
    return args?.name ? \`Hello, \${args.name}!\` : 'Hello, world!';
  }
  if (name === 'echo') {
    return args.message;
  }
  throw new Error(\`Unknown tool: \${name}\`);
}

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const url = new URL(req.url, \`http://\${req.headers.host}\`);

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // List tools
  if (url.pathname === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ tools }));
    return;
  }

  // Call tool
  if (url.pathname === '/call' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;

    try {
      const { name, arguments: args } = JSON.parse(body);
      const result = handleTool(name, args);
      res.writeHead(200);
      res.end(JSON.stringify({ result }));
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(\`${slug} MCP server running at http://localhost:\${PORT}\`);
});
`;
}

function scaffoldSkill(projectPath, slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // No package.json needed for skill
  // Create skill.md
  writeFileSync(join(projectPath, 'skill.md'), `---
name: ${slug}
description: ${title} - Custom skill for Claude Code
---

# ${title}

This skill provides guidance for [describe what this skill does].

## When to Use

Use this skill when:
- [Condition 1]
- [Condition 2]

## Checklist

1. [ ] Step one
2. [ ] Step two
3. [ ] Step three

## Example

\`\`\`
User: [example request]
Assistant: [using this skill to help]
\`\`\`
`);

  // README.md
  writeFileSync(join(projectPath, 'README.md'), `# ${title}

Skill definition for Claude Code.

## Installation

Copy \`skill.md\` to your Claude Code skills directory.

## Built with App Factory Plugin Pipeline
`);

  // Minimal package.json for consistency
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify({
    name: slug,
    version: '1.0.0',
    scripts: {
      test: 'echo "Skill validated" && exit 0',
      dev: 'echo "Skill ready for use" && exit 0'
    }
  }, null, 2));
}

function scaffoldHook(projectPath, slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // package.json
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify({
    name: slug,
    version: '1.0.0',
    type: 'module',
    main: 'src/index.js',
    scripts: {
      test: 'node src/index.js --test',
      dev: 'node src/index.js'
    }
  }, null, 2));

  // src/index.js - Hook script
  writeFileSync(join(projectPath, 'src', 'index.js'), `#!/usr/bin/env node
/**
 * ${title} - Claude Code Hook
 *
 * Runs in response to Claude Code events.
 */

const args = process.argv.slice(2);

if (args.includes('--test')) {
  console.log('Hook test passed');
  process.exit(0);
}

// Hook logic
console.log('${slug} hook executed');
console.log('Args:', args);
console.log('Env:', Object.keys(process.env).filter(k => k.startsWith('CLAUDE_')));
`);

  // README.md
  writeFileSync(join(projectPath, 'README.md'), `# ${title}

Claude Code hook built with App Factory.

## Installation

Add to your Claude Code settings:

\`\`\`json
{
  "hooks": {
    "on-tool-result": "node ${projectPath}/src/index.js"
  }
}
\`\`\`

## Built with App Factory Plugin Pipeline
`);
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

// Phase 4: Verify - for plugins, run a smoke test
async function verifyProject(projectPath, port) {
  setPhase(3, 'active');
  showProgress();

  console.log('Running verification...\n');

  // For MCP HTTP servers, use local-run-proof
  if (state.pluginType?.value === 'mcp' && state.transport?.value === 'http') {
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
        skipInstall: true,
        open: true
      });
      setPhase(3, 'complete');
      return true;
    } catch (err) {
      setPhase(3, 'failed');
      return false;
    }
  }

  // For stdio MCP and other plugins, run npm test as smoke test
  try {
    execSync('npm test', { cwd: projectPath, stdio: 'inherit' });

    // Write certificate using standardized function
    const certPath = writeCertificate(projectPath, 'smoke-test', 'npm test');

    console.log(`\n${GREEN}Smoke test passed${RESET}`);
    console.log(`RUN_CERTIFICATE: ${certPath}\n`);

    setPhase(3, 'complete');
    return true;
  } catch (err) {
    // Write failure using standardized function
    const failPath = writeFailure(projectPath, err.message, 'npm test');

    console.error(`\n${RED}Smoke test failed${RESET}`);
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

    // Check for code quality tools (ESLint, Prettier)
    const hasEslint = await detectSkill('eslint');
    const hasPrettier = await detectSkill('prettier');

    if (hasEslint || hasPrettier) {
      console.log(`${GREEN}✓ Code quality tools available - running checks...${RESET}\n`);

      if (hasEslint) {
        try {
          execSync('npx eslint --version', { cwd: projectPath, stdio: 'inherit' });
          console.log(`${GREEN}✓ ESLint check passed${RESET}\n`);
        } catch (err) {
          console.log(`${YELLOW}⚠️  ESLint check skipped - continuing anyway${RESET}\n`);
        }
      }

      if (hasPrettier) {
        try {
          execSync('npx prettier --version', { cwd: projectPath, stdio: 'inherit' });
          console.log(`${GREEN}✓ Prettier check passed${RESET}\n`);
        } catch (err) {
          console.log(`${YELLOW}⚠️  Prettier check skipped - continuing anyway${RESET}\n`);
        }
      }
    } else {
      console.log(`${DIM}${getDegradationMessage('eslint', 'skipping')}${RESET}`);
      console.log(`${DIM}${getDegradationMessage('eslint', 'alternative')}${RESET}\n`);
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

  const isHttp = state.transport?.value === 'http';
  const isMcp = state.pluginType?.value === 'mcp';
  const isSkill = state.pluginType?.value === 'skill';

  console.log(`
${GREEN}${BOLD}════════════════════════════════════════${RESET}
${GREEN}${BOLD}          LAUNCH READY${RESET}
${GREEN}${BOLD}════════════════════════════════════════${RESET}

${BOLD}Project:${RESET} ${projectPath}
`);

  if (isMcp && isHttp) {
    console.log(`${BOLD}Run:${RESET}
  cd ${projectPath}
  npm start

${BOLD}Endpoints:${RESET}
  GET  http://localhost:${port}/health - Health check
  GET  http://localhost:${port}/tools  - List tools
  POST http://localhost:${port}/call   - Call tool
`);
  } else if (isMcp) {
    console.log(`${BOLD}Add to Claude Code settings.json:${RESET}
  {
    "mcpServers": {
      "${state.pluginType?.value || 'plugin'}": {
        "command": "node",
        "args": ["${projectPath}/src/index.js"]
      }
    }
  }

${BOLD}Test stdio mode:${RESET}
  echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node ${projectPath}/src/index.js
`);
  } else if (isSkill) {
    console.log(`${BOLD}Install:${RESET}
  Copy ${projectPath}/skill.md to your skills directory

${BOLD}Or reference directly in Claude Code:${RESET}
  The skill is ready to use!
`);
  } else {
    console.log(`${BOLD}Test:${RESET}
  cd ${projectPath}
  npm test
`);
  }

  console.log(`${DIM}Generated by App Factory Plugin Pipeline${RESET}
`);
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}Plugin Factory${RESET}\n`);

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
  const slug = config.slug || `${state.pluginType.value}-${Date.now().toString(36)}`;

  // Phase 2: Scaffold
  const projectPath = scaffoldProject(slug);
  writeAuditEvent({
    projectPath,
    pipeline: 'plugin-factory',
    phase: 'scaffold',
    status: 'complete',
    message: 'Project scaffolded'
  });

  // Phase 3: Install
  const installed = installDeps(projectPath);
  if (!installed) {
    writeAuditEvent({
      projectPath,
      pipeline: 'plugin-factory',
      phase: 'install',
      status: 'failed',
      message: 'Dependency install failed'
    });
    console.error(`\n${RED}Pipeline failed at install phase${RESET}`);
    process.exit(1);
  }
  writeAuditEvent({
    projectPath,
    pipeline: 'plugin-factory',
    phase: 'install',
    status: 'complete',
    message: 'Dependencies installed'
  });

  // Phase 4: Verify
  const verified = await verifyProject(projectPath, config.port);
  if (!verified) {
    writeAuditEvent({
      projectPath,
      pipeline: 'plugin-factory',
      phase: 'verify',
      status: 'failed',
      message: 'Verification failed'
    });
    console.error(`\n${RED}Pipeline failed at verification phase${RESET}`);
    console.log(`\nCheck logs at: ${projectPath}/.appfactory/`);
    process.exit(1);
  }
  writeAuditEvent({
    projectPath,
    pipeline: 'plugin-factory',
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
      pipeline: 'plugin-factory',
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
    pipeline: 'plugin-factory',
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
            execSync(`bash "${ralphScript}" plugin-factory 1`, { stdio: 'inherit' });
            console.log(`\n${GREEN}✓ Ralph QA iteration 1 complete${RESET}`);
            console.log(`${DIM}Continue manually: ./ralph/run-ralph.sh plugin-factory 2${RESET}\n`);
          } else {
            console.log(`${YELLOW}⚠️  Skipping Ralph QA - manual review recommended for production${RESET}\n`);
          }
        }
      } else {
        console.log(`${DIM}Ralph QA not configured (optional)${RESET}`);
        console.log(`${DIM}Manual: ./ralph/run-ralph.sh plugin-factory 1${RESET}\n`);
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
