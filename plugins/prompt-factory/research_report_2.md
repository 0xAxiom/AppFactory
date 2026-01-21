# Research Report 2: Conceptual Clarity

## Ralph Adversarial Research Loop 2

**Focus:** Refining terminology, establishing clear definitions, and ensuring non-overlapping concepts.

---

## Terminology Disambiguation

### Industry Standard Definitions

| Term            | Standard Definition                                           | Prompt-Factory Definition                                                                   |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Prompt**      | The entire input given to an LLM                              | The raw text sent to a model (distinct from a Skill)                                        |
| **Instruction** | A component within a prompt specifying _what task_ to perform | A single directive within a skill's rules                                                   |
| **Skill**       | (Informal) An LLM's learned capability                        | A **complete behavioral contract** with triggers, rules, inputs, outputs, and failure modes |

### Prompt-Factory Unique Vocabulary

| Term                    | Definition                                                                      | Rationale                                                    |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Skill Module**        | A versioned, self-contained unit of prompt intelligence with explicit contracts | Distinguishes from loose "prompt templates"                  |
| **Behavioral Contract** | The MUST/MUST NOT rules that constrain a skill's execution                      | Borrowed from software contracts; makes constraints explicit |
| **Trigger Condition**   | Explicit phrases or implicit signals that activate a skill                      | Prevents silent/accidental activation                        |
| **Activation**          | The explicit act of invoking a skill (not automatic)                            | Core principle: nothing runs silently                        |
| **Provenance**          | The source/origin of information (e.g., hrefs as references)                    | Distinguishes from "action" or "command"                     |
| **Pipeline Gate**       | An explicit checkpoint in a pipeline requiring verification                     | Ensures determinism in multi-stage flows                     |
| **Manual Step**         | A human-required action that cannot be automated                                | Must be surfaced, never hidden                               |

---

## Conceptual Boundaries

### Skill vs. Prompt

```
┌─────────────────────────────────────────────────────────────┐
│ SKILL MODULE                                                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Metadata     │  │ Contracts    │  │ Templates    │       │
│  │ - name       │  │ - MUST rules │  │ - prompt(s)  │       │
│  │ - version    │  │ - MUST NOT   │  │ - variables  │       │
│  │ - triggers   │  │ - failure    │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  A Skill CONTAINS prompts; a prompt is NOT a skill          │
└─────────────────────────────────────────────────────────────┘
```

### Reference vs. Action

```
┌─────────────────────────┐      ┌─────────────────────────┐
│ REFERENCE (Provenance)  │      │ ACTION (Execution)      │
├─────────────────────────┤      ├─────────────────────────┤
│ - URL in markdown       │      │ - Fetch URL content     │
│ - Citation              │      │ - Execute skill         │
│ - Context clue          │      │ - Run pipeline          │
│ - Historical precedent  │      │ - Modify state          │
├─────────────────────────┤      ├─────────────────────────┤
│ DEFAULT: Treated as     │      │ REQUIRES: Explicit      │
│ information             │      │ authorization           │
└─────────────────────────┘      └─────────────────────────┘
```

---

## LLM Behavioral Contracts: State of Research

### Key Findings from "Contracts for LLM APIs" (2025)

Research identified **73+ distinct contract types** across:

- Traditional constraints (input validation, sequencing)
- LLM-specific categories:
  - Output format compliance
  - Content policy enforcement
  - Streaming response assembly
  - Multimodal constraints

**Prompt-Factory Adoption:** Use this taxonomy to categorize skill contract types.

### The Instruction Gap Problem

Research shows LLMs fail at instruction following in three modes:

1. **Repeated content generation** - looping on similar outputs
2. **Random irrelevant responses** - attention drift
3. **Format violations** - ignoring explicit formatting requirements

**Prompt-Factory Mitigation:** Skills include explicit output format contracts and failure mode handling.

### Multi-Turn Interaction Contracts

Contracts governing stateful conversations require:

- Maintaining conversation history
- Proper sequencing of tool calls
- Context window management

**Prompt-Factory Adoption:** Pipeline Construction Contract already addresses sequencing; add explicit state management rules.

---

## Determinism: What's Actually Achievable?

### The Hard Truth

Even with `temperature=0`:

- OpenAI: "mostly deterministic" (not guaranteed)
- Anthropic: "not fully deterministic"
- Research shows accuracy variations up to 15% across runs

### Root Causes

1. Floating-point non-associativity
2. Non-deterministic CUDA kernels
3. Batch size effects
4. Precision format (BF16 vs FP32)

### Prompt-Factory's Stance

**"Deterministic" in Prompt-Factory means:**

- **Process determinism**: Same skill + same inputs → same _procedure_ followed
- **Contract determinism**: MUST/MUST NOT rules are always enforced
- **Audit determinism**: Every activation is logged with rationale

**NOT promised:**

- Bit-identical LLM outputs
- Identical token sequences across runs

---

## Refined Conceptual Model

### Core Principles (Clarified)

| Principle                     | Meaning                                     | Anti-Pattern                |
| ----------------------------- | ------------------------------------------- | --------------------------- |
| **Links are references**      | hrefs inform context, don't trigger actions | Auto-fetching URLs          |
| **Skills are contracts**      | Behavior is constrained, not suggested      | Vague "try to do X" prompts |
| **Activation is explicit**    | Nothing runs without authorization          | Silent skill matching       |
| **Determinism is procedural** | Same inputs → same process                  | Expecting identical outputs |
| **Manual steps are visible**  | Human actions surfaced                      | Hidden human-required steps |

### Category Definitions (Refined)

| Category                     | Description                            | Example Skills                         |
| ---------------------------- | -------------------------------------- | -------------------------------------- |
| **doc_ingestion**            | Processing and indexing documentation  | llms.txt parser, INDEX.md generator    |
| **link_traversal**           | Parsing and optionally fetching URLs   | URL_MAP builder, authorized fetcher    |
| **prompt_compilation**       | Converting ideas to structured prompts | Constraint extractor, template builder |
| **pipeline_execution**       | Multi-stage workflows with gates       | Stage runner, proof gate verifier      |
| **repo_analysis**            | Understanding codebases                | Structure analyzer, pattern detector   |
| **security_hygiene**         | Preventing harmful outputs             | Secret detector, injection guard       |
| **qa_adversarial**           | Testing and challenging outputs        | Ralph loop, assumption challenger      |
| **deterministic_generation** | Reproducible output patterns           | Format enforcer, schema validator      |

---

## Sources

- [Understanding LLM Prompts - Codesmith](https://www.codesmith.io/blog/understanding-the-anatomies-of-llm-prompts)
- [Base LLM vs Instruction-Tuned - Analytics Vidhya](https://www.analyticsvidhya.com/blog/2025/02/base-llm-vs-instruction-tuned-llm/)
- [Contracts for LLM APIs - Research Paper](https://tanzimhromel.com/assets/pdf/llm-api-contracts.pdf)
- [The Instruction Gap - arXiv](https://arxiv.org/html/2601.03269)
- [Meta RIFL Framework](https://ai.meta.com/research/publications/rubric-based-benchmarking-and-reinforcement-learning-for-advancing-llm-instruction-following/)
- [Why Deterministic LLM Output is Nearly Impossible - Unstract](https://unstract.com/blog/understanding-why-deterministic-output-from-llms-is-nearly-impossible/)
- [Defeating Non-Determinism in LLMs - Thinking Machines Lab](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- [Non-Determinism of "Deterministic" LLM Settings - arXiv](https://arxiv.org/html/2408.04667v5)

---

## Conceptual Clarity Self-Assessment

| Concept             | Clarity Level | Notes                         |
| ------------------- | ------------- | ----------------------------- |
| Skill vs Prompt     | High          | Clear distinction established |
| Reference vs Action | High          | Core principle well-defined   |
| Behavioral Contract | High          | Aligned with research         |
| Determinism scope   | High          | Realistic expectations set    |
| Category taxonomy   | Medium        | May need user feedback        |
| Trigger conditions  | Medium        | Need more examples            |
