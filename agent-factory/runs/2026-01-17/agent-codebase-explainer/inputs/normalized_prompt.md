# Normalized Prompt

A **Codebase Explainer Agent** that helps developers understand unfamiliar codebases through natural language interaction. The agent accepts a directory path and questions about the code, then uses a suite of exploration tools to analyze structure, read relevant files, trace dependencies, and synthesize clear explanations with annotated code snippets.

**Core Value Proposition**: Turn "I don't understand this codebase" into "Here's exactly how it works" in seconds.

**Key Capabilities**:
- Multi-tool exploration following Rig-aligned patterns
- Intelligent file discovery (glob patterns, dependency tracing)
- Context-aware code reading with relevance filtering
- Structured explanations with inline code references
- Iterative refinement through tool loops

**Technical Foundation**:
- Rig-aligned Agent/Tool/ExecutionLoop architecture
- Typed tool definitions with Zod schemas
- Maximum 10 tool iterations per query
- Graceful degradation for large codebases
- Structured JSON responses with metadata

**Safety Boundaries**:
- Read-only filesystem access
- Path traversal prevention
- Configurable directory scope limits
- No execution of discovered code

**Target Users**: Developers onboarding to new projects, code reviewers, technical writers, and anyone who needs to quickly understand unfamiliar code.
