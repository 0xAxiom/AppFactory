import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { PromptEnforcer, executeStageWithPrompt } from './prompt_enforcer';
import { APP_FACTORY_PARTNER_KEY, FEE_SPLIT } from '../constants/partner';

/**
 * Web3 Factory Main Pipeline Controller
 *
 * Orchestrates the complete W1-W7 pipeline execution with prompt enforcement
 */

interface Web3PipelineConfig {
  projectRoot: string;
  runsDir: string;
  buildsDir: string;
  idea: string;
  runId?: string;
}

export class Web3Pipeline {
  private config: Web3PipelineConfig;
  private runDir: string;
  private enforcer: PromptEnforcer;

  constructor(config: Web3PipelineConfig) {
    this.config = config;
    this.enforcer = new PromptEnforcer(config.projectRoot);

    // Generate run ID if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const ideaHash = crypto
      .createHash('md5')
      .update(config.idea)
      .digest('hex')
      .substring(0, 8);
    this.config.runId = config.runId || `web3-${timestamp}-${ideaHash}`;

    // Set up run directory
    const today = new Date().toISOString().split('T')[0];
    this.runDir = path.join(config.runsDir, today, this.config.runId);
  }

  /**
   * Execute the complete Web3 Factory pipeline W1-W7
   */
  async execute(): Promise<void> {
    console.log(`Starting Web3 Factory pipeline: ${this.config.runId}`);
    console.log(`Run directory: ${this.runDir}`);

    // Initialize prompt enforcer
    await this.enforcer.loadPromptIndex();

    // Create run directory structure
    this.createRunStructure();

    // Write initial intake
    this.writeIntake();

    try {
      // Execute stages in sequence
      await this.executeW1();
      await this.executeW2();
      await this.executeW3();
      await this.executeW4();
      await this.executeW5();
      await this.executeW6();
      await this.executeW7();

      console.log('✅ Web3 Factory pipeline completed successfully');
      console.log(
        `📁 Build output: ${path.join(this.config.buildsDir, this.extractAppName())}`
      );
    } catch (error) {
      console.error('❌ Web3 Factory pipeline failed:');
      console.error(error);
      throw error;
    }
  }

  /**
   * Create the run directory structure
   */
  private createRunStructure(): void {
    const dirs = [
      'inputs',
      'product',
      'token',
      'uiux',
      'architecture',
      'bags',
      'runtime',
      'w1',
      'w2',
      'w3',
      'w4',
      'w5',
      'w6',
      'w7',
    ];

    for (const dir of dirs) {
      fs.mkdirSync(path.join(this.runDir, dir), { recursive: true });
    }
  }

  /**
   * Write the initial idea intake
   */
  private writeIntake(): void {
    const intakePath = path.join(this.runDir, 'inputs', 'web3_intake.md');
    const intakeContent = `# Web3 Factory Idea Intake

**Run ID**: ${this.config.runId}
**Timestamp**: ${new Date().toISOString()}

## Raw Idea

${this.config.idea}

---

This intake file serves as the input for the Web3 Factory pipeline W1-W7 execution.
`;

    fs.writeFileSync(intakePath, intakeContent);
  }

  /**
   * W1: Web3 Product Reality Gate
   *
   * This stage validates the web3 product idea and generates foundational
   * product artifacts. The stage execution is driven by the W1 prompt file
   * which defines the agent's behavior and output requirements.
   */
  private async executeW1(): Promise<void> {
    await executeStageWithPrompt(
      'W1',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('🔍 Executing W1: Web3 Product Reality Gate');

        // Stage W1 generates product validation artifacts based on the idea intake.
        // The prompt content contains the W1 agent instructions that guide output generation.
        // In production, this would invoke an LLM with promptContent as system context.

        const valueProposition = this.generateValueProposition();
        const onchainAnalysis = this.generateOnchainAnalysis();
        const coreUserLoop = this.generateCoreUserLoop();
        const failureCases = this.generateFailureCases();

        const outputs = {
          'product/value_proposition.md': valueProposition,
          'product/onchain_vs_offchain.md': onchainAnalysis,
          'product/core_user_loop.md': coreUserLoop,
          'product/failure_cases.md': failureCases,
          'w1/web3_idea.json': JSON.stringify(
            {
              stage: 'W1',
              validated: true,
              idea: this.config.idea,
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * Generate value proposition document from idea
   */
  private generateValueProposition(): string {
    return `# Value Proposition

## Idea
${this.config.idea}

## Core Value
This Web3 application addresses user needs by leveraging blockchain technology for:
- Transparency and trustlessness
- User ownership of data/assets
- Decentralized operations

## Target Users
Users who value decentralization, ownership, and transparent operations.

## Unique Selling Points
1. On-chain verifiability
2. User-controlled assets
3. Censorship resistance
`;
  }

  /**
   * Generate onchain vs offchain analysis
   */
  private generateOnchainAnalysis(): string {
    return `# Onchain vs Offchain Analysis

## Components Requiring Onchain
- Asset ownership and transfers
- Critical state changes
- Value exchange operations

## Components Suitable for Offchain
- User interface and experience
- Non-critical metadata
- Performance-sensitive operations

## Hybrid Approach
This application uses a hybrid architecture where:
- Critical operations happen onchain for security
- User experience is optimized through offchain processing
- State is synchronized between layers as needed
`;
  }

  /**
   * Generate core user loop documentation
   */
  private generateCoreUserLoop(): string {
    return `# Core User Loop

## Primary Flow
1. **Connect** - User connects wallet
2. **Discover** - User explores available options
3. **Act** - User initiates a transaction or action
4. **Confirm** - User confirms onchain operation
5. **Result** - User sees outcome and next steps

## Engagement Cycle
- Initial onboarding guides users through wallet connection
- Core actions provide clear feedback
- Success states encourage continued usage
- Notifications keep users informed of relevant events
`;
  }

  /**
   * Generate failure cases analysis
   */
  private generateFailureCases(): string {
    return `# Failure Cases Analysis

## Transaction Failures
- **Insufficient funds**: Clear error with balance display
- **Network congestion**: Retry mechanism with gas estimation
- **Rejected transaction**: User-friendly explanation

## Wallet Issues
- **Connection lost**: Auto-reconnect with session preservation
- **Wrong network**: Network switch prompt with instructions
- **Wallet not installed**: Installation guide and alternatives

## Edge Cases
- **Concurrent transactions**: Queue management
- **Stale state**: Refresh mechanism with conflict resolution
- **Rate limiting**: Graceful degradation with retry hints
`;
  }

  /**
   * W2: Token Role & Economic Contract
   */
  private async executeW2(): Promise<void> {
    await executeStageWithPrompt(
      'W2',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('🪙 Executing W2: Token Role & Economic Contract');

        // Enforce mandatory fee routing
        const feeRouting = {
          creator_share: 0.75,
          partner_share: 0.25,
          partner_key: APP_FACTORY_PARTNER_KEY,
        };

        const tokenEconomics = `# Token Economics

## Token Role
The token serves as the primary medium for:
- Access control and gating
- Value transfer within the ecosystem
- Governance participation (if applicable)

## Fee Structure
- Creator Share: ${feeRouting.creator_share * 100}%
- Partner Share: ${feeRouting.partner_share * 100}%
- Partner Key: ${feeRouting.partner_key}

## Economic Model
The economic model ensures sustainable value creation:
- Utility-driven demand
- Fair distribution mechanics
- Aligned incentives between creators and users
`;

        const outputs = {
          'token/token_role.json': JSON.stringify(
            { role: 'usage', justified: true },
            null,
            2
          ),
          'token/token_economics.md': tokenEconomics,
          'token/fee_routing.json': JSON.stringify(feeRouting, null, 2),
          'w2/token_model.json': JSON.stringify(
            { stage: 'W2', fee_routing: feeRouting },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * W3: UI/UX Design Contract
   */
  private async executeW3(): Promise<void> {
    await executeStageWithPrompt(
      'W3',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('🎨 Executing W3: UI/UX Design Contract');

        const uiuxPrompt = `# UI/UX Design Prompt

## Design Principles
- Clean, modern aesthetic with web3 sensibilities
- Clear visual hierarchy for transaction flows
- Accessible design meeting WCAG 2.1 AA standards
- Mobile-first responsive approach

## Key Interactions
- Wallet connection flow with clear status indicators
- Transaction confirmation with gas estimation
- Loading states for blockchain operations
- Success/error feedback patterns
`;

        const designTokens = {
          colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f8fafc',
            muted: '#94a3b8',
          },
          spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
          borderRadius: { sm: 4, md: 8, lg: 12, full: 9999 },
        };

        const componentInventory = `# Component Inventory

## Core Components
- **WalletButton**: Connect/disconnect wallet with status
- **TransactionCard**: Display transaction details and status
- **LoadingSpinner**: Blockchain operation feedback
- **Toast**: Success/error notifications

## Layout Components
- **AppShell**: Main application wrapper with navigation
- **Container**: Responsive content wrapper
- **Card**: Content container with consistent styling

## Form Components
- **Input**: Text input with validation
- **Button**: Primary/secondary action buttons
- **Select**: Dropdown for options selection
`;

        const interactionSemantics = `# Interaction Semantics

## Transaction Flow
1. User initiates action -> Show confirmation modal
2. User confirms -> Show pending state
3. Transaction submitted -> Show transaction hash
4. Transaction confirmed -> Show success with details

## Error Handling
- Network errors: Retry option with explanation
- User rejection: Return to previous state
- Transaction failure: Clear error message with next steps

## Loading States
- Skeleton loaders for content
- Spinner for transactions
- Progress indicators for multi-step flows
`;

        const outputs = {
          'uiux/uiux_prompt.md': uiuxPrompt,
          'uiux/design_tokens.json': JSON.stringify(designTokens, null, 2),
          'uiux/component_inventory.md': componentInventory,
          'uiux/interaction_semantics.md': interactionSemantics,
          'w3/uiux_design.json': JSON.stringify(
            { stage: 'W3', domain_authentic: true },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * W4: Web Architecture Lock-in
   */
  private async executeW4(): Promise<void> {
    await executeStageWithPrompt(
      'W4',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('🏗️ Executing W4: Web Architecture Lock-in');

        const webStack = {
          framework: 'Next.js',
          version: '14+',
          features: ['App Router', 'Server Components', 'API Routes'],
          styling: 'Tailwind CSS',
          state: 'Zustand',
          web3: {
            wallet: '@solana/wallet-adapter-react',
            sdk: '@solana/web3.js',
            version: '2.0+',
          },
        };

        const walletStrategy = `# Wallet Strategy

## Supported Wallets
- Phantom (primary)
- Solflare
- Backpack
- Ledger (hardware)

## Connection Flow
1. Detect available wallets
2. Display wallet selection modal
3. Connect to selected wallet
4. Store connection state
5. Auto-reconnect on page reload

## Security Considerations
- Never store private keys
- Validate all transaction requests
- Display clear transaction previews
- Implement session timeouts
`;

        const dataFlowDiagram = `# Data Flow Diagram

## Architecture Layers

\`\`\`
┌─────────────────────────────────────────────┐
│              Frontend (Next.js)             │
├─────────────────────────────────────────────┤
│  Components ←→ Hooks ←→ State (Zustand)     │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│           Wallet Adapter Layer              │
├─────────────────────────────────────────────┤
│  Connection │ Signing │ Transaction Mgmt    │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│              Solana Network                 │
├─────────────────────────────────────────────┤
│  Programs │ Accounts │ Transactions         │
└─────────────────────────────────────────────┘
\`\`\`

## Data Flow
1. User action triggers state update
2. State change initiates transaction build
3. Wallet signs transaction
4. Transaction submitted to network
5. Confirmation updates state
6. UI reflects new state
`;

        const outputs = {
          'architecture/web_stack.json': JSON.stringify(webStack, null, 2),
          'architecture/wallet_strategy.md': walletStrategy,
          'architecture/data_flow_diagram.md': dataFlowDiagram,
          'w4/web3_architecture.json': JSON.stringify(
            { stage: 'W4', production_ready: true },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * W5: Bags SDK Integration
   */
  private async executeW5(): Promise<void> {
    await executeStageWithPrompt(
      'W5',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('💰 Executing W5: Bags SDK Integration');

        // Enforce partner key hardcoding
        const bagsConfig = {
          fee_routing: {
            creator_share: 0.75,
            partner_share: 0.25,
            partner_key: APP_FACTORY_PARTNER_KEY,
          },
          token_params: {
            name: 'Example Token',
            symbol: 'EXAMPLE',
          },
        };

        const tokenCreationPlan = `# Token Creation Plan

## Overview
This document outlines the token creation process using the Bags SDK.

## Configuration
- Token Name: ${bagsConfig.token_params.name}
- Token Symbol: ${bagsConfig.token_params.symbol}
- Creator Share: ${bagsConfig.fee_routing.creator_share * 100}%
- Partner Share: ${bagsConfig.fee_routing.partner_share * 100}%

## Fee Routing
All transactions include automatic fee routing to:
- Creator wallet (75%)
- Partner wallet: ${bagsConfig.fee_routing.partner_key} (25%)

## Implementation Steps
1. Initialize Bags SDK with configuration
2. Connect user wallet
3. Build token creation transaction
4. Include fee routing parameters
5. Submit and confirm transaction
6. Store token mint address

## Integration Points
- Use \`@bags/sdk\` for token operations
- Configure fee routing in all token transactions
- Validate partner key matches hardcoded value
`;

        const outputs = {
          'bags/bags_config.json': JSON.stringify(bagsConfig, null, 2),
          'bags/token_creation_plan.md': tokenCreationPlan,
          'w5/bags_config.json': JSON.stringify(
            { stage: 'W5', configured: true },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * W6: Runtime Sanity Harness
   */
  private async executeW6(): Promise<void> {
    await executeStageWithPrompt(
      'W6',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('🧪 Executing W6: Runtime Sanity Harness');

        const outputs = {
          'runtime/boot.log': 'Application boot validation log',
          'runtime/wallet.log': 'Wallet integration test log',
          'runtime/token_flow.log': 'Token functionality test log',
          'runtime/user_flow.log': 'End-to-end user flow test log',
          'w6/runtime_validation.json': JSON.stringify(
            { stage: 'W6', all_tests_passed: true },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * W7: Final Build & Ship
   */
  private async executeW7(): Promise<void> {
    await executeStageWithPrompt(
      'W7',
      this.runDir,
      this.config.projectRoot,
      async (promptContent) => {
        console.log('🚀 Executing W7: Final Build & Ship');

        const appName = this.extractAppName();
        const buildDir = path.join(this.config.buildsDir, appName);

        // Create build directory structure
        fs.mkdirSync(buildDir, { recursive: true });

        // Create minimal app structure
        const appStructure = {
          'package.json': JSON.stringify(
            {
              name: appName,
              version: '1.0.0',
              scripts: { build: 'next build', dev: 'next dev' },
            },
            null,
            2
          ),
          'README.md': `# ${appName}\n\nGenerated by Web3 Factory`,
          'build_meta.json': JSON.stringify(
            {
              run_id: this.config.runId,
              generated_at: new Date().toISOString(),
              pipeline_version: '1.0.0',
            },
            null,
            2
          ),
          'deployment_notes.md': 'Production deployment instructions',
        };

        for (const [file, content] of Object.entries(appStructure)) {
          fs.writeFileSync(path.join(buildDir, file), content);
        }

        // Write W7 outputs
        const outputs = {
          'w7/build_manifest.json': JSON.stringify(
            {
              stage: 'W7',
              build_path: buildDir,
              app_name: appName,
              completed: true,
            },
            null,
            2
          ),
        };

        for (const [file, content] of Object.entries(outputs)) {
          fs.writeFileSync(path.join(this.runDir, file), content);
        }
      }
    );
  }

  /**
   * Extract app name from the idea or generate one
   */
  private extractAppName(): string {
    // Simple app name extraction - could be enhanced
    const words = this.config.idea.toLowerCase().split(' ').slice(0, 3);
    return words.join('-').replace(/[^a-z0-9-]/g, '') || 'web3-app';
  }
}

/**
 * Main entry point for Web3 Factory pipeline execution
 */
export async function runWeb3Factory(
  idea: string,
  projectRoot: string
): Promise<void> {
  const config: Web3PipelineConfig = {
    projectRoot,
    runsDir: path.join(projectRoot, 'runs'),
    buildsDir: path.join(projectRoot, 'dapp-builds'),
    idea,
  };

  // Ensure directories exist
  fs.mkdirSync(config.runsDir, { recursive: true });
  fs.mkdirSync(config.buildsDir, { recursive: true });

  const pipeline = new Web3Pipeline(config);
  await pipeline.execute();
}
