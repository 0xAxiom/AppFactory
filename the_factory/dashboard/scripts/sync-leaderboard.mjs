#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DASHBOARD_ROOT = join(__dirname, '..');
const REPO_ROOT = join(__dirname, '..', '..');
const GLOBAL_SOURCE = join(REPO_ROOT, 'leaderboards', 'app_factory_global.json');
const RAW_SOURCE = join(REPO_ROOT, 'leaderboards', 'app_factory_all_time.json');
const TARGET_PATH = join(DASHBOARD_ROOT, 'public', 'leaderboard.json');

async function syncLeaderboard() {
  try {
    console.log('🔄 Syncing leaderboard data...');

    // Ensure public directory exists
    await mkdir(join(DASHBOARD_ROOT, 'public'), { recursive: true });

    let sourcePath, sourceType;

    // Prefer global leaderboard if available
    try {
      await readFile(GLOBAL_SOURCE, 'utf-8');
      sourcePath = GLOBAL_SOURCE;
      sourceType = 'global';
      console.log('📂 Using global leaderboard (preferred)');
    } catch {
      sourcePath = RAW_SOURCE;
      sourceType = 'raw';
      console.log('📂 Using raw leaderboard (fallback)');
    }

    console.log(`📂 Source: ${sourcePath}`);
    console.log(`📂 Target: ${TARGET_PATH}`);

    // Read source leaderboard
    const data = await readFile(sourcePath, 'utf-8');
    
    // Validate JSON
    JSON.parse(data);
    
    // Write to dashboard public directory
    await writeFile(TARGET_PATH, data);
    
    console.log('✅ Leaderboard data synced successfully');
    console.log(`ℹ️  ${data.length} bytes copied`);
    
    // Show summary
    const parsed = JSON.parse(data);
    const entryCount = parsed.entries?.length || parsed.length || 0;
    console.log(`📊 ${entryCount} leaderboard entries available (${sourceType})`);
    
  } catch (error) {
    console.error('❌ Failed to sync leaderboard data:');
    console.error(error.message);
    
    if (error.code === 'ENOENT') {
      console.log('\n💡 Tips:');
      console.log('   • Make sure you are running this from the dashboard directory');
      console.log('   • Ensure leaderboard files exist at ../leaderboards/');
      console.log('   • Try running "run app factory" first to generate leaderboard data');
    }
    
    process.exit(1);
  }
}

syncLeaderboard();