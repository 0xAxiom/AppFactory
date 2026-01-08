#!/usr/bin/env node

/**
 * Web3 Factory Bags SDK Token Creation Script
 * 
 * This script creates Solana tokens using the official Bags SDK with deterministic
 * idempotency and proper fee routing configuration.
 * 
 * Usage: npx tsx create_token_with_bags.ts <config_path> <output_path>
 * 
 * Environment Variables Required:
 * - BAGS_API_KEY: Bags API key from dev.bags.fm
 * - SOLANA_RPC_URL: Solana RPC endpoint
 * - CREATOR_WALLET_ADDRESS: Creator's wallet public key
 * - APP_FACTORY_PARTNER_KEY: Fixed partner key for fee routing
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

// Import statements for actual implementation
// TODO: Install and import actual Bags SDK when available
// import { BagsSDK } from '@bagsfm/bags-sdk';
// import { Connection, PublicKey } from '@solana/web3.js';

interface TokenConfig {
  buildId: string;
  inputHash: string;
  tokenConfig: {
    name: string;
    symbol: string;
    description: string;
    totalSupply: string;
    decimals: number;
  };
  feeRouting: {
    creator: { percentage: number };
    partner: { key: string; percentage: number };
  };
  createdAt: string;
}

interface TokenReceipt {
  buildId: string;
  tokenAddress: string;
  transactionId: string;
  createdAt: string;
  inputHash: string;
  network: string;
  feeRouting: {
    creator: { address: string; percentage: number };
    partner: { address: string; percentage: number };
  };
  bagsIntegration: {
    sdkVersion: string;
    apiEndpoint: string;
    partnerKey: string;
  };
}

class BagsTokenCreator {
  private apiKey: string;
  private rpcUrl: string;
  private creatorAddress: string;
  private partnerKey: string;
  private network: string;

  constructor() {
    // Environment validation
    this.apiKey = this.requireEnv('BAGS_API_KEY');
    this.rpcUrl = this.requireEnv('SOLANA_RPC_URL');
    this.creatorAddress = this.requireEnv('CREATOR_WALLET_ADDRESS');
    this.partnerKey = this.requireEnv('APP_FACTORY_PARTNER_KEY');
    this.network = this.rpcUrl.includes('devnet') ? 'devnet' : 'mainnet-beta';
  }

  private requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  async createToken(config: TokenConfig, outputPath: string): Promise<TokenReceipt> {
    console.log(`Creating token with build ID: ${config.buildId}`);
    
    // Check for existing receipt (idempotency)
    const receiptPath = path.join(path.dirname(outputPath), 'token_receipt.json');
    const existingReceipt = this.loadExistingReceipt(receiptPath);
    
    if (existingReceipt && existingReceipt.inputHash === config.inputHash) {
      console.log('Token already exists with matching input hash, skipping creation');
      return existingReceipt;
    }

    try {
      // Initialize Bags SDK
      // TODO: Replace with actual SDK initialization
      console.log('Initializing Bags SDK...');
      const sdk = await this.initializeBagsSDK();

      // Create token via Bags SDK
      console.log('Creating token via Bags SDK...');
      const tokenResult = await this.executeTokenCreation(sdk, config);

      // Generate receipt
      const receipt: TokenReceipt = {
        buildId: config.buildId,
        tokenAddress: tokenResult.tokenAddress,
        transactionId: tokenResult.transactionId,
        createdAt: new Date().toISOString(),
        inputHash: config.inputHash,
        network: this.network,
        feeRouting: {
          creator: { 
            address: this.creatorAddress, 
            percentage: config.feeRouting.creator.percentage 
          },
          partner: { 
            address: config.feeRouting.partner.key, 
            percentage: config.feeRouting.partner.percentage 
          }
        },
        bagsIntegration: {
          sdkVersion: this.getBagsSDKVersion(),
          apiEndpoint: 'https://public-api-v2.bags.fm/api/v1/',
          partnerKey: this.partnerKey
        }
      };

      // Write receipt to disk
      this.writeReceipt(receipt, receiptPath);
      this.writeTokenPlan(config, path.join(path.dirname(outputPath), 'token_plan.json'));
      this.writeReadableReceipt(receipt, path.join(path.dirname(outputPath), 'token_receipt.md'));

      console.log(`Token created successfully: ${receipt.tokenAddress}`);
      return receipt;

    } catch (error) {
      console.error('Token creation failed:', error);
      this.writeErrorLog(error, config, outputPath);
      throw error;
    }
  }

  private async initializeBagsSDK(): Promise<any> {
    // TODO: Replace with actual Bags SDK initialization
    // const connection = new Connection(this.rpcUrl, 'processed');
    // const sdk = new BagsSDK(this.apiKey, connection, 'processed');
    // return sdk;
    
    // Placeholder implementation
    console.log(`Initializing SDK with API key: ${this.apiKey.substring(0, 8)}...`);
    console.log(`RPC URL: ${this.rpcUrl}`);
    console.log(`Network: ${this.network}`);
    
    return {
      // Mock SDK object for development
      tokenLaunch: {
        createToken: async (params: any) => {
          // This would be the actual SDK call
          throw new Error('Bags SDK integration not yet implemented - requires actual SDK documentation');
        }
      }
    };
  }

  private async executeTokenCreation(sdk: any, config: TokenConfig): Promise<{ tokenAddress: string; transactionId: string }> {
    // TODO: Replace with actual Bags SDK token creation
    // const result = await sdk.tokenLaunch.createToken({
    //   name: config.tokenConfig.name,
    //   symbol: config.tokenConfig.symbol,
    //   description: config.tokenConfig.description,
    //   totalSupply: config.tokenConfig.totalSupply,
    //   decimals: config.tokenConfig.decimals,
    //   partnerKey: this.partnerKey,
    //   feeRouting: {
    //     creator: { address: this.creatorAddress, percentage: 75 },
    //     partner: { percentage: 25 }
    //   }
    // });
    // 
    // return {
    //   tokenAddress: result.tokenMint.toString(),
    //   transactionId: result.signature
    // };

    // Mock implementation for development
    console.log('Token creation parameters:', {
      name: config.tokenConfig.name,
      symbol: config.tokenConfig.symbol,
      description: config.tokenConfig.description,
      totalSupply: config.tokenConfig.totalSupply,
      decimals: config.tokenConfig.decimals,
      partnerKey: this.partnerKey,
      creatorAddress: this.creatorAddress
    });

    // Simulate token creation failure to show error handling
    throw new Error('Token creation requires actual Bags SDK implementation. See docs/bags_implementation.md for integration details.');
  }

  private loadExistingReceipt(receiptPath: string): TokenReceipt | null {
    try {
      if (fs.existsSync(receiptPath)) {
        const receiptData = fs.readFileSync(receiptPath, 'utf8');
        return JSON.parse(receiptData) as TokenReceipt;
      }
    } catch (error) {
      console.warn(`Failed to load existing receipt: ${error}`);
    }
    return null;
  }

  private writeReceipt(receipt: TokenReceipt, receiptPath: string): void {
    fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
    console.log(`Receipt written to: ${receiptPath}`);
  }

  private writeTokenPlan(config: TokenConfig, planPath: string): void {
    fs.mkdirSync(path.dirname(planPath), { recursive: true });
    fs.writeFileSync(planPath, JSON.stringify(config, null, 2));
    console.log(`Token plan written to: ${planPath}`);
  }

  private writeReadableReceipt(receipt: TokenReceipt, readablePath: string): void {
    const markdown = `# Token Creation Receipt

## Token Information
- **Name**: ${receipt.tokenAddress ? 'Token created successfully' : 'Token creation failed'}
- **Address**: ${receipt.tokenAddress || 'N/A'}
- **Network**: ${receipt.network}
- **Created**: ${receipt.createdAt}

## Fee Routing
- **Creator**: ${receipt.feeRouting.creator.percentage}% → ${receipt.feeRouting.creator.address}
- **App Factory Partner**: ${receipt.feeRouting.partner.percentage}% → ${receipt.feeRouting.partner.address}

## Integration Details
- **Bags SDK**: ${receipt.bagsIntegration.sdkVersion}
- **Transaction**: ${receipt.transactionId || 'N/A'}
- **Build ID**: ${receipt.buildId}

## Verification
${receipt.tokenAddress ? `View on Solana Explorer: https://solscan.io/token/${receipt.tokenAddress}` : 'Token creation failed - see error logs'}
`;

    fs.writeFileSync(readablePath, markdown);
    console.log(`Readable receipt written to: ${readablePath}`);
  }

  private writeErrorLog(error: any, config: TokenConfig, outputPath: string): void {
    const errorLog = {
      error: error.message,
      stack: error.stack,
      config: config,
      timestamp: new Date().toISOString(),
      environment: {
        network: this.network,
        rpcUrl: this.rpcUrl.replace(/api-key=[^&]+/, 'api-key=***'),
        hasApiKey: !!this.apiKey,
        hasCreatorAddress: !!this.creatorAddress
      }
    };

    const errorPath = path.join(path.dirname(outputPath), 'token_creation_error.json');
    fs.mkdirSync(path.dirname(errorPath), { recursive: true });
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`Error log written to: ${errorPath}`);
  }

  private getBagsSDKVersion(): string {
    try {
      // TODO: Get actual SDK version
      // const packageJson = JSON.parse(fs.readFileSync('node_modules/@bagsfm/bags-sdk/package.json', 'utf8'));
      // return `@bagsfm/bags-sdk@${packageJson.version}`;
      return '@bagsfm/bags-sdk@1.x.x';
    } catch {
      return '@bagsfm/bags-sdk@unknown';
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: npx tsx create_token_with_bags.ts <config_path> <output_path>');
    console.error('');
    console.error('Environment variables required:');
    console.error('  BAGS_API_KEY - Bags API key from dev.bags.fm');
    console.error('  SOLANA_RPC_URL - Solana RPC endpoint');
    console.error('  CREATOR_WALLET_ADDRESS - Creator wallet public key');
    console.error('  APP_FACTORY_PARTNER_KEY - App Factory partner key');
    process.exit(1);
  }

  const [configPath, outputPath] = args;

  // Validate input file
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  try {
    // Load token configuration
    const configData = fs.readFileSync(configPath, 'utf8');
    const config: TokenConfig = JSON.parse(configData);

    // Create token
    const creator = new BagsTokenCreator();
    const receipt = await creator.createToken(config, outputPath);

    console.log('✅ Token creation completed successfully');
    console.log(`Token Address: ${receipt.tokenAddress}`);
    console.log(`Transaction ID: ${receipt.transactionId}`);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Token creation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

export { BagsTokenCreator, TokenConfig, TokenReceipt };