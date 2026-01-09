# Web3 Factory Prompt System

## Overview

The Web3 Factory uses a prompt-driven pipeline where each stage (W1-W7) has a dedicated, explicit Claude prompt template that serves as the "contract" for that stage's execution and outputs.

## How Stage Prompts Are Used

1. **Contract Enforcement**: Each stage prompt defines exactly what inputs are consumed, outputs are generated, and validation criteria must be met
2. **Deterministic Execution**: The pipeline references these prompt files as the source of truth for stage behavior
3. **Failure Prevention**: Missing or corrupted prompt files cause immediate pipeline failure
4. **Audit Trail**: Every stage execution logs which prompt file was used and its validation hash

## Prompt Versioning

- **Prompt Index**: `prompt_index.json` contains metadata for all prompt files
- **SHA256 Hashing**: Each prompt file content is hashed for integrity verification
- **Version Control**: Prompt changes are tracked through git history
- **Integrity Checks**: Pipeline validates prompt hashes before execution

## Updating Prompts Safely

1. **Backup**: Always commit current working prompts before changes
2. **Update Content**: Modify prompt file content as needed
3. **Update Index**: Run prompt indexing to update hashes
4. **Test Pipeline**: Validate that updated prompts work correctly
5. **Document Changes**: Update git commit with prompt change rationale

## Stage Prompt Files

| Stage | File | Purpose |
|-------|------|---------|
| W1 | `W1_product_reality_gate.md` | Validate Web3 idea necessity |
| W2 | `W2_token_role_economic_contract.md` | Define token role and economics |
| W3 | `W3_uiux_design_contract.md` | Specify domain-authentic UI/UX |
| W4 | `W4_web_architecture_lockin.md` | Define web application architecture |
| W5 | `W5_bags_sdk_integration.md` | Configure Bags SDK for token creation |
| W6 | `W6_runtime_sanity_harness.md` | Validate runtime functionality |
| W7 | `W7_final_build_ship.md` | Generate complete production app |

## Prompt Contract Elements

Each prompt file must include:

- **Role Definition**: What Claude is responsible for in that stage
- **Hard Constraints**: Absolute requirements and limitations
- **Inputs**: Exact files and data the stage may consume
- **Required Outputs**: Exact files and formats the stage must produce
- **Acceptance Criteria**: Explicit "must pass" validation checks
- **Failure Conditions**: Explicit "must fail" scenarios
- **Output Format Rules**: Deterministic formatting requirements

## Pipeline Integration

The Web3 Factory pipeline:

1. **Reads Prompt**: Loads the appropriate prompt file for each stage
2. **Validates Hash**: Confirms prompt integrity using SHA256 hash
3. **Executes Stage**: Uses prompt as contract for stage behavior
4. **Logs Usage**: Documents prompt filename and hash in stage report
5. **Validates Output**: Ensures outputs conform to prompt contract

## Error Handling

Pipeline **MUST FAIL** if:
- Prompt file is missing or unreadable
- Prompt hash doesn't match expected value in index
- Stage output doesn't conform to prompt contract
- Required prompt elements are missing or malformed

## Maintenance

- **Regular Review**: Prompt files should be reviewed for accuracy and completeness
- **Schema Alignment**: Ensure prompts align with JSON schemas in `/schemas`
- **Agent Sync**: Keep prompts synchronized with agent templates in `/templates/agents`
- **Testing**: Validate prompt changes through full pipeline execution