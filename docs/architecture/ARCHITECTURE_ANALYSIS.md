# Architecture Analysis: Agent Pipeline + Rig Integration

**Date**: 2026-01-17
**Author**: Claude Opus 4.5
**Status**: Reference Document

---

## Executive Summary

This document analyzes the current agent-factory pipeline and proposes a deep integration with the Rig framework by 0xPlaygrounds. The goal is to transform the pipeline from a scaffold generator into a comprehensive learning system for AI agents while maintaining production-grade output quality.

---

## Part 1: Current Agent Pipeline Analysis

### 1.1 What the Agent Pipeline Currently Is

The agent-factory pipeline (v2.0) is a **scaffold generator** that produces complete, runnable Node.js/TypeScript HTTP agents from plain-language descriptions. It follows a five-phase process:

```
PHASE 0: Intent Normalization  → Upgrade raw input to product spec
PHASE 1: Dream Spec Author     → 10-section comprehensive specification
PHASE 2: Research & Position   → Market research, competitor analysis
PHASE 3: Generate              → Complete agent scaffold
PHASE 4: Ralph Polish Loop     → QA until ≥97% quality
```

**Current Output Structure:**
- `agent.json` - Agent manifest
- `package.json` / `tsconfig.json` - Project configuration
- `src/index.ts` - HTTP server with `/health`, `/process` endpoints
- `src/lib/logger.ts` - Structured logging
- `src/lib/errors.ts` - Error handling utilities
- Research artifacts and documentation

**Technology Stack:**
- Runtime: Node.js 18+
- Language: TypeScript
- Interface: HTTP REST
- Port: 8080 (configurable)

### 1.2 What the Current Pipeline Does Well

1. **End-to-End Automation**: From idea to runnable scaffold in one session
2. **Quality Enforcement**: Ralph Polish Loop ensures minimum quality bar
3. **Research Integration**: Market/competitor research as first-class artifacts
4. **Intent Normalization**: Upgrades vague inputs to professional specifications
5. **Structured Output**: Consistent, predictable file structure

### 1.3 What the Current Pipeline Is Missing

#### Conceptual Gaps

| Missing Concept | Impact |
|-----------------|--------|
| **Agent Definition** | No formal definition of what an "agent" is vs. a "service" |
| **Reasoning Loops** | No concept of iterative reasoning or multi-turn execution |
| **Tool Abstraction** | Tools are implied but not formally modeled |
| **Memory/State** | No persistent state model beyond request/response |
| **Environment Model** | No concept of what the agent perceives or can affect |
| **Safety Boundaries** | `safety.disallowedActions` exists but is not systematically enforced |
| **Multi-Agent Coordination** | No concept of agent composition or delegation |

#### Architectural Gaps

| Missing Element | Current State | Impact |
|-----------------|---------------|--------|
| **Execution Loop** | Single request/response | Cannot handle multi-step tasks |
| **Tool Calling** | Manual LLM integration | No structured tool invocation |
| **Context Management** | Static context only | Cannot adapt to conversation |
| **Streaming** | Not supported | Poor UX for long-running tasks |
| **Observability** | Basic JSON logging | No tracing, no debugging tools |

#### Educational Gaps

1. Users don't learn *what* an agent is - they just get code
2. No progression from simple to complex agent patterns
3. No explanation of when agents are appropriate vs. overkill
4. No connection to production-grade frameworks

---

## Part 2: Rig Framework Analysis

### 2.1 What Rig Is

Rig is a **Rust library for building LLM-powered applications** that focuses on ergonomics and modularity. It provides production-grade abstractions for:

- Agent composition and execution
- Tool calling with typed interfaces
- Vector store integration (RAG)
- Multi-provider LLM support (20+ providers)
- Pipeline orchestration
- Streaming and observability

### 2.2 Core Rig Concepts

#### Agent (`Agent<M>`)

```rust
pub struct Agent<M> {
    pub name: Option<String>,
    pub description: Option<String>,
    pub model: Arc<M>,                    // LLM model
    pub preamble: Option<String>,         // System prompt
    pub static_context: Vec<Document>,    // Always-available context
    pub dynamic_context: DynamicContextStore, // RAG context
    pub tool_server_handle: ToolServerHandle, // Tools
    pub temperature: Option<f64>,
    pub max_tokens: Option<u64>,
    pub tool_choice: Option<ToolChoice>,
    pub default_max_depth: Option<usize>, // Recursion limit
}
```

**Key Insight**: An agent in Rig is an LLM + preamble + context + tools. This is a precise, composable definition.

#### Tool (`Tool` Trait)

```rust
pub trait Tool: Sized + Send + Sync {
    const NAME: &'static str;
    type Error: std::error::Error + Send + Sync + 'static;
    type Args: for<'a> Deserialize<'a> + Send + Sync;
    type Output: Serialize;

    fn definition(&self, prompt: String) -> impl Future<Output = ToolDefinition>;
    fn call(&self, args: Self::Args) -> impl Future<Output = Result<Self::Output, Self::Error>>;
}
```

**Key Insight**: Tools have typed inputs, outputs, and errors. This enables compile-time safety.

#### Pipeline (`Op` Trait)

```rust
pub trait Op {
    type Input;
    type Output;
    async fn call(&self, input: Self::Input) -> Self::Output;
}
```

**Key Insight**: Pipelines are DAGs of operations, enabling complex orchestration without custom code.

#### Vector Store (`VectorStoreIndex` Trait)

```rust
pub trait VectorStoreIndex {
    type SearchResponse;
    async fn top_n(&self, request: VectorSearchRequest)
        -> Result<Vec<SearchResponse>, VectorStoreError>;
}
```

**Key Insight**: RAG is a first-class concept, not bolted on.

### 2.3 Rig Patterns

| Pattern | Implementation |
|---------|----------------|
| **Simple Agent** | `client.agent("gpt-4").preamble("...").build()` |
| **Agent with Tools** | `.tool(MyTool).tool(OtherTool).build()` |
| **RAG Agent** | `.dynamic_context(5, vector_index).build()` |
| **Agent as Tool** | Agents implement `Tool`, enabling nesting |
| **Orchestration** | `pipeline::new().map(...).prompt(agent).extract(...)` |
| **Autonomous Loops** | External loop calling agent in iterations |

### 2.4 What Rig Does NOT Provide

| Concept | Status | Notes |
|---------|--------|-------|
| **Memory Abstraction** | Not built-in | State is managed externally |
| **Environment Model** | Not built-in | Agent doesn't model environment |
| **Planning** | Not built-in | No explicit planning phase |
| **Reflection** | Not built-in | No self-evaluation loop |
| **Multi-Agent Protocol** | Emerging | MCP support via `rmcp` feature |

---

## Part 3: Mapping Rig to the Agent Pipeline

### 3.1 Clean Mappings

| Pipeline Concept | Rig Concept | Mapping Quality |
|------------------|-------------|-----------------|
| Agent scaffold | `Agent<M>` | **Excellent** - Direct mapping |
| Tool definitions | `Tool` trait | **Excellent** - Typed, structured |
| HTTP endpoints | External (not Rig) | **N/A** - Rig is not a server |
| System prompt | `preamble` | **Excellent** - Direct mapping |
| Context documents | `static_context` | **Excellent** - Direct mapping |
| LLM integration | `providers::*` | **Excellent** - 20+ providers |

### 3.2 Forced Improvements

Where Rig's architecture **requires** changes to the current pipeline:

#### 1. Tool Formalization

**Current State**: Tools are mentioned in `agent.json` but not formally defined in code.

**Rig Requirement**: Every tool must implement the `Tool` trait with typed args/output/error.

**Improvement**:
```rust
// Generated tool must be a proper Tool impl
impl Tool for YouTubeSummarizer {
    const NAME: &'static str = "summarize_video";
    type Args = SummarizeArgs;
    type Output = Summary;
    type Error = SummarizeError;
    // ...
}
```

#### 2. Execution Model

**Current State**: Single request/response via HTTP.

**Rig Requirement**: Multi-turn execution with tool calling loops.

**Improvement**: Generated agents should support:
- Prompt → Tool Call → Result → Continue pattern
- Streaming responses
- Cancellation via `CancelSignal`

#### 3. Context Management

**Current State**: Static context only.

**Rig Requirement**: Dynamic context via vector stores.

**Improvement**: Optionally integrate RAG:
```rust
let agent = client.agent("gpt-4")
    .preamble("...")
    .dynamic_context(5, vector_index)  // RAG integration
    .build();
```

#### 4. Composability

**Current State**: Agents are standalone HTTP servers.

**Rig Requirement**: Agents implement `Tool`, enabling composition.

**Improvement**: Generated agents can be used as tools in other agents:
```rust
let orchestrator = client.agent("gpt-4")
    .tool(summarizer_agent)  // Agent as tool
    .tool(translator_agent)
    .build();
```

### 3.3 Gap Analysis

| Gap | Severity | Resolution |
|-----|----------|------------|
| Rust vs TypeScript | **High** | Educational bridge, not port |
| Memory abstraction | **Medium** | Add conceptual layer |
| Environment model | **Medium** | Add conceptual layer |
| HTTP server | **Low** | Keep as deployment wrapper |
| Streaming | **Medium** | Add to generated code |

---

## Part 4: Integration Strategy

### 4.1 Decision: Rig as Conceptual Foundation, Not Runtime

**Rationale**:
1. The pipeline outputs TypeScript/Node.js - changing to Rust would break existing users
2. Rig's *concepts* are more valuable than its *implementation*
3. Users can graduate to Rust/Rig after learning the concepts

**Decision**: Rig becomes a **conceptual backbone** and **reference architecture**, not the runtime.

### 4.2 What Changes

| Component | Before | After |
|-----------|--------|-------|
| `agent.json` | Informal manifest | Rig-aligned agent definition |
| Tool definitions | Implied | Explicit, typed (Zod schemas) |
| Execution model | Request/response | Multi-turn with tool loop |
| Context | Static | Static + optional RAG |
| Documentation | How to run | What agents are + How to run |
| Reference | None | Rig repo as canonical example |

### 4.3 What Stays the Same

| Component | Reason |
|-----------|--------|
| Node.js/TypeScript | User familiarity, ecosystem |
| HTTP interface | Deployment compatibility |
| Intent Normalization | Proven effective |
| Ralph Polish Loop | Quality enforcement |
| Research artifacts | Market positioning |

### 4.4 New Additions

1. **Rig reference in `/references/rig`** - Canonical source of agent concepts
2. **Educational progression** - Stages 0-6 teaching agent concepts
3. **Concept glossary** - Formal definitions aligned with Rig
4. **Architecture diagrams** - Visual representation of agent patterns
5. **Graduation path** - How to move from TypeScript scaffolds to Rust/Rig

---

## Part 5: Recommendations

### 5.1 Immediate Actions

1. **Keep Rig cloned** at `/references/rig` as authoritative reference
2. **Update `agent.json` schema** to align with Rig's `Agent` struct
3. **Add Tool trait equivalent** in generated TypeScript code
4. **Document Rig concepts** in pipeline READMEs

### 5.2 Short-Term Actions

1. **Create educational stages** (see Educational Flow Design)
2. **Rename web3-factory → dapp-factory** with agent decision gate
3. **Update all READMEs** with Rig integration
4. **Add streaming support** to generated agents

### 5.3 Long-Term Vision

1. **Optional Rust output mode** - Generate Rig-based Rust agents
2. **Rig-onchain-kit integration** - Blockchain agents via Rig
3. **Multi-agent pipelines** - Orchestration patterns
4. **Memory abstraction** - Add state management layer

---

## Part 6: Glossary (Rig-Aligned)

| Term | Definition | Rig Equivalent |
|------|------------|----------------|
| **Agent** | An LLM combined with a system prompt, context, and tools | `Agent<M>` |
| **Tool** | A function an agent can call with typed inputs/outputs | `Tool` trait |
| **Preamble** | System prompt that defines agent behavior | `preamble` field |
| **Context** | Background information available to the agent | `static_context` |
| **Dynamic Context** | Information retrieved at prompt time (RAG) | `dynamic_context` |
| **Completion** | A single LLM call and response | `Completion` trait |
| **Prompt** | User input to an agent | `Prompt` trait |
| **Chat** | Multi-turn conversation with history | `Chat` trait |
| **Pipeline** | DAG of operations transforming input to output | `Op` trait |
| **Extraction** | Structured data extraction from LLM output | `Extractor` |

---

## Conclusion

The agent-factory pipeline produces functional scaffolds but lacks the conceptual depth to teach users what agents truly are. Rig provides a rigorous, production-grade model for agent architecture.

By integrating Rig as a **conceptual foundation** rather than a **runtime dependency**, we can:
1. Teach users real agent architecture
2. Maintain TypeScript/Node.js output for accessibility
3. Provide a clear graduation path to production Rust agents
4. Ground all documentation in a respected, maintained framework

The next step is to create the **Educational Flow Design** that defines how users progress from zero knowledge to building world-class agents.

---

**End of Architecture Analysis**
