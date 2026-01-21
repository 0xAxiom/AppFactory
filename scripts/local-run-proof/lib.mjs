/**
 * Local Run Proof - Helper Library
 *
 * Cross-platform utilities for process management, logging, hashing, and security.
 * @module scripts/local-run-proof/lib
 */

import { spawn, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { platform } from 'node:os';

// ============================================================================
// Constants
// ============================================================================

/**
 * Forbidden install flags that invalidate a clean install (R3 fix: comprehensive list)
 * These flags paper over dependency conflicts instead of fixing them.
 */
export const FORBIDDEN_INSTALL_FLAGS = [
  '--legacy-peer-deps',     // npm: bypasses peer dependency resolution
  '--force',                // npm: ignores errors
  '--ignore-engines',       // npm: ignores node version requirements
  '--ignore-scripts',       // npm: skips postinstall scripts (security risk if needed)
  '--shamefully-hoist',     // pnpm: hoists all deps to root, allows phantom dependencies
  '--skip-integrity-check', // yarn: bypasses lockfile integrity verification
  '--ignore-optional',      // yarn: skips optional dependencies
  '--ignore-platform',      // yarn: ignores platform-specific dependencies
  // R3 Sweep 2: additional bypass patterns
  '--no-audit',             // npm/yarn: skips security audit checks
  '--no-shrinkwrap',        // npm: ignores npm-shrinkwrap.json locked versions
  '--frozen-lockfile=false', // yarn/pnpm: explicitly disables lockfile enforcement
  '--no-frozen-lockfile',   // pnpm: allows lockfile mutations
  '--no-immutable',         // yarn berry: allows lockfile changes (yarn 2+)
  '--unsafe-perm',          // npm: runs scripts as root (security risk)
  '--prefer-offline',       // npm/yarn/pnpm: can use stale cached versions
];

/**
 * Dangerous command patterns that indicate injection attempts.
 * With shell:false, most shell metacharacters are harmless, but we still block:
 * - Command chaining: ;, &&, ||
 * - Command substitution: ``, $()
 * - Newlines (could inject commands in some contexts)
 * Note: (){}[]<>*?!~ are safe with shell:false since no shell interprets them.
 */
export const SHELL_INJECTION_PATTERN = /[;\n\r]|&&|\|\||`|\$\(/;

/**
 * Secret patterns to redact from logs (case-insensitive)
 * Enhanced with URL-embedded secrets (R5 fix)
 */
export const SECRET_PATTERNS = [
  /API[_-]?KEY/i,
  /ANTHROPIC[_-]?API[_-]?KEY/i,
  /SECRET[_-]?KEY?/i,
  /PRIVATE[_-]?KEY/i,
  /[_-]?PASSWORD[_-]?/i,
  /\bMNEMONIC\b/i,
  /SEED[_-]?PHRASE?/i,
  /AUTH[_-]?TOKEN/i,
  /ACCESS[_-]?TOKEN/i,
  /REFRESH[_-]?TOKEN/i,
  /Bearer\s+[a-zA-Z0-9._-]+/i,
  // URL-embedded secrets (R5 fix)
  /[?&](api[_-]?key|token|secret|password)=[^&\s]+/gi,
  /#(access[_-]?token|id[_-]?token)=[^&\s]+/gi,
  /[a-z]+:\/\/[^:]+:[^@]+@/gi,  // user:pass@host in URLs
];

/**
 * High-entropy string pattern (likely secrets)
 */
export const HIGH_ENTROPY_PATTERN = /[a-zA-Z0-9+/=_-]{32,}/;

/**
 * Files to clean for deterministic install (R3 Sweep 2: comprehensive list)
 */
export const CLEAN_FILES = [
  'node_modules',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  '.next',
  '.turbo',
  'dist',
  'build',
  'out',              // Next.js static export
  '.yarn',            // Yarn 2+ PnP cache
  '.pnp.cjs',         // Yarn PnP linker
  '.pnp.js',          // Yarn PnP linker (legacy)
  '.cache',           // Various build tool caches
  'tsconfig.tsbuildinfo', // TypeScript incremental build
  '.eslintcache',     // ESLint cache
  // R3 Sweep 2: additional build artifacts
  '.vite',            // Vite cache (very common in 2026)
  '.expo',            // Expo cache (app-factory relevant)
  '.parcel-cache',    // Parcel bundler cache
  '.nuxt',            // Nuxt.js build directory
  '.svelte-kit',      // SvelteKit build directory
  '.docusaurus',      // Docusaurus build cache
  '.astro',           // Astro build cache
  'coverage',         // Jest/Vitest test coverage output
  '.nyc_output',      // NYC coverage tool output
];

/**
 * Lockfile names for detection
 */
export const LOCKFILE_MAP = {
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
};

/**
 * Allowed package manager commands (whitelist for safety)
 */
export const ALLOWED_COMMANDS = [
  'npm', 'npx', 'pnpm', 'yarn', 'bun', 'node', 'tsc', 'next', 'turbo',
];

// ============================================================================
// Command Validation (R5 fix: prevent command injection)
// ============================================================================

/**
 * Validates that a command is safe to execute
 * @param {string} command - Command to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateCommand(command) {
  if (!command || typeof command !== 'string') {
    return { valid: false, error: 'Command must be a non-empty string' };
  }

  const trimmed = command.trim();

  // Check for dangerous command patterns (R5 Sweep 2: focused on actual threats)
  if (SHELL_INJECTION_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: `Command contains dangerous patterns. For safety, commands must not contain: ; && || \` $() or newlines`,
    };
  }

  // Parse command and check first word is allowed
  const parts = parseCommand(trimmed);
  if (parts.length === 0) {
    return { valid: false, error: 'Empty command' };
  }

  const baseCmd = parts[0].toLowerCase();
  const isAllowed = ALLOWED_COMMANDS.some(allowed =>
    baseCmd === allowed || baseCmd.endsWith(`/${allowed}`) || baseCmd.endsWith(`\\${allowed}`)
  );

  if (!isAllowed) {
    return {
      valid: false,
      error: `Command '${parts[0]}' is not in the allowed list: ${ALLOWED_COMMANDS.join(', ')}`,
    };
  }

  return { valid: true };
}

// ============================================================================
// URL Validation
// ============================================================================

/**
 * Validates that a URL is safe (localhost only, http only) (R5 fix: strict http)
 * @param {string} url - URL to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUrl(url) {
  try {
    const parsed = new URL(url);

    // Only allow http protocol (no https, file://, etc.)
    if (parsed.protocol !== 'http:') {
      return {
        valid: false,
        error: `Invalid protocol: ${parsed.protocol}. Only http: is allowed for local verification.`,
      };
    }

    // Only allow localhost or 127.0.0.1
    const hostname = parsed.hostname.toLowerCase();
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return {
        valid: false,
        error: `Invalid hostname: ${hostname}. Only localhost or 127.0.0.1 allowed.`,
      };
    }

    // Reject URLs with credentials
    if (parsed.username || parsed.password) {
      return {
        valid: false,
        error: 'URLs with credentials are not allowed.',
      };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Invalid URL: ${e.message}` };
  }
}

/**
 * Expands {port} placeholder in URL
 * @param {string} url - URL with optional {port} placeholder
 * @param {number} port - Port number to insert
 * @returns {string}
 */
export function expandUrlPort(url, port) {
  return url.replace('{port}', String(port));
}

// ============================================================================
// Install Command Validation
// ============================================================================

/**
 * Checks if an install command contains forbidden flags
 * @param {string} command - Install command to check
 * @returns {{ valid: boolean, forbidden?: string }}
 */
export function validateInstallCommand(command) {
  const lowerCommand = command.toLowerCase();

  for (const flag of FORBIDDEN_INSTALL_FLAGS) {
    if (lowerCommand.includes(flag.toLowerCase())) {
      return {
        valid: false,
        forbidden: flag,
      };
    }
  }

  return { valid: true };
}

// ============================================================================
// Package Manager Detection
// ============================================================================

/**
 * Detects the package manager used in a project
 * @param {string} cwd - Project directory
 * @returns {string} - Package manager name
 */
export function detectPackageManager(cwd) {
  for (const [file, pm] of Object.entries(LOCKFILE_MAP)) {
    if (existsSync(join(cwd, file))) {
      return pm;
    }
  }
  return 'npm';
}

// ============================================================================
// Hashing
// ============================================================================

/**
 * Computes SHA256 hash of a file
 * @param {string} filePath - Path to file
 * @returns {string|null} - Hex hash or null if file doesn't exist
 */
export function hashFile(filePath) {
  try {
    const content = readFileSync(filePath);
    return createHash('sha256').update(content).digest('hex');
  } catch {
    return null;
  }
}

/**
 * Gets the current git commit hash
 * @param {string} cwd - Working directory
 * @returns {string|null}
 */
export function getGitCommit(cwd) {
  try {
    return execSync('git rev-parse HEAD', {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

// ============================================================================
// Log Redaction
// ============================================================================

/**
 * Redacts sensitive information from a line
 * @param {string} line - Log line to redact
 * @returns {string}
 */
export function redactLine(line) {
  // Check for secret patterns
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(line)) {
      return '[REDACTED - contains sensitive pattern]';
    }
  }

  // Check for high-entropy strings that look like tokens/keys
  if (HIGH_ENTROPY_PATTERN.test(line)) {
    // Only redact if it looks like an assignment, header, or contains certain keywords
    if (
      /[=:]\s*[a-zA-Z0-9+/=_-]{32,}/.test(line) ||
      /Authorization/i.test(line) ||
      /eyJ[a-zA-Z0-9_-]+/i.test(line) // JWT pattern
    ) {
      return line.replace(/[a-zA-Z0-9+/=_-]{32,}/g, '[REDACTED]');
    }
  }

  return line;
}

/**
 * Redacts an array of log lines
 * @param {string[]} lines - Log lines
 * @param {number} maxLines - Maximum lines to keep
 * @returns {string[]}
 */
export function redactLogs(lines, maxLines = 200) {
  const trimmed = lines.slice(-maxLines);
  return trimmed.map(redactLine);
}

// ============================================================================
// Process Management (R2 fix: improved cleanup)
// ============================================================================

/**
 * Spawns a command and captures output (R5 Sweep 2: validates command, no shell)
 * @param {string} command - Command to run
 * @param {object} options - Spawn options
 * @returns {Promise<{ code: number, stdout: string[], stderr: string[], duration: number }>}
 */
export function runCommand(command, options = {}) {
  // R5 Sweep 2 Critical Fix: Validate command FIRST before spawning
  const validation = validateCommand(command);
  if (!validation.valid) {
    return Promise.resolve({
      code: 1,
      stdout: [],
      stderr: [validation.error],
      duration: 0,
    });
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    const stdout = [];
    const stderr = [];
    let resolved = false;
    let timeoutId = null;

    // Safe resolve function to prevent double resolution (R2 fix)
    const safeResolve = (result) => {
      if (!resolved) {
        resolved = true;
        if (timeoutId) clearTimeout(timeoutId);
        resolve(result);
      }
    };

    // Parse command into parts
    const parts = parseCommand(command);
    const cmd = parts[0];
    const args = parts.slice(1);

    // R5 Sweep 2 Critical Fix: shell:false to prevent command injection
    const proc = spawn(cmd, args, {
      cwd: options.cwd,
      shell: false, // CRITICAL: Never use shell:true - prevents injection
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...options.env },
      // Create process group on Unix for easier cleanup
      detached: platform() !== 'win32',
    });

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      stdout.push(...lines);
    });

    proc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      stderr.push(...lines);
    });

    proc.on('close', (code) => {
      safeResolve({
        code: code ?? 1,
        stdout,
        stderr,
        duration: Date.now() - startTime,
      });
    });

    proc.on('error', (err) => {
      stderr.push(`Process error: ${err.message}`);
      safeResolve({
        code: 1,
        stdout,
        stderr,
        duration: Date.now() - startTime,
      });
    });

    // Handle timeout (R2 Sweep 2 fix: early return if already resolved)
    if (options.timeout) {
      timeoutId = setTimeout(() => {
        // R2 Sweep 2: Check resolved FIRST to prevent race condition
        if (resolved) return;

        if (proc.pid) {
          killProcessTree(proc.pid);
          stderr.push(`Process timed out after ${options.timeout}ms`);
        }

        safeResolve({
          code: 124, // Timeout exit code
          stdout,
          stderr,
          duration: Date.now() - startTime,
        });
      }, options.timeout);
    }
  });
}

/**
 * Starts a dev server and returns control (R5 Sweep 2: validates command, no shell)
 * @param {string} command - Dev server command
 * @param {object} options - Options
 * @returns {{ proc: ChildProcess, stdout: string[], stderr: string[], error?: string }}
 */
export function startDevServer(command, options = {}) {
  // R5 Sweep 2 Critical Fix: Validate command FIRST before spawning
  const validation = validateCommand(command);
  if (!validation.valid) {
    return {
      proc: null,
      stdout: [],
      stderr: [validation.error],
      error: validation.error,
    };
  }

  const stdout = [];
  const stderr = [];

  const parts = parseCommand(command);
  const cmd = parts[0];
  const args = parts.slice(1);

  // R5 Sweep 2 Critical Fix: shell:false to prevent command injection
  const proc = spawn(cmd, args, {
    cwd: options.cwd,
    shell: false, // CRITICAL: Never use shell:true - prevents injection
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, ...options.env },
    detached: platform() !== 'win32',
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    stdout.push(...lines);
    if (options.onStdout) options.onStdout(lines);
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    stderr.push(...lines);
    if (options.onStderr) options.onStderr(lines);
  });

  proc.on('error', (err) => {
    stderr.push(`Process error: ${err.message}`);
  });

  return { proc, stdout, stderr };
}

/**
 * Kills a process tree (R2 fix: improved cleanup logic)
 * @param {number} pid - Process ID
 */
export function killProcessTree(pid) {
  if (!pid) return;

  const plat = platform();
  const isWindows = plat === 'win32';

  try {
    if (isWindows) {
      // Windows: use taskkill with /T to kill tree
      execSync(`taskkill /T /F /PID ${pid}`, { stdio: 'pipe' });
    } else {
      // Unix: kill process group
      try {
        process.kill(-pid, 'SIGTERM');
      } catch {
        // Fallback to killing just the process
        try {
          process.kill(pid, 'SIGTERM');
        } catch {
          // Already dead
        }
      }
    }
  } catch {
    // Process might already be dead, ignore
  }

  // Force kill after 2s on all platforms (R2 fix: timeout for both platforms)
  setTimeout(() => {
    try {
      if (isWindows) {
        execSync(`taskkill /T /F /PID ${pid}`, { stdio: 'pipe' });
      } else {
        try {
          process.kill(-pid, 'SIGKILL');
        } catch {
          try {
            process.kill(pid, 'SIGKILL');
          } catch {
            // Already dead
          }
        }
      }
    } catch {
      // Already dead
    }
  }, 2000);
}

// ============================================================================
// Health Check
// ============================================================================

/**
 * Performs an HTTP health check
 * @param {string} url - URL to check
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<{ ok: boolean, status?: number, responseTime?: number, error?: string }>}
 */
export async function healthCheck(url, timeout = 5000) {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      ok: response.status === 200,
      status: response.status,
      responseTime: Date.now() - startTime,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.name === 'AbortError' ? 'Timeout' : err.message,
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Polls until health check passes or timeout
 * @param {string} url - URL to check
 * @param {number} timeout - Total timeout in ms
 * @param {number} interval - Poll interval in ms
 * @returns {Promise<{ ok: boolean, status?: number, responseTime?: number, error?: string, attempts: number }>}
 */
export async function pollHealthCheck(url, timeout = 90000, interval = 1000) {
  const deadline = Date.now() + timeout;
  let attempts = 0;
  let lastResult = { ok: false, error: 'No attempts made' };

  while (Date.now() < deadline) {
    attempts++;
    lastResult = await healthCheck(url, 5000);

    if (lastResult.ok) {
      return { ...lastResult, attempts };
    }

    await sleep(interval);
  }

  return {
    ...lastResult,
    attempts,
    error: `Health check failed after ${attempts} attempts: ${lastResult.error || 'Status ' + lastResult.status}`,
  };
}

// ============================================================================
// Browser Open
// ============================================================================

/**
 * Checks if running in CI/headless environment
 * @returns {boolean}
 */
export function isHeadless() {
  return (
    process.env.CI === 'true' ||
    process.env.HEADLESS === 'true' ||
    process.env.GITHUB_ACTIONS === 'true' ||
    process.env.GITLAB_CI === 'true' ||
    process.env.JENKINS_URL !== undefined ||
    process.env.BUILDKITE === 'true'
  );
}

/**
 * Opens a URL in the default browser
 * @param {string} url - URL to open (must be localhost)
 * @returns {Promise<{ opened: boolean, error?: string }>}
 */
export async function openBrowser(url) {
  // Validate URL is localhost
  const validation = validateUrl(url);
  if (!validation.valid) {
    return { opened: false, error: validation.error };
  }

  const plat = platform();

  try {
    // R5 Sweep 3: Use spawn with shell:false instead of execSync with string interpolation
    let cmd, args;
    if (plat === 'darwin') {
      cmd = 'open';
      args = [url];
    } else if (plat === 'win32') {
      cmd = 'cmd';
      args = ['/c', 'start', '""', url];
    } else {
      // Linux and others
      cmd = 'xdg-open';
      args = [url];
    }

    // Use spawn with shell:false to prevent command injection
    spawn(cmd, args, { stdio: 'pipe', shell: false, detached: true }).unref();
    return { opened: true };
  } catch (err) {
    return { opened: false, error: err.message };
  }
}

// ============================================================================
// File System Helpers (R2 fix: use fs.rm instead of shell commands)
// ============================================================================

/**
 * Removes files/directories for clean install
 * @param {string} cwd - Project directory
 * @param {string[]} files - Files to remove
 */
export function cleanBuildArtifacts(cwd, files = CLEAN_FILES) {
  const resolvedCwd = resolve(cwd);

  for (const file of files) {
    // R5 Sweep 2: Prevent path traversal attacks
    if (file.includes('..') || file.startsWith('/') || file.includes('\\')) {
      continue; // Skip dangerous paths
    }

    const filePath = join(resolvedCwd, file);
    const resolvedPath = resolve(filePath);

    // Ensure resolved path is still under cwd (prevent traversal)
    if (!resolvedPath.startsWith(resolvedCwd)) {
      continue; // Skip paths that escape cwd
    }

    if (existsSync(resolvedPath)) {
      try {
        // Use Node's fs.rmSync for cross-platform reliability (R2 fix)
        rmSync(resolvedPath, { recursive: true, force: true });
      } catch {
        // Ignore errors - file may be locked or already deleted
      }
    }
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sleep for specified milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse a command string into parts (simple shell-like parsing)
 * @param {string} command
 * @returns {string[]}
 */
export function parseCommand(command) {
  // Simple parsing - split on spaces but respect quotes
  const parts = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (const char of command) {
    if ((char === '"' || char === "'") && !inQuote) {
      inQuote = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = '';
    } else if (char === ' ' && !inQuote) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

/**
 * Extracts port from URL or finds a free port
 * @param {string} url - URL with port
 * @returns {number}
 */
export function extractPort(url) {
  try {
    const parsed = new URL(url);
    return parseInt(parsed.port, 10) || 3000;
  } catch {
    return 3000;
  }
}

/**
 * Creates a timestamp string for filenames
 * @returns {string}
 */
export function timestamp() {
  return new Date().toISOString();
}
