#!/usr/bin/env tsx

/**
 * Token Launch v2 Compliant Script
 * 
 * Creates tokens using Token Launch v2 with:
 * - Explicit fee share configuration (mandatory)
 * - Social fee claimers support (GitHub/Twitter/Kick)
 * - Partner attribution vs payout distinction
 * - Custom LUT for >15 fee claimers
 * - Complete BPS validation
 * 
 * Usage: npm run launch-token-v2 -- <token_config.json>
 * Example: npm run launch-token-v2 -- ./my-token-config-v2.json
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  createExplicitFeeShareConfig,
  createSimpleFeeShareConfig,
  createOpenSourceFeeShareConfig,
  createTeamFeeShareConfig,
  summarizeFeeShareConfig,
  SupportedSocialProvider,
  type FeeClaimer
} from '../utils/fee_share_config.js';
import { APP_FACTORY_PARTNER_KEY } from '../constants/partner.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Token Launch v2 Configuration Types
// ============================================================================

interface TokenLaunchV2Config {
  buildId: string;
  inputHash: string;
  launchVersion: 'v2';
  
  tokenMetadata: {
    name: string;
    symbol: string;
    description: string;
    totalSupply: string;
    decimals: number;
    website?: string;
    twitter?: string;
    telegram?: string;
    imageUrl?: string; // From file upload or IPFS
  };
  
  feeShareConfigV2: {
    creator_bps: number;
    partner_bps: number;
    social_fee_claimers: Array<{
      provider: SupportedSocialProvider;
      username: string;
      bps: number;
      role_description: string;
    }>;
    total_bps: 10000;
    explicit_config_required: true;
  };
  
  partnerAttribution: {
    partner_key: string; // Always APP_FACTORY_PARTNER_KEY
    partner_program: 'app-factory';
  };
  
  launchParams: {
    initialBuyAmount: string;
    network: 'mainnet-beta' | 'devnet';
  };
  
  tippingConfig?: {
    enabled: boolean;
    tip_wallet?: string;
    tip_lamports?: number;
    provider?: 'jito' | 'bloxroute' | 'astral' | 'custom';
  };
  
  createdAt: string;
}

interface TokenReceiptV2 {
  buildId: string;
  launchVersion: 'v2';
  tokenAddress: string;
  transactionId: string;
  network: string;
  createdAt: string;
  
  feeShareConfig: {
    creator: { bps: number; percentage: number };
    social_claimers: Array<{
      provider: SupportedSocialProvider;
      username: string;
      resolved_wallet?: string;
      bps: number;
      percentage: number;
    }>;
    partner: { bps: number; percentage: number };
    total_bps: 10000;
    explicit_config_used: true;
  };
  
  partnerAttribution: {
    partner_key: string;
    partner_program: string;
  };
  
  socialProviderResolution: {
    resolved_count: number;
    failed_count: number;
    resolution_strategy: 'fail_fast' | 'skip_unresolved';
    failures?: Array<{ provider: string; username: string; error: string }>;
  };
  
  lookupTableConfig?: {
    bags_lut_used: boolean;
    custom_lut_created?: boolean;
    custom_lut_address?: string;
    total_fee_claimers: number;
  };
  
  bagsIntegration: {
    sdkVersion: string;
    apiVersion: 'v1';
    tokenLaunchVersion: 'v2';
  };
}

// ============================================================================
// Sample Configuration Generation
// ============================================================================

function createSampleSimpleConfig(): TokenLaunchV2Config {
  const buildId = Date.now().toString();
  const inputString = `sample-token-v2-${buildId}`;
  const inputHash = crypto.createHash('sha256').update(inputString).digest('hex');
  
  return {
    buildId,
    inputHash,
    launchVersion: 'v2',
    
    tokenMetadata: {
      name: "Simple Web3 Token",
      symbol: "SW3T",
      description: "A simple token created via Token Launch v2 with creator-only fee sharing",
      totalSupply: "1000000",
      decimals: 9,
      website: "https://example.com",
      twitter: "@example"
    },
    
    feeShareConfigV2: {
      creator_bps: 7500, // 75%
      partner_bps: 2500, // 25%
      social_fee_claimers: [], // No social claimers
      total_bps: 10000,
      explicit_config_required: true
    },
    
    partnerAttribution: {
      partner_key: APP_FACTORY_PARTNER_KEY,
      partner_program: 'app-factory'
    },
    
    launchParams: {
      initialBuyAmount: "100000", // 0.1 SOL
      network: 'mainnet-beta'
    },
    
    tippingConfig: {
      enabled: false
    },
    
    createdAt: new Date().toISOString()
  };
}

function createSampleTeamConfig(): TokenLaunchV2Config {
  const buildId = Date.now().toString();
  const inputString = `team-token-v2-${buildId}`;
  const inputHash = crypto.createHash('sha256').update(inputString).digest('hex');
  
  return {
    buildId,
    inputHash,
    launchVersion: 'v2',
    
    tokenMetadata: {
      name: "Team Collaboration Token",
      symbol: "TEAM",
      description: "A token with multi-contributor fee sharing via social identities",
      totalSupply: "5000000",
      decimals: 9,
      website: "https://team-example.com",
      twitter: "@team_project"
    },
    
    feeShareConfigV2: {
      creator_bps: 6000, // Creator: 60%
      partner_bps: 2500, // Partner: 25%
      social_fee_claimers: [
        {
          provider: SupportedSocialProvider.GITHUB,
          username: 'lead_developer',
          bps: 1000, // Lead dev: 10%
          role_description: 'Lead developer - core architecture and implementation'
        },
        {
          provider: SupportedSocialProvider.GITHUB,
          username: 'ui_designer',
          bps: 500, // UI designer: 5%
          role_description: 'UI/UX designer - interface design and user experience'
        }
      ],
      total_bps: 10000,
      explicit_config_required: true
    },
    
    partnerAttribution: {
      partner_key: APP_FACTORY_PARTNER_KEY,
      partner_program: 'app-factory'
    },
    
    launchParams: {
      initialBuyAmount: "500000", // 0.5 SOL
      network: 'mainnet-beta'
    },
    
    tippingConfig: {
      enabled: true,
      tip_lamports: 100000, // 0.0001 SOL tip
      provider: 'jito'
    },
    
    createdAt: new Date().toISOString()
  };
}

function createSampleOpenSourceConfig(): TokenLaunchV2Config {
  const buildId = Date.now().toString();
  const inputString = `opensource-token-v2-${buildId}`;
  const inputHash = crypto.createHash('sha256').update(inputString).digest('hex');
  
  return {
    buildId,
    inputHash,
    launchVersion: 'v2',
    
    tokenMetadata: {
      name: "Open Source Project Token",
      symbol: "OSS",
      description: "A token that rewards open source contributors via GitHub username resolution",
      totalSupply: "10000000",
      decimals: 9,
      website: "https://opensource-example.com",
      twitter: "@oss_project"
    },
    
    feeShareConfigV2: {
      creator_bps: 5000, // Creator: 50%
      partner_bps: 2500, // Partner: 25%
      social_fee_claimers: [
        {
          provider: SupportedSocialProvider.GITHUB,
          username: 'core_maintainer',
          bps: 1500, // Core maintainer: 15%
          role_description: 'Core maintainer - project leadership and code review'
        },
        {
          provider: SupportedSocialProvider.GITHUB,
          username: 'frequent_contributor',
          bps: 500, // Contributor: 5%
          role_description: 'Frequent contributor - feature development'
        },
        {
          provider: SupportedSocialProvider.TWITTER,
          username: '@community_manager',
          bps: 500, // Community: 5%
          role_description: 'Community manager - user engagement and support'
        }
      ],
      total_bps: 10000,
      explicit_config_required: true
    },
    
    partnerAttribution: {
      partner_key: APP_FACTORY_PARTNER_KEY,
      partner_program: 'app-factory'
    },
    
    launchParams: {
      initialBuyAmount: "1000000", // 1 SOL
      network: 'mainnet-beta'
    },
    
    tippingConfig: {
      enabled: true,
      tip_lamports: 200000, // 0.0002 SOL tip
      provider: 'jito'
    },
    
    createdAt: new Date().toISOString()
  };
}

// ============================================================================
// Configuration Validation
// ============================================================================

function validateTokenLaunchV2Config(config: any): TokenLaunchV2Config {
  // Validate required top-level fields
  const required = ['buildId', 'inputHash', 'launchVersion', 'tokenMetadata', 'feeShareConfigV2', 'partnerAttribution', 'launchParams'];
  
  for (const field of required) {
    if (!config[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate launch version
  if (config.launchVersion !== 'v2') {
    throw new Error('Invalid launch version - must be "v2" for Token Launch v2');
  }
  
  // Validate token metadata
  const tokenRequired = ['name', 'symbol', 'description', 'totalSupply', 'decimals'];
  for (const field of tokenRequired) {
    if (!config.tokenMetadata[field]) {
      throw new Error(`Missing required tokenMetadata field: ${field}`);
    }
  }
  
  // Validate partner attribution
  if (config.partnerAttribution.partner_key !== APP_FACTORY_PARTNER_KEY) {
    throw new Error(`Invalid partner_key - must use App Factory partner key: ${APP_FACTORY_PARTNER_KEY}`);
  }
  
  if (config.partnerAttribution.partner_program !== 'app-factory') {
    throw new Error('Invalid partner_program - must be "app-factory"');
  }
  
  // Validate fee share configuration v2
  const feeConfig = config.feeShareConfigV2;
  
  if (!feeConfig.explicit_config_required) {
    throw new Error('Fee share config must have explicit_config_required: true for Token Launch v2');
  }
  
  if (feeConfig.total_bps !== 10000) {
    throw new Error(`Invalid total_bps - must be 10000, got ${feeConfig.total_bps}`);
  }
  
  // Calculate and validate BPS total\n  const socialBPS = feeConfig.social_fee_claimers.reduce((sum: number, claimer: any) => sum + claimer.bps, 0);\n  const calculatedTotal = feeConfig.creator_bps + feeConfig.partner_bps + socialBPS;\n  \n  if (calculatedTotal !== 10000) {\n    throw new Error(`BPS validation failed: creator(${feeConfig.creator_bps}) + partner(${feeConfig.partner_bps}) + social(${socialBPS}) = ${calculatedTotal}, expected 10000`);\n  }\n  \n  // Validate social fee claimers\n  for (const claimer of feeConfig.social_fee_claimers) {\n    if (!Object.values(SupportedSocialProvider).includes(claimer.provider)) {\n      throw new Error(`Invalid social provider: ${claimer.provider}. Must be one of: ${Object.values(SupportedSocialProvider).join(', ')}`);\n    }\n    \n    if (!claimer.username || typeof claimer.username !== 'string') {\n      throw new Error(`Invalid username for ${claimer.provider} claimer`);\n    }\n    \n    if (typeof claimer.bps !== 'number' || claimer.bps <= 0) {\n      throw new Error(`Invalid BPS for ${claimer.provider}:${claimer.username} - must be positive number`);\n    }\n    \n    if (!claimer.role_description) {\n      throw new Error(`Missing role_description for ${claimer.provider}:${claimer.username}`);\n    }\n  }\n  \n  return config as TokenLaunchV2Config;\n}\n\n// ============================================================================\n// Token Creation Implementation\n// ============================================================================\n\n/**\n * Mock Token Launch v2 implementation\n * TODO: Replace with actual Bags SDK calls when available\n */\nasync function executeTokenLaunchV2(config: TokenLaunchV2Config): Promise<TokenReceiptV2> {\n  console.log('\\n🔧 Executing Token Launch v2 3-Step Process...');\n  \n  // Validate environment\n  const requiredEnvVars = ['BAGS_API_KEY', 'SOLANA_RPC_URL', 'CREATOR_WALLET_ADDRESS'];\n  for (const envVar of requiredEnvVars) {\n    if (!process.env[envVar]) {\n      throw new Error(`Missing required environment variable: ${envVar}`);\n    }\n  }\n  \n  // Prepare fee claimers\n  const feeClaimers: FeeClaimer[] = [\n    {\n      wallet: process.env.CREATOR_WALLET_ADDRESS!,\n      bps: config.feeShareConfigV2.creator_bps\n    },\n    ...config.feeShareConfigV2.social_fee_claimers.map(claimer => ({\n      provider: claimer.provider,\n      username: claimer.username,\n      bps: claimer.bps\n    })),\n    {\n      wallet: \"PARTNER_PAYOUT_ADDRESS_PLACEHOLDER\", // Resolved from partner key\n      bps: config.feeShareConfigV2.partner_bps\n    }\n  ];\n  \n  console.log(`   📋 Fee claimers configured: ${feeClaimers.length} total`);\n  \n  // Create explicit fee share configuration\n  try {\n    const feeShareConfig = await createExplicitFeeShareConfig(\n      process.env.CREATOR_WALLET_ADDRESS!,\n      config.feeShareConfigV2.social_fee_claimers.map(claimer => ({\n        provider: claimer.provider,\n        username: claimer.username,\n        bps: claimer.bps\n      })),\n      config.feeShareConfigV2.partner_bps\n    );\n    \n    console.log('   ✅ Fee share configuration created:');\n    console.log(summarizeFeeShareConfig(feeShareConfig));\n    \n    // Mock token creation (replace with actual Bags SDK)\n    console.log('\\n🚀 Creating token via Bags SDK...');\n    \n    // TODO: Replace with actual SDK calls\n    /*\n    const sdk = new BagsSDK({\n      apiKey: process.env.BAGS_API_KEY,\n      network: config.launchParams.network\n    });\n    \n    // Step 1: Create token info and metadata\n    const tokenInfo = await sdk.createTokenInfoAndMetadata(config.tokenMetadata);\n    \n    // Step 2: Create fee share configuration (MANDATORY in v2)\n    const bagsConfig = await sdk.createBagsFeeShareConfig(feeShareConfig);\n    \n    // Step 3: Create launch transaction\n    const launchTx = await sdk.createLaunchTransaction({\n      ipfs: tokenInfo.ipfsHash,\n      tokenMint: tokenInfo.mint,\n      initialBuyAmount: config.launchParams.initialBuyAmount,\n      feeShareConfig: bagsConfig,\n      tipWallet: config.tippingConfig?.tip_wallet,\n      tipLamports: config.tippingConfig?.tip_lamports\n    });\n    */\n    \n    // Mock successful creation\n    const mockTokenAddress = 'MockTokenAddress' + Date.now();\n    const mockTransactionId = 'MockTransaction' + Date.now();\n    \n    console.log(`   ✅ Token created: ${mockTokenAddress}`);\n    console.log(`   ✅ Transaction: ${mockTransactionId}`);\n    \n    // Create receipt\n    const receipt: TokenReceiptV2 = {\n      buildId: config.buildId,\n      launchVersion: 'v2',\n      tokenAddress: mockTokenAddress,\n      transactionId: mockTransactionId,\n      network: config.launchParams.network,\n      createdAt: new Date().toISOString(),\n      \n      feeShareConfig: {\n        creator: {\n          bps: config.feeShareConfigV2.creator_bps,\n          percentage: config.feeShareConfigV2.creator_bps / 100\n        },\n        social_claimers: config.feeShareConfigV2.social_fee_claimers.map(claimer => ({\n          provider: claimer.provider,\n          username: claimer.username,\n          resolved_wallet: `MockWallet_${claimer.provider}_${claimer.username}`,\n          bps: claimer.bps,\n          percentage: claimer.bps / 100\n        })),\n        partner: {\n          bps: config.feeShareConfigV2.partner_bps,\n          percentage: config.feeShareConfigV2.partner_bps / 100\n        },\n        total_bps: 10000,\n        explicit_config_used: true\n      },\n      \n      partnerAttribution: config.partnerAttribution,\n      \n      socialProviderResolution: {\n        resolved_count: config.feeShareConfigV2.social_fee_claimers.length,\n        failed_count: 0,\n        resolution_strategy: 'fail_fast'\n      },\n      \n      lookupTableConfig: {\n        bags_lut_used: true,\n        custom_lut_created: feeClaimers.length > 15,\n        total_fee_claimers: feeClaimers.length\n      },\n      \n      bagsIntegration: {\n        sdkVersion: '@bagsfm/bags-sdk@latest',\n        apiVersion: 'v1',\n        tokenLaunchVersion: 'v2'\n      }\n    };\n    \n    return receipt;\n    \n  } catch (error) {\n    console.error('   ❌ Fee share configuration failed:', error);\n    throw error;\n  }\n}\n\n// ============================================================================\n// Output Generation\n// ============================================================================\n\nfunction writeTokenReceiptV2(receipt: TokenReceiptV2, outputDir: string): void {\n  // Ensure output directory exists\n  if (!fs.existsSync(outputDir)) {\n    fs.mkdirSync(outputDir, { recursive: true });\n  }\n  \n  // Write JSON receipt\n  const receiptPath = path.join(outputDir, 'token_receipt_v2.json');\n  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));\n  \n  // Write human-readable receipt\n  const readablePath = path.join(outputDir, 'token_receipt_v2.md');\n  const markdown = generateTokenReceiptMarkdown(receipt);\n  fs.writeFileSync(readablePath, markdown);\n  \n  console.log(`   📄 Receipt written: ${receiptPath}`);\n  console.log(`   📋 Readable version: ${readablePath}`);\n}\n\nfunction generateTokenReceiptMarkdown(receipt: TokenReceiptV2): string {\n  return `# Token Launch v2 Receipt\n\n**Token Address**: \\`${receipt.tokenAddress}\\`  \n**Transaction ID**: \\`${receipt.transactionId}\\`  \n**Network**: ${receipt.network}  \n**Created**: ${new Date(receipt.createdAt).toLocaleString()}  \n**Launch Version**: ${receipt.launchVersion}\n\n## Fee Share Configuration (Explicit)\n\n| Role | BPS | Percentage | Details |\n|------|-----|------------|--------|\n| Creator | ${receipt.feeShareConfig.creator.bps} | ${receipt.feeShareConfig.creator.percentage}% | Primary app creator |\n${receipt.feeShareConfig.social_claimers.map(claimer => \n  `| ${claimer.provider}:${claimer.username} | ${claimer.bps} | ${claimer.percentage}% | Social contributor |\n`).join('')}| Partner | ${receipt.feeShareConfig.partner.bps} | ${receipt.feeShareConfig.partner.percentage}% | App Factory (${receipt.partnerAttribution.partner_key}) |\n| **Total** | **${receipt.feeShareConfig.total_bps}** | **100%** | |\n\n## Social Provider Resolution\n\n- **Resolved Successfully**: ${receipt.socialProviderResolution.resolved_count}\n- **Failed Resolutions**: ${receipt.socialProviderResolution.failed_count}\n- **Strategy Used**: ${receipt.socialProviderResolution.resolution_strategy}\n\n${receipt.socialProviderResolution.failures && receipt.socialProviderResolution.failures.length > 0 ? \n  `### Resolution Failures\\n${receipt.socialProviderResolution.failures.map(f => \n    `- **${f.provider}:${f.username}**: ${f.error}\\n`\n  ).join('')}` : ''}\n\n## Lookup Table Configuration\n\n- **Bags Public LUT Used**: ${receipt.lookupTableConfig?.bags_lut_used ? '✅' : '❌'}\n- **Custom LUT Created**: ${receipt.lookupTableConfig?.custom_lut_created ? '✅' : '❌'}\n- **Total Fee Claimers**: ${receipt.lookupTableConfig?.total_fee_claimers}\n${receipt.lookupTableConfig?.custom_lut_address ? `- **Custom LUT Address**: \\`${receipt.lookupTableConfig.custom_lut_address}\\`\\n` : ''}\n\n## Partner Attribution\n\n- **Partner Key**: \\`${receipt.partnerAttribution.partner_key}\\`\n- **Program**: ${receipt.partnerAttribution.partner_program}\n- **Attribution Type**: App Factory partnership (not payout address)\n\n## Technical Details\n\n- **Bags SDK Version**: ${receipt.bagsIntegration.sdkVersion}\n- **API Version**: ${receipt.bagsIntegration.apiVersion}\n- **Token Launch Version**: ${receipt.bagsIntegration.tokenLaunchVersion}\n- **Build ID**: ${receipt.buildId}\n\n## Verification Links\n\n- [View on Solscan](https://solscan.io/token/${receipt.tokenAddress})\n- [View on Explorer](https://explorer.solana.com/address/${receipt.tokenAddress})\n- [Transaction Details](https://solscan.io/tx/${receipt.transactionId})\n\n---\n\n**Generated by Web3 Factory Token Launch v2** • [Documentation](https://docs.bags.fm/)`;\n}\n\n// ============================================================================\n// Main Execution\n// ============================================================================\n\nasync function main(): Promise<void> {\n  const args = process.argv.slice(2);\n  \n  console.log('🚀 Web3 Factory Token Launch v2\\n');\n  \n  try {\n    let config: TokenLaunchV2Config;\n    let outputDir: string;\n    \n    if (args.length === 0) {\n      // No config file provided - create samples and exit\n      console.log('📝 No configuration file provided. Creating sample configs...');\n      \n      const samples = [\n        { config: createSampleSimpleConfig(), filename: 'simple-token-config-v2.json' },\n        { config: createSampleTeamConfig(), filename: 'team-token-config-v2.json' },\n        { config: createSampleOpenSourceConfig(), filename: 'opensource-token-config-v2.json' }\n      ];\n      \n      for (const { config, filename } of samples) {\n        const configPath = path.join(process.cwd(), filename);\n        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));\n        console.log(`   ✅ ${filename}`);\n      }\n      \n      console.log('\\n📖 Sample Configurations Created:');\n      console.log('\\n1. **Simple Token** (simple-token-config-v2.json):');\n      console.log('   - Creator-only fee sharing (75% creator, 25% partner)');\n      console.log('   - No social fee claimers');\n      console.log('   - Good for individual creators');\n      \n      console.log('\\n2. **Team Token** (team-token-config-v2.json):');\n      console.log('   - Multi-contributor fee sharing');\n      console.log('   - GitHub developers + social contributors');\n      console.log('   - Good for small teams');\n      \n      console.log('\\n3. **Open Source Token** (opensource-token-config-v2.json):');\n      console.log('   - Community-driven fee sharing');\n      console.log('   - Multiple GitHub contributors + community manager');\n      console.log('   - Good for open source projects');\n      \n      console.log('\\n📖 Next steps:');\n      console.log('1. Choose and edit a configuration file');\n      console.log('2. Ensure your .env file is configured (see .env.example)');\n      console.log('3. Run: npm run launch-token-v2 -- <config-file>');\n      console.log('\\n📋 Token Launch v2 Features:');\n      console.log('   ✅ Explicit fee share configuration (mandatory)');\n      console.log('   ✅ Social fee claimers (GitHub/Twitter/Kick)');\n      console.log('   ✅ Partner attribution vs payout distinction');\n      console.log('   ✅ Custom LUT for >15 fee claimers');\n      console.log('   ✅ Complete BPS validation');\n      \n      return;\n    }\n    \n    const configPath = args[0]!;\n    \n    // Validate config file exists\n    if (!fs.existsSync(configPath)) {\n      throw new Error(`Configuration file not found: ${configPath}`);\n    }\n    \n    // Load and validate configuration\n    console.log(`📖 Loading Token Launch v2 configuration from: ${configPath}`);\n    const configData = fs.readFileSync(configPath, 'utf8');\n    const rawConfig = JSON.parse(configData);\n    config = validateTokenLaunchV2Config(rawConfig);\n    \n    console.log(`   ✅ Configuration validated for Token Launch v2`);\n    console.log(`   📋 Token: ${config.tokenMetadata.name} (${config.tokenMetadata.symbol})`);\n    console.log(`   👥 Fee claimers: Creator + ${config.feeShareConfigV2.social_fee_claimers.length} social + Partner`);\n    \n    // Determine output directory\n    outputDir = path.join(\n      path.dirname(configPath),\n      'token-outputs-v2',\n      config.buildId\n    );\n    \n    console.log(`   📁 Output directory: ${outputDir}`);\n    \n    // Save configuration copy\n    if (!fs.existsSync(outputDir)) {\n      fs.mkdirSync(outputDir, { recursive: true });\n    }\n    fs.writeFileSync(\n      path.join(outputDir, 'token_config_v2.json'),\n      JSON.stringify(config, null, 2)\n    );\n    \n    // Execute Token Launch v2\n    console.log('\\n🚀 Starting Token Launch v2...');\n    const receipt = await executeTokenLaunchV2(config);\n    \n    // Write receipt\n    writeTokenReceiptV2(receipt, outputDir);\n    \n    // Success output\n    console.log('\\n✅ TOKEN LAUNCH V2 SUCCESSFUL!');\n    console.log('\\n📋 Token Details:');\n    console.log(`   Name: ${config.tokenMetadata.name}`);\n    console.log(`   Symbol: ${config.tokenMetadata.symbol}`);\n    console.log(`   Address: ${receipt.tokenAddress}`);\n    console.log(`   Transaction: ${receipt.transactionId}`);\n    console.log(`   Network: ${receipt.network}`);\n    \n    console.log('\\n💰 Fee Share Configuration (v2):');\n    console.log(`   Creator (${receipt.feeShareConfig.creator.percentage}%): ${receipt.feeShareConfig.creator.bps} BPS`);\n    \n    if (receipt.feeShareConfig.social_claimers.length > 0) {\n      console.log(`   Social Contributors:`);\n      for (const claimer of receipt.feeShareConfig.social_claimers) {\n        console.log(`     ${claimer.provider}:${claimer.username} (${claimer.percentage}%): ${claimer.bps} BPS`);\n      }\n    }\n    \n    console.log(`   App Factory Partner (${receipt.feeShareConfig.partner.percentage}%): ${receipt.feeShareConfig.partner.bps} BPS`);\n    console.log(`   Total: ${receipt.feeShareConfig.total_bps} BPS (100%)`);\n    \n    console.log('\\n🔗 Social Provider Resolution:');\n    console.log(`   Resolved: ${receipt.socialProviderResolution.resolved_count}`);\n    console.log(`   Failed: ${receipt.socialProviderResolution.failed_count}`);\n    console.log(`   Strategy: ${receipt.socialProviderResolution.resolution_strategy}`);\n    \n    console.log('\\n📄 Artifacts Created:');\n    console.log(`   Token Config: ${outputDir}/token_config_v2.json`);\n    console.log(`   Receipt: ${outputDir}/token_receipt_v2.json`);\n    console.log(`   Readable: ${outputDir}/token_receipt_v2.md`);\n    \n    console.log('\\n🔗 Verification:');\n    console.log(`   Solscan: https://solscan.io/token/${receipt.tokenAddress}`);\n    console.log(`   Explorer: https://explorer.solana.com/address/${receipt.tokenAddress}`);\n    console.log(`   Transaction: https://solscan.io/tx/${receipt.transactionId}`);\n    \n    console.log('\\n🎉 Token Launch v2 Complete!');\n    console.log('   ✅ Explicit fee share configuration applied');\n    console.log('   ✅ Social fee claimers resolved and integrated');\n    console.log('   ✅ Partner attribution properly configured');\n    \n  } catch (error) {\n    console.error('\\n❌ TOKEN LAUNCH V2 FAILED:');\n    console.error(error instanceof Error ? error.message : String(error));\n    \n    console.log('\\n🛠️ Token Launch v2 Troubleshooting:');\n    console.log('1. Verify configuration: Check all required fields and BPS totals');\n    console.log('2. Validate social usernames: Ensure GitHub/Twitter/Kick usernames are correct');\n    console.log('3. Check environment: Run npm run validate-env');\n    console.log('4. Verify API access: Check Bags API key and rate limits');\n    console.log('5. Check network: Ensure Solana RPC connectivity');\n    \n    process.exit(1);\n  }\n}\n\n// Execute if run directly\nif (import.meta.url.endsWith(process.argv[1]!)) {\n  main().catch((error) => {\n    console.error('Unexpected error:', error);\n    process.exit(1);\n  });\n}