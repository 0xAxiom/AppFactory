# Research Report 1: Discovery Completeness

## Ralph Adversarial Research Loop 1

**Focus:** Exhaustive discovery of existing prompt management systems, instruction routers, agent planners, DSL-based systems, workflow orchestration tools, and plugin-style frameworks.

---

## Category 1: Prompt Management Platforms

### Enterprise/SaaS Solutions

| System                                          | What It Solves                                                                    | What It Fails At                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **[Langfuse](https://langfuse.com)**            | Prompt versioning, deployment, centralized registry, observability, cost tracking | Tightly coupled to observability; not designed for instruction composition |
| **[PromptLayer](https://www.promptlayer.com/)** | Middleware logging, visual prompt registry, version tracking                      | Focused on logging/analytics, not behavioral contracts                     |
| **[Agenta](https://agenta.ai)**                 | Prompt history, branching, rollback, side-by-side comparison                      | Optimized for iteration, not for deterministic instruction routing         |
| **[Portkey](https://portkey.ai)**               | Unified API to 1600+ LLMs, automatic routing, failover                            | Model-level routing, not instruction-level orchestration                   |
| **[Lilypad](https://lilypad.so)**               | Full-context versioning (logic + variables + settings)                            | Python-specific; encapsulates but doesn't compose                          |
| **[Vellum AI](https://www.vellum.ai)**          | Enterprise governance, deployment, observability                                  | Heavy enterprise focus; less suited for individual workflows               |

### Open Source

| System                                         | What It Solves                                        | What It Fails At                                    |
| ---------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| **[Arize Phoenix](https://phoenix.arize.com)** | Self-hosted prompt versioning, templating, evaluation | Observability-first; prompt management is secondary |
| **[Braintrust](https://www.braintrust.dev)**   | Prompt versioning with evaluation pipelines           | Evaluation-centric; not a skill/instruction router  |

---

## Category 2: Agent Frameworks & Instruction Routers

### Major Frameworks

| Framework                                           | Architecture                        | Strengths                                                 | Weaknesses                                      |
| --------------------------------------------------- | ----------------------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| **[LangChain](https://langchain.com)**              | Chain-based composition with LCEL   | Broad ecosystem, rapid prototyping                        | High latency, token-heavy, complex abstractions |
| **[LangGraph](https://langchain.com/langgraph)**    | Graph-based state machine           | Lowest latency, minimal token usage, fine-grained control | Steeper learning curve                          |
| **[AutoGen](https://microsoft.github.io/autogen/)** | Multi-agent conversation            | Flexible agent behavior, research-friendly                | Less production-ready                           |
| **[CrewAI](https://crewai.com)**                    | Role-based agent crews              | Structured roles, task delegation                         | Opinionated structure                           |
| **[Haystack](https://haystack.deepset.ai)**         | Pipeline-based with retrieval focus | Enterprise-ready, modular                                 | RAG-focused, not general instruction routing    |
| **[LlamaIndex](https://llamaindex.ai)**             | Document indexing and retrieval     | Best-in-class RAG                                         | Not an instruction orchestrator                 |

### Routing Architectures

| System                                                                      | Mechanism                                            | Use Case                            |
| --------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------- |
| **[NVIDIA LLM Router](https://github.com/NVIDIA-AI-Blueprints/llm-router)** | Intent classification or neural routing              | Model selection optimization        |
| **[AgentRouter](https://arxiv.org/abs/2510.05445)**                         | Knowledge-graph-guided GNN routing                   | Multi-agent QA task routing         |
| **[HuggingGPT](https://huggingface.co/spaces/microsoft/HuggingGPT)**        | LLM as task planner connecting AI models             | Tool/model orchestration            |
| **TDP (Task-Decoupled Planning)**                                           | DAG decomposition with Supervisor + Planner-Executor | Error isolation, focused replanning |

---

## Category 3: Prompt DSLs & Structured Generation

| System                                                     | Approach                                       | Strengths                                  | Weaknesses                                      |
| ---------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| **[Impromptu](https://github.com/SOM-Research/Impromptu)** | Langium-based DSL for prompt definition        | Multi-modal prompts, structured definition | Prototype stage; limited adoption               |
| **Grammar Prompting**                                      | BNF grammars for constrained generation        | Syntactic validity guaranteed              | No improvement for well-known DSLs (SQL, regex) |
| **PDL (Declarative Prompt DSL)**                           | YAML-embedded, typed artifacts                 | Composable blocks, JSON Schema validation  | Requires schema definition upfront              |
| **[OpenPrompt](https://github.com/thunlp/OpenPrompt)**     | PyTorch library for prompt-learning            | Modular templates, metric hooks            | ML-research focused, not runtime orchestration  |
| **DSL-Copilot (Microsoft)**                                | LLM generates DSL, compiler validates, iterate | 85% accuracy with interventions            | Requires compiler/parser infrastructure         |

---

## Category 4: Workflow Orchestration & Low-Code

### Visual/Low-Code Platforms

| Platform                             | Approach                                  | Strengths                              | Weaknesses                           |
| ------------------------------------ | ----------------------------------------- | -------------------------------------- | ------------------------------------ |
| **[Flowise](https://flowiseai.com)** | Visual builder on LangChain/LlamaIndex    | Beginner-friendly, multi-agent support | Abstraction over abstractions        |
| **[Langflow](https://langflow.org)** | Open-source visual RAG/agent builder      | Model-agnostic, Python-native          | Visual paradigm limits precision     |
| **[n8n](https://n8n.io)**            | General workflow automation with AI nodes | Broad integration ecosystem            | Not AI-native; prompts are secondary |

### Cloud-Native Enterprise

| Platform                    | Ecosystem                | Trade-offs                      |
| --------------------------- | ------------------------ | ------------------------------- |
| **Vertex AI Agent Builder** | Google Cloud native      | Vendor lock-in                  |
| **Azure Copilot Studio**    | Microsoft 365/Azure      | Enterprise-heavy, less flexible |
| **AWS Bedrock AgentCore**   | AWS native orchestration | AWS-specific                    |

---

## Category 5: Composable Prompt Frameworks

| Approach                                 | Description                          | Prompt-Factory Relevance                 |
| ---------------------------------------- | ------------------------------------ | ---------------------------------------- |
| **LCEL (LangChain Expression Language)** | Declarative chain composition        | Composability model, but runtime-focused |
| **Modular Template Systems**             | Dynamic variables, conditional logic | Pattern to adopt for skill modules       |
| **Prompt-as-Code**                       | Versioned, tested, CI/CD integrated  | Aligns with auditability goals           |
| **PromptAppGPT**                         | Low-code with plugin extensions      | Plugin architecture reference            |

---

## Gap Analysis: What Prompt-Factory Improves

### 1. **Instruction vs. Invocation Separation**

Existing systems conflate "storing a prompt" with "executing a prompt." Prompt-Factory treats prompts as **behavioral contracts** that require explicit activation.

### 2. **Href-as-Reference Principle**

No existing system has a formalized concept of treating linked resources as provenance rather than execution triggers. This is a novel constraint.

### 3. **Skill Module Schema**

Current platforms version "prompt strings." Prompt-Factory versions **complete skill modules** with:

- Trigger conditions
- MUST/MUST NOT rules
- Failure modes
- Input/output contracts

### 4. **Determinism Over Convenience**

Most frameworks optimize for developer experience. Prompt-Factory optimizes for **predictability and auditability**.

### 5. **Manual Step Surfacing**

Existing orchestrators hide human-required steps. Prompt-Factory makes manual gates explicit in pipelines.

---

## Sources

- [Top 5 Prompt Management Platforms 2025 - Maxim AI](https://www.getmaxim.ai/articles/top-5-prompt-management-platforms-in-2025/)
- [Prompt Management Systems Compared - Nearform](https://nearform.com/digital-community/prompt-management-systems-compared/)
- [LLM Agents Guide - SuperAnnotate](https://www.superannotate.com/blog/llm-agents)
- [AgentRouter Paper - arXiv](https://arxiv.org/abs/2510.05445)
- [Grammar Prompting - NeurIPS 2023](https://arxiv.org/abs/2305.19234)
- [Impromptu DSL - GitHub](https://github.com/SOM-Research/Impromptu)
- [Top LangChain Alternatives 2026 - Vellum](https://www.vellum.ai/blog/top-langchain-alternatives)
- [LLM Orchestration 2026 - AI Multiple](https://research.aimultiple.com/llm-orchestration/)
- [AI Agent Orchestration Frameworks - n8n](https://blog.n8n.io/ai-agent-orchestration-frameworks/)
- [Prompt Engineering Frameworks - Parloa](https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/)

---

## Discovery Completeness Self-Assessment

| Category               | Coverage | Confidence |
| ---------------------- | -------- | ---------- |
| Prompt Registries      | High     | 90%        |
| Instruction Routers    | High     | 85%        |
| Agent Planners         | High     | 85%        |
| DSL-based Systems      | Medium   | 70%        |
| Workflow Orchestration | High     | 90%        |
| Plugin Architectures   | Medium   | 65%        |

**Gaps to address in Loop 2:**

- Deeper dive into academic instruction-following research
- More obscure/niche prompt DSLs
- Security-focused prompt systems
