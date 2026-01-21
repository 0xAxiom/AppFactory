# W1: Web3 Idea Validation

## AGENT-NATIVE EXECUTION

You are Claude executing W1 for Web3 Factory. Validate whether a raw app idea meaningfully benefits from onchain state and token integration.

## WEB3 VALIDATION CRITERIA (MANDATORY)

Before proceeding, the idea MUST pass these validation tests:

### 1. Onchain State Justification

- Does the app require shared, verifiable state between users?
- Would the app still function if data was only stored locally/in databases?
- Is there a compelling reason this state should live onchain vs. traditional backend?

### 2. Token Utility Validation

- Does a token serve a functional purpose, or is it purely speculative?
- Would the app work equally well with traditional payments?
- Is there a clear reason users need to hold/spend tokens vs. fiat?

### 3. Network Effects & Decentralization

- Does the app benefit from permissionless access/composability?
- Are there network effects that improve with more onchain participants?
- Would centralized control break the app's value proposition?

**FAILURE CONDITIONS**: If ANY validation test fails, STOP execution and write detailed failure report.

## INPUTS

- Read: `web3-factory/runs/.../inputs/web3_intake.md` (raw idea text)

## OUTPUTS

- Write: `web3-factory/runs/.../w1/web3_idea.json`
- Write: `web3-factory/runs/.../w1/w1_execution.md`

## JSON SCHEMA

```json
{
  "type": "object",
  "properties": {
    "idea_validation": {
      "type": "object",
      "properties": {
        "idea_id": { "type": "string" },
        "idea_name": { "type": "string" },
        "original_concept": { "type": "string" },
        "target_users": { "type": "string" },
        "core_problem": { "type": "string" },
        "web3_justification": { "type": "string" }
      },
      "required": ["idea_id", "idea_name", "original_concept", "target_users", "core_problem", "web3_justification"]
    },
    "onchain_requirements": {
      "type": "object",
      "properties": {
        "shared_state_needed": { "type": "boolean" },
        "state_description": { "type": "string" },
        "why_onchain": { "type": "string" },
        "centralization_risks": { "type": "string" }
      },
      "required": ["shared_state_needed", "state_description", "why_onchain", "centralization_risks"]
    },
    "token_justification": {
      "type": "object",
      "properties": {
        "token_needed": { "type": "boolean" },
        "functional_purpose": { "type": "string" },
        "why_not_fiat": { "type": "string" },
        "user_incentive": { "type": "string" }
      },
      "required": ["token_needed", "functional_purpose", "why_not_fiat", "user_incentive"]
    },
    "validation_result": {
      "type": "object",
      "properties": {
        "passed_onchain_test": { "type": "boolean" },
        "passed_token_test": { "type": "boolean" },
        "passed_network_effects_test": { "type": "boolean" },
        "overall_valid": { "type": "boolean" },
        "recommendation": { "type": "string" }
      },
      "required": [
        "passed_onchain_test",
        "passed_token_test",
        "passed_network_effects_test",
        "overall_valid",
        "recommendation"
      ]
    }
  },
  "required": ["idea_validation", "onchain_requirements", "token_justification", "validation_result"]
}
```

## EXECUTION STEPS

### 1. Parse Raw Idea

Extract from intake:

- Core concept and functionality
- Target user segment
- Problem being solved
- Current solutions/workarounds

### 2. Web3 Validation Analysis

For each validation test:

**Onchain State Test**:

- Identify what state the app manages
- Determine if state needs to be shared/verified between users
- Evaluate if traditional database storage would suffice
- Document compelling reasons for onchain storage

**Token Utility Test**:

- Define what role a token would play
- Evaluate if fiat payments could serve the same purpose
- Identify unique benefits of token-based interaction
- Assess whether token adds real utility vs. speculation

**Network Effects Test**:

- Analyze how permissionless access benefits the app
- Evaluate composability opportunities with other protocols
- Determine if decentralized control is essential
- Assess network effects from onchain participation

### 3. Generate Structured Concept

Transform raw idea into:

- Clear problem statement
- Defined target users
- Onchain state requirements
- Token utility explanation
- Web3-specific value proposition

### 4. Validation Decision

Based on analysis:

- Mark each validation test as pass/fail
- Provide overall recommendation
- Document why Web3 adds value or recommend traditional approach

## SUCCESS CRITERIA

W1 is successful when:

- [ ] All three validation tests clearly evaluated
- [ ] Onchain state requirements explicitly defined
- [ ] Token utility functionally justified (not speculative)
- [ ] Overall validation decision clearly documented
- [ ] If valid: clear Web3 value proposition articulated
- [ ] If invalid: clear recommendation for traditional approach

## FAILURE CONDITIONS

STOP execution if:

- Idea does not meaningfully benefit from onchain state
- Token serves no functional purpose beyond speculation
- Network effects do not justify decentralization overhead
- No compelling Web3-specific value proposition

Write detailed failure analysis explaining why traditional app development would be more appropriate.

DO NOT output JSON in chat. Write all artifacts to disk only.
