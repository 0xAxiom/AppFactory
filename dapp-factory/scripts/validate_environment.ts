#!/usr/bin/env tsx

/**
 * Environment Validation Script
 * 
 * Validates Web3 Factory environment configuration according to Bags API requirements.
 * Based on https://docs.bags.fm/principles/api-key-management
 * 
 * Usage: npm run validate-env
 */

import dotenv from 'dotenv';
import { BAGS_API_CONFIG, BAGS_API_KEYS, BAGS_NETWORKS } from '../constants/bags.js';
import { APP_FACTORY_PARTNER_KEY } from '../constants/partner.js';

// Load environment variables
dotenv.config();

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, any>;
}

/**
 * Validate all required environment variables
 */
function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Record<string, any> = {};

  // Required environment variables
  const requiredVars = [
    'BAGS_API_KEY',
    'SOLANA_RPC_URL', 
    'SOLANA_NETWORK',
    'CREATOR_WALLET_ADDRESS',
    'PRIVATE_KEY'
  ];

  // Check required variables exist
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      errors.push(`Missing required environment variable: ${varName}`);
    } else if (value === `your_${varName.toLowerCase()}_here`) {
      errors.push(`Environment variable ${varName} is still set to placeholder value`);
    } else {
      // Mask sensitive values in config output
      config[varName] = varName.includes('KEY') ? maskSensitiveValue(value) : value;
    }
  }

  // Validate Bags API key format
  const apiKey = process.env.BAGS_API_KEY;
  if (apiKey && !validateBagsApiKey(apiKey)) {
    errors.push('BAGS_API_KEY appears to be invalid format');
  }

  // Validate Solana network
  const network = process.env.SOLANA_NETWORK;
  if (network && !['mainnet-beta', 'devnet'].includes(network)) {
    errors.push(`Invalid SOLANA_NETWORK: ${network}. Must be 'mainnet-beta' or 'devnet'`);
  }

  // Validate RPC URL
  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (rpcUrl && !validateRpcUrl(rpcUrl)) {
    errors.push('SOLANA_RPC_URL appears to be invalid format');
  }

  // Validate wallet addresses
  const creatorWallet = process.env.CREATOR_WALLET_ADDRESS;
  if (creatorWallet && !validateSolanaAddress(creatorWallet)) {
    errors.push('CREATOR_WALLET_ADDRESS appears to be invalid Solana address format');
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (privateKey && !validateBase58Key(privateKey)) {
    errors.push('PRIVATE_KEY appears to be invalid Base58 format');
  }

  // Check for common misconfigurations
  if (network === 'mainnet-beta' && rpcUrl?.includes('devnet')) {
    warnings.push('Network is mainnet-beta but RPC URL appears to be devnet');
  }

  if (network === 'devnet' && rpcUrl?.includes('mainnet')) {
    warnings.push('Network is devnet but RPC URL appears to be mainnet');
  }

  // Optional variables validation
  const tipWallet = process.env.TIP_WALLET;
  if (tipWallet && !validateSolanaAddress(tipWallet)) {
    warnings.push('TIP_WALLET is set but appears to be invalid Solana address format');
  }

  const tipLamports = process.env.TIP_LAMPORTS;
  if (tipLamports && (!Number.isInteger(Number(tipLamports)) || Number(tipLamports) <= 0)) {
    warnings.push('TIP_LAMPORTS is set but is not a positive integer');
  }

  // Add immutable configuration info
  config.APP_FACTORY_PARTNER_KEY = APP_FACTORY_PARTNER_KEY;
  config.BAGS_API_BASE_URL = BAGS_API_CONFIG.BASE_URL;
  config.BAGS_API_VERSION = BAGS_API_CONFIG.VERSION;

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config
  };
}

/**
 * Validate Bags API key format
 */
function validateBagsApiKey(apiKey: string): boolean {
  // Basic validation - should be non-empty string
  // Bags docs don't specify exact format, so we do basic checks
  return apiKey.length > 10 && !apiKey.includes(' ') && !apiKey.includes('\n');
}

/**
 * Validate Solana RPC URL format
 */
function validateRpcUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * Validate Solana address format (Base58)
 */
function validateSolanaAddress(address: string): boolean {
  // Basic validation for Base58 Solana address
  // Solana addresses are 32-44 characters, Base58 encoded
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate Base58 private key format
 */
function validateBase58Key(key: string): boolean {
  // Private keys are longer than addresses
  return /^[1-9A-HJ-NP-Za-km-z]{80,120}$/.test(key);
}

/**
 * Mask sensitive values for output
 */
function maskSensitiveValue(value: string): string {
  if (value.length <= 8) {
    return '***';
  }
  return value.slice(0, 4) + '***' + value.slice(-4);
}

/**
 * Test Bags API connectivity
 */
async function testBagsApiConnectivity(): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BAGS_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'No API key provided' };
  }

  try {
    const response = await fetch(`${BAGS_API_CONFIG.BASE_URL}${BAGS_API_CONFIG.HEALTH_CHECK_ENDPOINT}`, {
      method: 'GET',
      headers: {
        [BAGS_API_KEYS.HEADER_NAME]: apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    const expectedResponse = BAGS_API_CONFIG.EXPECTED_PING_RESPONSE;
    
    if (JSON.stringify(data) !== JSON.stringify(expectedResponse)) {
      return {
        success: false,
        error: `Unexpected response: ${JSON.stringify(data)}, expected: ${JSON.stringify(expectedResponse)}`
      };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
  console.log('🔍 Validating Web3 Factory Environment Configuration...\n');

  // Validate environment variables
  const validation = validateEnvironment();

  // Print validation results
  if (validation.errors.length > 0) {
    console.log('❌ VALIDATION ERRORS:');
    validation.errors.forEach(error => console.log(`  • ${error}`));
    console.log();
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    validation.warnings.forEach(warning => console.log(`  • ${warning}`));
    console.log();
  }

  if (validation.valid) {
    console.log('✅ Environment validation passed!\n');
    
    console.log('📋 Configuration Summary:');
    Object.entries(validation.config).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log();

    // Test API connectivity if basic validation passes
    console.log('🌐 Testing Bags API connectivity...');
    const apiTest = await testBagsApiConnectivity();
    
    if (apiTest.success) {
      console.log('✅ Bags API connectivity test passed!');
    } else {
      console.log(`❌ Bags API connectivity test failed: ${apiTest.error}`);
      process.exit(1);
    }
  } else {
    console.log('❌ Environment validation failed!');
    console.log('\n📖 Setup Instructions:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Get your API key from https://dev.bags.fm');
    console.log('3. Configure your Solana wallet and RPC URL');
    console.log('4. Run this script again to validate');
    
    process.exit(1);
  }

  console.log('\n🚀 Environment is ready for Web3 Factory operations!');
}

// Execute if run directly
if (import.meta.url.endsWith(process.argv[1]!)) {
  main().catch((error) => {
    console.error('❌ Validation failed with error:', error);
    process.exit(1);
  });
}