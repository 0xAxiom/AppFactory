#!/usr/bin/env node

/**
 * Web3 Factory CLI Entry Point
 * 
 * Provides the `web3 idea <IDEA_TEXT>` command interface
 */

import { runWeb3Factory } from './pipeline/web3_pipeline';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Web3 Factory - Production-Grade Tokenized Web App Generator

Usage:
  web3 idea <IDEA_TEXT>    Generate a complete Web3 app from an idea

Example:
  web3 idea "A peer-to-peer marketplace for trading digital art with token-based reputation"

The Web3 Factory will:
  1. Validate the idea's Web3 necessity (W1)
  2. Define token role and economics (W2) 
  3. Design domain-authentic UI/UX (W3)
  4. Lock in web architecture (W4)
  5. Configure Bags SDK integration (W5)
  6. Validate runtime functionality (W6)  
  7. Generate and ship the final app (W7)

Output:
  - Run artifacts in: ./runs/
  - Built apps in: ./web3-builds/
`);
    process.exit(0);
  }

  const command = args[0];
  
  if (command === 'idea') {
    if (args.length < 2) {
      console.error('Error: Please provide an idea text');
      console.error('Usage: web3 idea <IDEA_TEXT>');
      process.exit(1);
    }

    const idea = args.slice(1).join(' ');
    const projectRoot = process.cwd();

    console.log('🏭 Starting Web3 Factory...');
    console.log(`💡 Idea: ${idea}`);
    console.log('');

    try {
      await runWeb3Factory(idea, projectRoot);
      console.log('');
      console.log('✅ Web3 Factory completed successfully!');
      console.log('📁 Check ./web3-builds/ for your generated app');
      console.log('📋 Check ./runs/ for detailed execution logs');
      
    } catch (error) {
      console.error('');
      console.error('❌ Web3 Factory failed:');
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }

  } else {
    console.error(`Unknown command: ${command}`);
    console.error('Available commands: idea');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions  
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main().catch(console.error);