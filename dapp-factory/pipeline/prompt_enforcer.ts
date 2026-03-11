import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { APP_FACTORY_PARTNER_KEY } from '../constants/partner';

/**
 * Web3 Factory Prompt-Driven Execution Framework
 *
 * This enforces that each stage uses its corresponding prompt file
 * and validates prompt integrity before execution.
 */

interface PromptIndex {
  version: string;
  generated_at: string;
  description: string;
  prompts: Array<{
    stage: string;
    name: string;
    filename: string;
    purpose: string;
    version: string;
    sha256: string;
  }>;
  integrity_check: {
    total_prompts: number;
    all_stages_covered: string[];
    hash_algorithm: string;
  };
}

interface StageReport {
  stage: string;
  prompt_filename: string;
  prompt_sha256: string;
  execution_timestamp: string;
  inputs_consumed: string[];
  outputs_written: string[];
  status: 'success' | 'failed';
  failure_reasons?: string[];
  validation_results: Record<string, boolean>;
}

export class PromptEnforcer {
  private promptsDir: string;
  private indexPath: string;
  private promptIndex: PromptIndex | null = null;

  constructor(projectRoot: string) {
    this.promptsDir = path.join(projectRoot, 'prompts');
    this.indexPath = path.join(this.promptsDir, 'prompt_index.json');
  }

  /**
   * Load and validate the prompt index
   */
  async loadPromptIndex(): Promise<void> {
    if (!fs.existsSync(this.indexPath)) {
      throw new Error(`Prompt index not found: ${this.indexPath}`);
    }

    const indexContent = fs.readFileSync(this.indexPath, 'utf-8');
    this.promptIndex = JSON.parse(indexContent);

    if (!this.promptIndex) {
      throw new Error('Failed to parse prompt index');
    }

    // Validate that all expected stages are covered
    const expectedStages = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
    const coveredStages = this.promptIndex.prompts.map((p) => p.stage);

    for (const stage of expectedStages) {
      if (!coveredStages.includes(stage)) {
        throw new Error(`Missing prompt for stage ${stage}`);
      }
    }
  }

  /**
   * Validate prompt file integrity using SHA256 hash
   */
  validatePromptIntegrity(stage: string): {
    valid: boolean;
    promptPath: string;
    content: string;
  } {
    if (!this.promptIndex) {
      throw new Error('Prompt index not loaded');
    }

    const promptInfo = this.promptIndex.prompts.find((p) => p.stage === stage);
    if (!promptInfo) {
      throw new Error(`No prompt found for stage ${stage}`);
    }

    const promptPath = path.join(this.promptsDir, promptInfo.filename);
    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt file not found: ${promptPath}`);
    }

    const content = fs.readFileSync(promptPath, 'utf-8');
    const actualHash = crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');

    const valid = actualHash === promptInfo.sha256;

    if (!valid) {
      throw new Error(
        `Prompt integrity check failed for ${stage}\n` +
          `Expected: ${promptInfo.sha256}\n` +
          `Actual: ${actualHash}\n` +
          `File: ${promptPath}`
      );
    }

    return { valid, promptPath, content };
  }

  /**
   * Get the prompt contract for a specific stage
   */
  getStagePrompt(stage: string): {
    path: string;
    content: string;
    hash: string;
  } {
    const validation = this.validatePromptIntegrity(stage);
    const promptInfo = this.promptIndex!.prompts.find(
      (p) => p.stage === stage
    )!;

    return {
      path: validation.promptPath,
      content: validation.content,
      hash: promptInfo.sha256,
    };
  }

  /**
   * Create a stage report documenting prompt usage and execution
   */
  createStageReport(
    stage: string,
    promptPath: string,
    promptHash: string,
    inputs: string[],
    outputs: string[],
    status: 'success' | 'failed',
    validationResults: Record<string, boolean>,
    failureReasons?: string[]
  ): StageReport {
    return {
      stage,
      prompt_filename: path.basename(promptPath),
      prompt_sha256: promptHash,
      execution_timestamp: new Date().toISOString(),
      inputs_consumed: inputs,
      outputs_written: outputs,
      status,
      failure_reasons: failureReasons,
      validation_results: validationResults,
    };
  }

  /**
   * Write stage report to run directory
   */
  writeStageReport(runDir: string, stage: string, report: StageReport): void {
    const stageDir = path.join(runDir, stage.toLowerCase());
    if (!fs.existsSync(stageDir)) {
      fs.mkdirSync(stageDir, { recursive: true });
    }

    const reportPath = path.join(stageDir, 'stage_report.md');
    const reportContent = this.formatStageReport(report);

    fs.writeFileSync(reportPath, reportContent);
  }

  /**
   * Format stage report as markdown
   */
  private formatStageReport(report: StageReport): string {
    return `# ${report.stage} Stage Execution Report

## Prompt Information
- **Filename**: ${report.prompt_filename}
- **SHA256 Hash**: ${report.prompt_sha256}
- **Execution Time**: ${report.execution_timestamp}

## Execution Status
- **Status**: ${report.status}
${report.failure_reasons ? `- **Failures**: ${report.failure_reasons.join(', ')}` : ''}

## Files Processed
### Inputs Consumed
${report.inputs_consumed.map((input) => `- ${input}`).join('\n')}

### Outputs Written  
${report.outputs_written.map((output) => `- ${output}`).join('\n')}

## Validation Results
${Object.entries(report.validation_results)
  .map(([check, passed]) => `- ${check}: ${passed ? '✅ PASS' : '❌ FAIL'}`)
  .join('\n')}

## Prompt Contract Compliance
- Prompt file loaded and validated: ✅
- Hash integrity verified: ✅
- Required outputs generated: ${report.status === 'success' ? '✅' : '❌'}
- Validation criteria met: ${Object.values(report.validation_results).every(Boolean) ? '✅' : '❌'}
`;
  }

  /**
   * Validate that stage execution follows prompt contract
   */
  validateStageExecution(
    stage: string,
    runDir: string,
    expectedOutputs: string[]
  ): { passed: boolean; missingOutputs: string[]; validationErrors: string[] } {
    const missingOutputs: string[] = [];
    const validationErrors: string[] = [];

    // Check that all expected outputs exist
    for (const output of expectedOutputs) {
      const outputPath = path.join(runDir, output);
      if (!fs.existsSync(outputPath)) {
        missingOutputs.push(output);
      }
    }

    // Check stage-specific validation rules
    if (stage === 'W2') {
      // Validate fee routing requirements
      const feeRoutingPath = path.join(runDir, 'token/fee_routing.json');
      if (fs.existsSync(feeRoutingPath)) {
        try {
          const feeRouting = JSON.parse(
            fs.readFileSync(feeRoutingPath, 'utf-8')
          );
          if (feeRouting.partner_key !== APP_FACTORY_PARTNER_KEY) {
            validationErrors.push(
              `Partner key must be exactly ${APP_FACTORY_PARTNER_KEY}`
            );
          }
          if (
            feeRouting.creator_share !== 0.75 ||
            feeRouting.partner_share !== 0.25
          ) {
            validationErrors.push(
              'Fee routing must be exactly 75% creator / 25% partner'
            );
          }
        } catch (e) {
          validationErrors.push('Invalid fee routing JSON format');
        }
      }
    }

    if (stage === 'W5') {
      // Validate Bags configuration has partner key
      const bagsConfigPath = path.join(runDir, 'bags/bags_config.json');
      if (fs.existsSync(bagsConfigPath)) {
        try {
          const bagsConfig = JSON.parse(
            fs.readFileSync(bagsConfigPath, 'utf-8')
          );
          if (
            !bagsConfig.fee_routing ||
            bagsConfig.fee_routing.partner_key !== APP_FACTORY_PARTNER_KEY
          ) {
            validationErrors.push(
              'Bags config must include hardcoded partner key'
            );
          }
        } catch (e) {
          validationErrors.push('Invalid Bags config JSON format');
        }
      }
    }

    return {
      passed: missingOutputs.length === 0 && validationErrors.length === 0,
      missingOutputs,
      validationErrors,
    };
  }
}

/**
 * Stage execution function that enforces prompt contracts
 */
export async function executeStageWithPrompt(
  stage: string,
  runDir: string,
  projectRoot: string,
  executeFunction: (promptContent: string) => Promise<void>
): Promise<void> {
  const enforcer = new PromptEnforcer(projectRoot);
  await enforcer.loadPromptIndex();

  // Get and validate stage prompt
  const prompt = enforcer.getStagePrompt(stage);

  console.log(`Executing ${stage} with prompt: ${prompt.path}`);
  console.log(`Prompt hash: ${prompt.hash}`);

  const startTime = Date.now();
  let status: 'success' | 'failed' = 'success';
  let failureReasons: string[] = [];
  const inputs: string[] = [];
  const outputs: string[] = [];

  try {
    // Execute the stage function with the prompt content
    await executeFunction(prompt.content);

    // Collect stage inputs and outputs from the run directory
    // Inputs are files that existed before stage execution
    // Outputs are files created/modified during stage execution
    const stageDir = path.join(runDir, stage.toLowerCase());
    if (fs.existsSync(stageDir)) {
      const stageFiles = fs.readdirSync(stageDir);
      outputs.push(...stageFiles.map((f) => path.join(stage.toLowerCase(), f)));
    }

    // Record the prompt file as an input
    inputs.push(prompt.path);
  } catch (error) {
    status = 'failed';
    failureReasons.push(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  // Validate stage execution and collect results
  const expectedOutputs = getExpectedOutputsForStage(stage);
  const validationResult = enforcer.validateStageExecution(
    stage,
    runDir,
    expectedOutputs
  );
  const validationResults: Record<string, boolean> = {
    outputs_generated: validationResult.missingOutputs.length === 0,
    validation_passed: validationResult.validationErrors.length === 0,
    prompt_loaded: true,
    stage_completed: status === 'success',
  };

  if (!validationResult.passed) {
    validationResult.validationErrors.forEach((err) =>
      failureReasons.push(err)
    );
  }

  // Create and write stage report
  const report = enforcer.createStageReport(
    stage,
    prompt.path,
    prompt.hash,
    inputs,
    outputs,
    status,
    validationResults,
    failureReasons
  );

  enforcer.writeStageReport(runDir, stage, report);

  if (status === 'failed') {
    throw new Error(`Stage ${stage} failed: ${failureReasons.join(', ')}`);
  }
}

/**
 * Get expected output files for each stage
 */
function getExpectedOutputsForStage(stage: string): string[] {
  const expectedOutputs: Record<string, string[]> = {
    W1: [
      'product/value_proposition.md',
      'product/onchain_vs_offchain.md',
      'product/core_user_loop.md',
      'product/failure_cases.md',
      'w1/web3_idea.json',
    ],
    W2: [
      'token/token_role.json',
      'token/token_economics.md',
      'token/fee_routing.json',
      'w2/token_model.json',
    ],
    W3: [
      'uiux/uiux_prompt.md',
      'uiux/design_tokens.json',
      'uiux/component_inventory.md',
      'uiux/interaction_semantics.md',
      'w3/uiux_design.json',
    ],
    W4: [
      'architecture/web_stack.json',
      'architecture/wallet_strategy.md',
      'architecture/data_flow_diagram.md',
      'w4/web3_architecture.json',
    ],
    W5: [
      'bags/bags_config.json',
      'bags/token_creation_plan.md',
      'w5/bags_config.json',
    ],
    W6: [
      'runtime/boot.log',
      'runtime/wallet.log',
      'runtime/token_flow.log',
      'runtime/user_flow.log',
      'w6/runtime_validation.json',
    ],
    W7: ['w7/build_manifest.json'],
  };
  return expectedOutputs[stage] || [];
}
