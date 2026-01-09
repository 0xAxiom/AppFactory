#!/usr/bin/env node

/**
 * Simple test to validate Web3 Factory prompt-driven pipeline structure
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function testPipeline() {
  console.log('🧪 Testing Web3 Factory Pipeline...\n');

  const projectRoot = process.cwd();
  const promptsDir = path.join(projectRoot, 'prompts');
  const indexPath = path.join(promptsDir, 'prompt_index.json');

  // Test 1: Prompt directory exists
  console.log('1. Checking prompts directory...');
  if (!fs.existsSync(promptsDir)) {
    console.error('❌ Prompts directory not found');
    return false;
  }
  console.log('✅ Prompts directory exists');

  // Test 2: Prompt index exists
  console.log('2. Checking prompt index...');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Prompt index not found');
    return false;
  }
  console.log('✅ Prompt index exists');

  // Test 3: Load and validate prompt index
  console.log('3. Validating prompt index...');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const promptIndex = JSON.parse(indexContent);
  
  const expectedStages = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
  const foundStages = promptIndex.prompts.map(p => p.stage);
  
  for (const stage of expectedStages) {
    if (!foundStages.includes(stage)) {
      console.error(`❌ Missing prompt for stage ${stage}`);
      return false;
    }
  }
  console.log('✅ All required stage prompts found');

  // Test 4: Validate prompt file integrity
  console.log('4. Checking prompt file integrity...');
  for (const promptInfo of promptIndex.prompts) {
    const promptPath = path.join(promptsDir, promptInfo.filename);
    if (!fs.existsSync(promptPath)) {
      console.error(`❌ Prompt file not found: ${promptPath}`);
      return false;
    }
    
    const content = fs.readFileSync(promptPath, 'utf-8');
    const actualHash = crypto.createHash('sha256').update(content).digest('hex');
    
    if (actualHash !== promptInfo.sha256) {
      console.error(`❌ Hash mismatch for ${promptInfo.stage}: expected ${promptInfo.sha256}, got ${actualHash}`);
      return false;
    }
  }
  console.log('✅ All prompt files have valid integrity hashes');

  // Test 5: Check partner key hardcoding
  console.log('5. Validating partner key hardcoding...');
  const partnerKey = 'FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7';
  let partnerKeyFound = false;

  for (const promptInfo of promptIndex.prompts) {
    if (['W2', 'W5'].includes(promptInfo.stage)) {
      const promptPath = path.join(promptsDir, promptInfo.filename);
      const content = fs.readFileSync(promptPath, 'utf-8');
      
      if (content.includes(partnerKey)) {
        partnerKeyFound = true;
        console.log(`✅ Partner key found in ${promptInfo.stage} prompt`);
      }
    }
  }

  if (!partnerKeyFound) {
    console.error('❌ Partner key not found in W2 or W5 prompts');
    return false;
  }

  // Test 6: Check schema files
  console.log('6. Checking schema files...');
  const schemasDir = path.join(projectRoot, 'schemas');
  const requiredSchemas = [
    'w1_web3_idea.json',
    'w2_token_model.json', 
    'w3_uiux_design.json',
    'w6_runtime_validation.json'
  ];

  for (const schema of requiredSchemas) {
    const schemaPath = path.join(schemasDir, schema);
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Schema not found: ${schema}`);
      return false;
    }
  }
  console.log('✅ All required schemas found');

  // Test 7: Check pipeline infrastructure
  console.log('7. Checking pipeline infrastructure...');
  const pipelineDir = path.join(projectRoot, 'pipeline');
  const requiredFiles = [
    'prompt_enforcer.ts',
    'web3_pipeline.ts'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(pipelineDir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Pipeline file not found: ${file}`);
      return false;
    }
  }
  console.log('✅ Pipeline infrastructure complete');

  console.log('\n🎉 All tests passed! Web3 Factory pipeline is ready.');
  console.log('\nNext steps:');
  console.log('1. Set up environment variables (BAGS_API_KEY, SOLANA_RPC_URL, etc.)');
  console.log('2. Run: npm run web3 idea "your web3 app idea"');
  console.log('3. Check ./runs/ for execution logs');
  console.log('4. Check ./web3-builds/ for generated apps');

  return true;
}

testPipeline().catch(console.error);