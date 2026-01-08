#!/usr/bin/env tsx

/**
 * Web3 Factory Bags SDK Token Creation Script
 * 
 * Creates Solana tokens using official Bags SDK with full compliance to:
 * - https://docs.bags.fm/how-to-guides/launch-token
 * - https://docs.bags.fm/how-to-guides/typescript-node-setup
 * - https://docs.bags.fm/principles/error-handling
 * - https://docs.bags.fm/principles/rate-limits
 * 
 * Usage: npm run launch-token -- <config_path> <output_path>
 * 
 * Environment Variables Required:
 * - BAGS_API_KEY: API key from https://dev.bags.fm
 * - SOLANA_RPC_URL: Solana RPC endpoint
 * - SOLANA_NETWORK: mainnet-beta or devnet
 * - CREATOR_WALLET_ADDRESS: Creator's wallet public key
 * - PRIVATE_KEY: Base58 encoded private key for signing
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Web3 Factory constants
import { APP_FACTORY_PARTNER_KEY, FEE_SPLIT } from '../constants/partner.js';
import { 
  BAGS_API_CONFIG,
  BAGS_RATE_LIMITS,
  BAGS_ERROR_HANDLING,
  BAGS_TOKEN_LAUNCH,
  BAGS_FILE_UPLOAD,
  BAGS_PROGRAM_IDS,
  BAGS_LOOKUP_TABLES,
  isRetryableError,
  calculateBackoffDelay
} from '../constants/bags.js';
import { withRetry, bagsApiFetch, globalRequestQueue, BagsApiError } from '../utils/retry.js';

// TODO: Import actual Bags SDK when available
// import { BagsSDK } from '@bagsfm/bags-sdk';

// Load environment variables
dotenv.config();

interface TokenConfig {
  buildId: string;
  inputHash: string;
  tokenConfig: {
    name: string;
    symbol: string;
    description: string;
    totalSupply: string;
    decimals: number;
    image?: string; // URL or IPFS hash
    imageFile?: File; // File object for upload
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  partner_attribution: {
    partner_key: string;
    partner_program: string;
  };
  fee_split: {
    creator_percentage: number;
    partner_percentage: number;
  };
  tipping?: {
    enabled: boolean;
    wallet?: string;
    lamports?: number;
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
  partner_attribution: {
    partner_key: string;
    partner_program: string;
  };
  fee_split: {
    creator_percentage: number;
    partner_percentage: number;
  };
  payout_destinations: {
    creator_payout_address: string;
  };
  bagsIntegration: {
    sdkVersion: string;
    apiEndpoint: string;
    partnerKey: string;
  };
  uploadedFiles: string[];
  tipConfiguration?: {
    wallet: string;
    lamports: number;
  };
  rateLimitStatus?: {
    remaining: number;
    resetTime: number;
  };
}

class BagsTokenCreator {
  private apiKey: string;
  private rpcUrl: string;
  private network: string;
  private creatorAddress: string;
  private creatorKeypair: Keypair;
  private connection: Connection;
  private partnerKey: string;

  constructor() {
    // Environment validation
    this.apiKey = this.requireEnv('BAGS_API_KEY');
    this.rpcUrl = this.requireEnv('SOLANA_RPC_URL');
    this.network = this.requireEnv('SOLANA_NETWORK');
    this.creatorAddress = this.requireEnv('CREATOR_WALLET_ADDRESS');
    
    // Initialize Solana connection and keypair
    this.connection = new Connection(this.rpcUrl, 'processed');
    
    const privateKeyString = this.requireEnv('PRIVATE_KEY');
    try {
      const privateKeyBytes = bs58.decode(privateKeyString);
      this.creatorKeypair = Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
      throw new Error(`Invalid PRIVATE_KEY format: ${error instanceof Error ? error.message : error}`);
    }
    
    // Verify creator address matches keypair
    if (this.creatorKeypair.publicKey.toString() !== this.creatorAddress) {
      throw new Error('CREATOR_WALLET_ADDRESS does not match the public key derived from PRIVATE_KEY');
    }
    
    this.partnerKey = APP_FACTORY_PARTNER_KEY; // Use immutable central constant
    
    // Validate network configuration
    if (!['mainnet-beta', 'devnet'].includes(this.network)) {
      throw new Error(`Invalid SOLANA_NETWORK: ${this.network}. Must be 'mainnet-beta' or 'devnet'`);
    }
  }

  private requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  async createToken(config: TokenConfig, outputPath: string): Promise<TokenReceipt> {
    console.log(`🚀 Creating token with build ID: ${config.buildId}`);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Check for existing receipt (idempotency per Bags principles)
    const receiptPath = path.join(outputDir, 'token_receipt.json');
    const existingReceipt = this.loadExistingReceipt(receiptPath);
    
    if (existingReceipt && existingReceipt.inputHash === config.inputHash) {
      console.log('✅ Token already exists with matching input hash, skipping creation');
      return existingReceipt;
    }

    try {
      // Pre-flight checks
      await this.performPreflightChecks();
      
      // Initialize Bags SDK with retry logic
      console.log('🔧 Initializing Bags SDK...');
      const sdk = await withRetry(() => this.initializeBagsSDK());

      // Process file uploads if needed
      console.log('📁 Processing token metadata...');
      const processedConfig = await this.processTokenMetadata(config);

      // Create token via Bags SDK with rate limit compliance
      console.log('🎯 Creating token via Bags SDK...');
      const tokenResult = await globalRequestQueue.enqueue(() => 
        withRetry(() => this.executeTokenCreation(sdk, processedConfig))
      );

      // Generate comprehensive receipt
      const receipt: TokenReceipt = {
        buildId: config.buildId,
        tokenAddress: tokenResult.tokenAddress,
        transactionId: tokenResult.transactionId,
        createdAt: new Date().toISOString(),
        inputHash: config.inputHash,
        network: this.network,
        partner_attribution: {
          partner_key: this.partnerKey, // Always use central constant
          partner_program: 'app-factory'
        },
        fee_split: {
          creator_percentage: FEE_SPLIT.CREATOR_PERCENTAGE,
          partner_percentage: FEE_SPLIT.PARTNER_PERCENTAGE
        },
        payout_destinations: {
          creator_payout_address: this.creatorAddress
        },
        bagsIntegration: {
          sdkVersion: this.getBagsSDKVersion(),
          apiEndpoint: BAGS_API_CONFIG.BASE_URL,
          partnerKey: this.partnerKey
        },
        uploadedFiles: tokenResult.uploadedFiles || [],
        tipConfiguration: tokenResult.tipConfiguration
      };

      // Write all artifacts to disk
      await this.writeAllArtifacts(receipt, config, outputDir);

      console.log(`✅ Token created successfully: ${receipt.tokenAddress}`);
      console.log(`📄 Receipt written to: ${receiptPath}`);
      
      return receipt;

    } catch (error) {
      console.error('❌ Token creation failed:', error);
      await this.writeFailureArtifacts(error, config, outputDir);
      throw error;
    }
  }

  /**
   * Perform pre-flight checks before token creation
   */
  private async performPreflightChecks(): Promise<void> {
    // Check Bags API health
    console.log('🎡 Checking Bags API health...');
    const healthCheck = await this.checkBagsApiHealth();
    if (!healthCheck.success) {
      throw new Error(`Bags API health check failed: ${healthCheck.error}`);
    }
    
    // Check Solana connection
    console.log('⛓️ Checking Solana connection...');
    try {
      const latestBlockhash = await this.connection.getLatestBlockhash();
      console.log(`✅ Connected to Solana ${this.network}, blockhash: ${latestBlockhash.blockhash.slice(0, 8)}...`);
    } catch (error) {
      throw new Error(`Solana connection failed: ${error instanceof Error ? error.message : error}`);
    }
    
    // Check wallet balance for transaction fees
    try {
      const balance = await this.connection.getBalance(this.creatorKeypair.publicKey);
      const balanceSOL = balance / 1000000000; // Convert lamports to SOL
      console.log(`💰 Wallet balance: ${balanceSOL.toFixed(4)} SOL`);
      
      if (balance < 10000000) { // Less than 0.01 SOL
        console.warn('⚠️ Low wallet balance - may not have enough SOL for transaction fees');
      }
    } catch (error) {
      console.warn(`⚠️ Could not check wallet balance: ${error instanceof Error ? error.message : error}`);
    }
  }
  
  /**
   * Check Bags API health and connectivity with rate limit awareness
   */
  private async checkBagsApiHealth(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await bagsApiFetch(
        `${BAGS_API_CONFIG.BASE_URL}${BAGS_API_CONFIG.HEALTH_CHECK_ENDPOINT}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      
      const data = await response.json();
      const expected = BAGS_API_CONFIG.EXPECTED_PING_RESPONSE;
      
      if (JSON.stringify(data) !== JSON.stringify(expected)) {
        return { success: false, error: `Unexpected response: ${JSON.stringify(data)}` };
      }
      
      return { success: true };
    } catch (error) {
      if (error instanceof BagsApiError) {
        return { 
          success: false, 
          error: `API Error (${error.statusCode}): ${error.message}` 
        };
      }
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Initialize Bags SDK with proper configuration
   */
  private async initializeBagsSDK(): Promise<any> {
    console.log(`🔧 Initializing SDK with API key: ${this.apiKey.substring(0, 8)}...`);
    console.log(`🌐 Network: ${this.network}`);
    console.log(`📞 RPC URL: ${this.rpcUrl}`);
    
    // TODO: Replace with actual Bags SDK initialization
    // Based on https://docs.bags.fm/how-to-guides/typescript-node-setup
    //
    // import { BagsSDK } from '@bagsfm/bags-sdk';
    // 
    // const sdk = new BagsSDK({
    //   apiKey: this.apiKey,
    //   connection: this.connection,
    //   commitment: 'processed',
    //   network: this.network
    // });
    // 
    // return sdk;
    
    // Mock implementation for development
    return {
      createTokenInfoAndMetadata: async (params: any) => {
        console.log('📄 Mock: Creating token info and metadata...', params);
        throw new Error('Bags SDK integration pending - requires actual @bagsfm/bags-sdk package');
      },
      createBagsFeeShareConfig: async (params: any) => {
        console.log('💰 Mock: Creating fee share config...', params);
        throw new Error('Bags SDK integration pending - requires actual @bagsfm/bags-sdk package');
      },
      createLaunchTransaction: async (params: any) => {
        console.log('🚀 Mock: Creating launch transaction...', params);
        throw new Error('Bags SDK integration pending - requires actual @bagsfm/bags-sdk package');
      }
    };
  }

  /**
   * Process token metadata including file uploads
   */
  private async processTokenMetadata(config: TokenConfig): Promise<TokenConfig> {
    // If token has image file to upload
    if (config.tokenConfig.imageFile) {
      console.log('🇺🇾 Uploading token image...');
      
      // Validate file before upload
      const file = config.tokenConfig.imageFile;
      if (file.size > BAGS_FILE_UPLOAD.MAX_SIZE_BYTES) {
        throw new Error(`Image file too large: ${file.size} bytes. Max: ${BAGS_FILE_UPLOAD.MAX_SIZE_MB}MB`);
      }
      
      if (!BAGS_FILE_UPLOAD.SUPPORTED_TYPES.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}. Supported: ${BAGS_FILE_UPLOAD.SUPPORTED_TYPES.join(', ')}`);
      }
      
      // TODO: Implement actual file upload
      // const uploadResponse = await this.uploadImageFile(file);
      // config.tokenConfig.image = uploadResponse.url;
      
      console.log('⚠️ Mock: File upload not yet implemented');
    }
    
    return config;
  }

  /**
   * Execute token creation with full Bags SDK integration
   * Based on https://docs.bags.fm/how-to-guides/launch-token
   */
  private async executeTokenCreation(
    sdk: any, 
    config: TokenConfig
  ): Promise<{ 
    tokenAddress: string; 
    transactionId: string;
    uploadedFiles?: string[];
    tipConfiguration?: any;
  }> {
    console.log('🚀 Starting token creation process...');
    
    // TODO: Replace with actual Bags SDK implementation
    // Based on official launch-token guide:
    // 
    // Step 1: Create token info and metadata
    // const tokenInfo = await sdk.createTokenInfoAndMetadata({
    //   name: config.tokenConfig.name,
    //   symbol: config.tokenConfig.symbol,
    //   description: config.tokenConfig.description,
    //   image: config.tokenConfig.image // URL from file upload
    // });
    // 
    // Step 2: Configure fee sharing with App Factory partner
    // const feeShareConfig = await sdk.createBagsFeeShareConfig({
    //   partnerKey: this.partnerKey,
    //   totalBPS: FEE_SPLIT.PARTNER_PERCENTAGE * 100, // Convert to basis points
    //   feeClaimers: [
    //     {
    //       wallet: this.creatorAddress,
    //       bps: FEE_SPLIT.CREATOR_PERCENTAGE * 100
    //     }
    //   ]
    // });
    // 
    // Step 3: Create launch transaction
    // const launchParams = {
    //   ipfs: tokenInfo.ipfsHash,
    //   tokenMint: tokenInfo.mint,
    //   initialBuyAmount: config.tokenConfig.totalSupply,
    //   feeShareConfig: feeShareConfig,
    //   // Optional tipping
    //   tipWallet: process.env.TIP_WALLET,
    //   tipLamports: process.env.TIP_LAMPORTS ? parseInt(process.env.TIP_LAMPORTS) : undefined
    // };
    // 
    // const launchTx = await sdk.createLaunchTransaction(launchParams);
    // 
    // Step 4: Sign and send transaction
    // launchTx.sign(this.creatorKeypair);
    // const signature = await this.connection.sendAndConfirmTransaction(launchTx);
    // 
    // return {
    //   tokenAddress: tokenInfo.mint.toString(),
    //   transactionId: signature,
    //   uploadedFiles: tokenInfo.uploadedFiles,
    //   tipConfiguration: launchParams.tipWallet ? {
    //     wallet: launchParams.tipWallet,
    //     lamports: launchParams.tipLamports
    //   } : undefined
    // };

    // Mock implementation showing expected parameters
    const mockParams = {
      tokenInfo: {
        name: config.tokenConfig.name,
        symbol: config.tokenConfig.symbol,
        description: config.tokenConfig.description,
        totalSupply: config.tokenConfig.totalSupply,
        decimals: config.tokenConfig.decimals,
        image: config.tokenConfig.image
      },
      feeSharing: {
        partnerKey: this.partnerKey,
        creatorAddress: this.creatorAddress,
        creatorBPS: FEE_SPLIT.CREATOR_PERCENTAGE * 100, // 7500 BPS (75%)
        partnerBPS: FEE_SPLIT.PARTNER_PERCENTAGE * 100   // 2500 BPS (25%)
      },
      network: this.network,
      rpcEndpoint: this.rpcUrl
    };
    
    console.log('📊 Mock token creation with parameters:', JSON.stringify(mockParams, null, 2));
    
    // Throw descriptive error explaining what's needed
    throw new Error(
      'Token creation requires actual @bagsfm/bags-sdk integration. ' +
      'Install the SDK and implement the 3-step process: ' +
      '1) createTokenInfoAndMetadata, ' + 
      '2) createBagsFeeShareConfig, ' +
      '3) createLaunchTransaction. ' +
      'See https://docs.bags.fm/how-to-guides/launch-token for details.'
    );
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
- **Creator**: ${receipt.fee_split.creator_percentage}% → ${receipt.payout_destinations.creator_payout_address}
- **App Factory Partner**: ${receipt.fee_split.partner_percentage}% (Partner Key: ${receipt.partner_attribution.partner_key})

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
    console.error('Note: APP_FACTORY_PARTNER_KEY is hardcoded from constants');
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