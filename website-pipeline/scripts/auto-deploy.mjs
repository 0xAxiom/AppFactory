#!/usr/bin/env node
/**
 * Website Pipeline - Auto Deploy
 *
 * Automatically deploys website builds to Vercel with proper framework detection.
 * 
 * Usage:
 *   node website-pipeline/scripts/auto-deploy.mjs <build-name>
 *   node website-pipeline/scripts/auto-deploy.mjs ai-agent-directory
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'website-builds');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(message, color = '') {
  console.log(`${color}[auto-deploy]${RESET} ${message}`);
}

function validateBuild(buildPath) {
  if (!existsSync(buildPath)) {
    throw new Error(`Build directory not found: ${buildPath}`);
  }

  const packageJsonPath = join(buildPath, 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new Error(`package.json not found in ${buildPath}`);
  }

  log(`✅ Build validation passed: ${buildPath}`, GREEN);
  return true;
}

function deployToVercel(buildPath, buildName) {
  return new Promise((resolve, reject) => {
    log(`🚀 Starting Vercel deployment for ${buildName}...`, CYAN);

    const deployScript = join(__dirname, '../../dapp-factory/skills/vercel-deploy/scripts/deploy.sh');
    
    if (!existsSync(deployScript)) {
      reject(new Error(`Deploy script not found: ${deployScript}`));
      return;
    }

    const child = spawn('bash', [deployScript], {
      cwd: buildPath,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      // Log progress to user
      const lines = data.toString().split('\n').filter(l => l.trim());
      lines.forEach(line => {
        if (line.includes('[deploy]')) {
          log(line.replace('[deploy]', ''), YELLOW);
        }
      });
    });

    child.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse deploy response: ${stdout}`));
        }
      } else {
        reject(new Error(`Deployment failed with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (err) => {
      reject(new Error(`Spawn error: ${err.message}`));
    });
  });
}

async function main() {
  const buildName = process.argv[2];
  
  if (!buildName) {
    log('Usage: node auto-deploy.mjs <build-name>', RED);
    process.exit(1);
  }

  const buildPath = join(BUILDS_DIR, buildName);

  try {
    // Validate build
    validateBuild(buildPath);

    // Deploy to Vercel
    log(`📦 Deploying ${buildName} to Vercel...`, CYAN);
    const result = await deployToVercel(buildPath, buildName);

    // Success
    log(`✅ Deployment successful!`, GREEN);
    log(`🌐 Preview URL: ${result.previewUrl}`, GREEN);
    
    if (result.claimUrl) {
      log(`🔗 Claim URL: ${result.claimUrl}`, CYAN);
    }

    // Output JSON for programmatic use
    console.log('\n' + JSON.stringify(result, null, 2));

  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`, RED);
    process.exit(1);
  }
}

main().catch(console.error);