#!/usr/bin/env node
/**
 * Plugin Factory - Plugin Validator
 *
 * Validates Claude Code plugins and MCP servers against quality checklist.
 * Can be run independently or in CI/CD pipelines.
 *
 * Usage:
 *   node plugin-factory/scripts/validate-plugin.mjs <plugin-path>
 *   node plugin-factory/scripts/validate-plugin.mjs builds/my-plugin
 *
 * Options:
 *   --json     Output results as JSON
 *   --strict   Fail on warnings (not just errors)
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Valid hook event names (case-sensitive!)
const VALID_HOOK_EVENTS = [
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreCompact',
  'Notification'
];

// Common case mistakes to check for
const CASE_MISTAKES = {
  'pretooluse': 'PreToolUse',
  'posttooluse': 'PostToolUse',
  'sessionstart': 'SessionStart',
  'sessionend': 'SessionEnd',
  'userpromptsubmit': 'UserPromptSubmit',
  'precompact': 'PreCompact',
  'subagenstop': 'SubagentStop',
  'stop': 'Stop',
  'notification': 'Notification'
};

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { path: null, json: false, strict: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') config.json = true;
    else if (args[i] === '--strict') config.strict = true;
    else if (!args[i].startsWith('-')) config.path = args[i];
  }

  return config;
}

// Validation result collector
class ValidationResult {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
    this.pluginName = basename(pluginPath);
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.pluginType = null; // 'claude-code', 'mcp-server', 'hybrid'
  }

  error(category, message, fix = null) {
    this.errors.push({ category, message, fix });
  }

  warn(category, message, fix = null) {
    this.warnings.push({ category, message, fix });
  }

  pass(category, message) {
    this.passed.push({ category, message });
  }

  get score() {
    const total = this.errors.length + this.warnings.length + this.passed.length;
    if (total === 0) return 0;
    return Math.round((this.passed.length / total) * 100);
  }

  get isPassing() {
    return this.errors.length === 0 && this.score >= 97;
  }

  toJSON() {
    return {
      pluginPath: this.pluginPath,
      pluginName: this.pluginName,
      pluginType: this.pluginType,
      score: this.score,
      isPassing: this.isPassing,
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        passed: this.passed.length
      },
      errors: this.errors,
      warnings: this.warnings,
      passed: this.passed
    };
  }

  print() {
    console.log(`\n${BOLD}Plugin Validation Report${RESET}`);
    console.log(`${DIM}─────────────────────────────────────${RESET}`);
    console.log(`Plugin: ${CYAN}${this.pluginName}${RESET}`);
    console.log(`Type:   ${this.pluginType || 'unknown'}`);
    console.log(`Path:   ${DIM}${this.pluginPath}${RESET}`);
    console.log(`${DIM}─────────────────────────────────────${RESET}\n`);

    if (this.errors.length > 0) {
      console.log(`${RED}${BOLD}ERRORS (${this.errors.length})${RESET}`);
      for (const e of this.errors) {
        console.log(`  ${RED}✗${RESET} [${e.category}] ${e.message}`);
        if (e.fix) console.log(`    ${DIM}Fix: ${e.fix}${RESET}`);
      }
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log(`${YELLOW}${BOLD}WARNINGS (${this.warnings.length})${RESET}`);
      for (const w of this.warnings) {
        console.log(`  ${YELLOW}!${RESET} [${w.category}] ${w.message}`);
        if (w.fix) console.log(`    ${DIM}Fix: ${w.fix}${RESET}`);
      }
      console.log();
    }

    if (this.passed.length > 0) {
      console.log(`${GREEN}${BOLD}PASSED (${this.passed.length})${RESET}`);
      for (const p of this.passed) {
        console.log(`  ${GREEN}✓${RESET} [${p.category}] ${p.message}`);
      }
      console.log();
    }

    console.log(`${DIM}─────────────────────────────────────${RESET}`);
    const scoreColor = this.score >= 97 ? GREEN : (this.score >= 80 ? YELLOW : RED);
    console.log(`Score: ${scoreColor}${this.score}%${RESET}`);

    if (this.isPassing) {
      console.log(`\n${GREEN}${BOLD}✓ VALIDATION PASSED${RESET}\n`);
    } else {
      console.log(`\n${RED}${BOLD}✗ VALIDATION FAILED${RESET}`);
      if (this.errors.length > 0) {
        console.log(`${DIM}Fix ${this.errors.length} error(s) to pass validation.${RESET}\n`);
      } else {
        console.log(`${DIM}Score must be ≥97% to pass. Currently at ${this.score}%.${RESET}\n`);
      }
    }
  }
}

// Validators

function validatePluginJson(result, pluginPath) {
  const pluginJsonPath = join(pluginPath, '.claude-plugin', 'plugin.json');

  if (!existsSync(pluginJsonPath)) {
    result.error('structure', 'Missing .claude-plugin/plugin.json', 'Create plugin.json with name, version, and description');
    return;
  }

  try {
    const content = readFileSync(pluginJsonPath, 'utf-8');
    const json = JSON.parse(content);

    // Required fields
    if (!json.name) {
      result.error('plugin.json', 'Missing required field: name');
    } else {
      result.pass('plugin.json', 'Has name field');
    }

    if (!json.version) {
      result.error('plugin.json', 'Missing required field: version');
    } else {
      result.pass('plugin.json', 'Has version field');
    }

    if (!json.description) {
      result.warn('plugin.json', 'Missing description field', 'Add a description for better discoverability');
    } else {
      result.pass('plugin.json', 'Has description field');
    }

    // Valid JSON
    result.pass('plugin.json', 'Valid JSON syntax');

  } catch (err) {
    if (err instanceof SyntaxError) {
      result.error('plugin.json', `Invalid JSON: ${err.message}`, 'Fix JSON syntax errors');
    } else {
      result.error('plugin.json', `Error reading file: ${err.message}`);
    }
  }
}

function validateHooksJson(result, pluginPath) {
  const hooksJsonPath = join(pluginPath, 'hooks', 'hooks.json');

  if (!existsSync(hooksJsonPath)) {
    // Hooks are optional
    return;
  }

  try {
    const content = readFileSync(hooksJsonPath, 'utf-8');
    const json = JSON.parse(content);

    if (!Array.isArray(json.hooks)) {
      result.error('hooks.json', 'hooks must be an array');
      return;
    }

    result.pass('hooks.json', 'Valid JSON syntax');

    for (let i = 0; i < json.hooks.length; i++) {
      const hook = json.hooks[i];

      // Check event name case sensitivity
      if (hook.event) {
        if (VALID_HOOK_EVENTS.includes(hook.event)) {
          result.pass('hooks.json', `Hook ${i}: Valid event name "${hook.event}"`);
        } else {
          const lowercase = hook.event.toLowerCase();
          if (CASE_MISTAKES[lowercase]) {
            result.error('hooks.json',
              `Hook ${i}: Invalid event name "${hook.event}"`,
              `Use "${CASE_MISTAKES[lowercase]}" (exact case matters)`
            );
          } else {
            result.error('hooks.json',
              `Hook ${i}: Unknown event name "${hook.event}"`,
              `Valid events: ${VALID_HOOK_EVENTS.join(', ')}`
            );
          }
        }
      }

      // Check if command script exists
      if (hook.command) {
        const scriptPath = join(pluginPath, hook.command.replace('${CLAUDE_PLUGIN_ROOT}/', ''));
        if (!existsSync(scriptPath)) {
          result.error('hooks.json',
            `Hook ${i}: Script not found: ${hook.command}`,
            `Create the script at ${scriptPath}`
          );
        } else {
          result.pass('hooks.json', `Hook ${i}: Script exists`);
        }
      }
    }

  } catch (err) {
    if (err instanceof SyntaxError) {
      result.error('hooks.json', `Invalid JSON: ${err.message}`, 'Fix JSON syntax errors');
    } else {
      result.error('hooks.json', `Error reading file: ${err.message}`);
    }
  }
}

function validateCommands(result, pluginPath) {
  const commandsDir = join(pluginPath, 'commands');

  if (!existsSync(commandsDir)) {
    // Commands are optional
    return;
  }

  const files = readdirSync(commandsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = join(commandsDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Check for YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      result.error('commands',
        `${file}: Missing YAML frontmatter`,
        'Add frontmatter with name, description, and triggers'
      );
      continue;
    }

    const frontmatter = frontmatterMatch[1];

    // Check for required fields
    if (!frontmatter.includes('name:')) {
      result.error('commands', `${file}: Missing 'name' in frontmatter`);
    } else {
      // Check if name is lowercase
      const nameMatch = frontmatter.match(/name:\s*(.+)/);
      if (nameMatch && nameMatch[1].match(/[A-Z]/)) {
        result.warn('commands',
          `${file}: Command name should be lowercase`,
          'Use lowercase for command names'
        );
      } else {
        result.pass('commands', `${file}: Valid command name`);
      }
    }

    if (!frontmatter.includes('description:')) {
      result.warn('commands', `${file}: Missing 'description' in frontmatter`);
    } else {
      result.pass('commands', `${file}: Has description`);
    }
  }
}

function validateRequiredDocs(result, pluginPath) {
  const requiredDocs = ['README.md', 'INSTALL.md', 'SECURITY.md'];

  for (const doc of requiredDocs) {
    const docPath = join(pluginPath, doc);
    if (existsSync(docPath)) {
      const content = readFileSync(docPath, 'utf-8');
      if (content.trim().length < 50) {
        result.warn('docs', `${doc} exists but appears to be placeholder content`);
      } else {
        result.pass('docs', `${doc} exists and has content`);
      }
    } else {
      result.error('docs', `Missing required documentation: ${doc}`, `Create ${doc} with appropriate content`);
    }
  }
}

function validateMCPServer(result, pluginPath) {
  // Check for MCP server indicators
  const hasManifest = existsSync(join(pluginPath, 'manifest.json'));
  const hasServerIndex = existsSync(join(pluginPath, 'server', 'index.ts')) ||
                         existsSync(join(pluginPath, 'server', 'index.js'));
  const hasPackageJson = existsSync(join(pluginPath, 'package.json'));

  if (!hasManifest && !hasServerIndex) {
    return false; // Not an MCP server
  }

  result.pluginType = result.pluginType === 'claude-code' ? 'hybrid' : 'mcp-server';

  if (hasManifest) {
    try {
      const manifest = JSON.parse(readFileSync(join(pluginPath, 'manifest.json'), 'utf-8'));
      result.pass('mcp', 'manifest.json is valid JSON');
    } catch (err) {
      result.error('mcp', `Invalid manifest.json: ${err.message}`);
    }
  }

  if (hasPackageJson) {
    try {
      const pkg = JSON.parse(readFileSync(join(pluginPath, 'package.json'), 'utf-8'));

      if (pkg.scripts && pkg.scripts.build) {
        result.pass('mcp', 'Has build script');
      } else {
        result.warn('mcp', 'Missing build script in package.json');
      }
    } catch (err) {
      result.error('mcp', `Invalid package.json: ${err.message}`);
    }
  }

  return true;
}

function validateClaudeCodePlugin(result, pluginPath) {
  const hasPluginJson = existsSync(join(pluginPath, '.claude-plugin', 'plugin.json'));

  if (!hasPluginJson) {
    return false;
  }

  result.pluginType = result.pluginType === 'mcp-server' ? 'hybrid' : 'claude-code';

  // Check for common structure mistake: commands inside .claude-plugin
  const wrongCommandsPath = join(pluginPath, '.claude-plugin', 'commands');
  if (existsSync(wrongCommandsPath)) {
    result.error('structure',
      'Commands directory is inside .claude-plugin/ (INCORRECT)',
      'Move commands/ to plugin root. Only plugin.json goes in .claude-plugin/'
    );
  }

  // Check correct structure
  const correctCommandsPath = join(pluginPath, 'commands');
  if (existsSync(correctCommandsPath)) {
    result.pass('structure', 'Commands directory is at plugin root (correct)');
  }

  return true;
}

// Main validation function
function validatePlugin(pluginPath) {
  const absolutePath = resolve(pluginPath);

  if (!existsSync(absolutePath)) {
    console.error(`${RED}Error: Plugin path not found: ${absolutePath}${RESET}`);
    process.exit(1);
  }

  if (!statSync(absolutePath).isDirectory()) {
    console.error(`${RED}Error: Path is not a directory: ${absolutePath}${RESET}`);
    process.exit(1);
  }

  const result = new ValidationResult(absolutePath);

  // Determine plugin type and validate structure
  const isClaudeCode = validateClaudeCodePlugin(result, absolutePath);
  const isMCP = validateMCPServer(result, absolutePath);

  if (!isClaudeCode && !isMCP) {
    result.error('structure',
      'Not a valid plugin: missing both .claude-plugin/plugin.json and MCP server files',
      'Add .claude-plugin/plugin.json for Claude Code plugins or manifest.json for MCP servers'
    );
  }

  // Run validators
  if (isClaudeCode) {
    validatePluginJson(result, absolutePath);
    validateHooksJson(result, absolutePath);
    validateCommands(result, absolutePath);
  }

  validateRequiredDocs(result, absolutePath);

  return result;
}

// Main
function main() {
  const config = parseArgs();

  if (!config.path) {
    console.log(`
${BOLD}Plugin Validator${RESET}

Usage:
  node validate-plugin.mjs <plugin-path>

Options:
  --json     Output results as JSON
  --strict   Fail on warnings too

Examples:
  node validate-plugin.mjs builds/my-plugin
  node validate-plugin.mjs ../plugins/factory --json
`);
    process.exit(0);
  }

  const result = validatePlugin(config.path);

  if (config.json) {
    console.log(JSON.stringify(result.toJSON(), null, 2));
  } else {
    result.print();
  }

  // Exit code
  if (result.errors.length > 0) {
    process.exit(1);
  }
  if (config.strict && result.warnings.length > 0) {
    process.exit(1);
  }
  if (!result.isPassing) {
    process.exit(1);
  }

  process.exit(0);
}

main();
