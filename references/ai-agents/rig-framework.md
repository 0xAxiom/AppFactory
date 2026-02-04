# Rig Framework Reference for AppFactory

## Overview

Rig is a production-grade Rust framework for building LLM-powered applications. It provides high-performance, type-safe abstractions for agents, tools, and RAG pipelines.

## Why Rig?

- **Production-ready** - Built for high-throughput, low-latency applications
- **Type-safe** - Compile-time guarantees for tool definitions
- **Flexible** - Works with Claude, OpenAI, Cohere, and more
- **Extensible** - Easy to add custom providers and tools

## Core Concepts

### Agents

Agents combine an LLM with tools and context:

```rust
use rig::agent::Agent;
use rig::providers::anthropic;

let client = anthropic::Client::from_env();

let agent = client
    .agent("claude-sonnet-4-5-20250514")
    .preamble("You are a helpful assistant that can search the web.")
    .tool(search_tool)
    .tool(calculator_tool)
    .build();

let response = agent.prompt("What is the population of Tokyo?").await?;
```

### Tools

Tools are typed functions the agent can call:

```rust
use rig::tool::Tool;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, JsonSchema)]
struct SearchArgs {
    /// The search query
    query: String,
    /// Maximum results to return
    #[serde(default = "default_max_results")]
    max_results: usize,
}

fn default_max_results() -> usize { 5 }

#[derive(Debug, Serialize)]
struct SearchResult {
    title: String,
    url: String,
    snippet: String,
}

struct SearchTool;

impl Tool for SearchTool {
    const NAME: &'static str = "search";

    type Args = SearchArgs;
    type Output = Vec<SearchResult>;
    type Error = SearchError;

    async fn call(&self, args: Self::Args) -> Result<Self::Output, Self::Error> {
        // Perform search
        Ok(results)
    }
}
```

### Completions

Direct LLM completions without agents:

```rust
use rig::completion::Completion;

let client = anthropic::Client::from_env();

let response = client
    .completion("claude-sonnet-4-5-20250514")
    .prompt("Explain quantum computing")
    .temperature(0.7)
    .max_tokens(1000)
    .await?;
```

## TypeScript Patterns (agent-factory)

While Rig is Rust-native, agent-factory uses Rig-aligned patterns in TypeScript:

### Agent Definition

```typescript
interface Agent {
  name: string;
  preamble: string;
  model: string;
  tools: Tool[];
  maxIterations: number;
}

const searchAgent: Agent = {
  name: 'search-agent',
  preamble: `You are a search assistant. Use the search tool to find information.
  Always cite your sources.`,
  model: 'claude-sonnet-4-5-20250514',
  tools: [searchTool, summarizeTool],
  maxIterations: 10,
};
```

### Tool Definition

```typescript
interface Tool<TArgs, TOutput> {
  name: string;
  description: string;
  argsSchema: z.ZodType<TArgs>;
  outputSchema: z.ZodType<TOutput>;
  execute: (args: TArgs) => Promise<TOutput>;
}

const searchTool: Tool<SearchArgs, SearchResult[]> = {
  name: 'search',
  description: 'Search the web for information',
  argsSchema: z.object({
    query: z.string().describe('The search query'),
    maxResults: z.number().default(5),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      snippet: z.string(),
    })
  ),
  execute: async (args) => {
    // Perform search
    return results;
  },
};
```

### Execution Loop

```typescript
async function runAgent(agent: Agent, userMessage: string): Promise<string> {
  const messages: Message[] = [
    { role: 'system', content: agent.preamble },
    { role: 'user', content: userMessage },
  ];

  for (let i = 0; i < agent.maxIterations; i++) {
    const response = await callLLM(agent.model, messages, agent.tools);

    if (response.stopReason === 'end_turn') {
      return response.content;
    }

    // Handle tool calls
    for (const toolCall of response.toolCalls) {
      const tool = agent.tools.find((t) => t.name === toolCall.name);
      if (!tool) throw new Error(`Unknown tool: ${toolCall.name}`);

      const result = await tool.execute(toolCall.args);
      messages.push({
        role: 'tool_result',
        toolUseId: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: 'assistant', content: response.content });
  }

  throw new Error('Max iterations reached');
}
```

## RAG Pipeline

Rig provides built-in RAG support:

### Rust

```rust
use rig::embeddings::EmbeddingsBuilder;
use rig::vector_store::in_memory::InMemoryVectorStore;

// Create embeddings
let embeddings = client
    .embeddings("voyage-3")
    .documents(documents)
    .build()
    .await?;

// Store in vector DB
let store = InMemoryVectorStore::from_embeddings(embeddings);

// Query
let results = store.search("quantum computing", 5).await?;
```

### TypeScript Pattern

```typescript
interface RAGPipeline {
  embedder: Embedder;
  vectorStore: VectorStore;
  retriever: Retriever;
  agent: Agent;
}

async function ragQuery(pipeline: RAGPipeline, query: string): Promise<string> {
  // Retrieve relevant documents
  const docs = await pipeline.retriever.retrieve(query, 5);

  // Build context
  const context = docs.map((d) => d.content).join('\n\n');

  // Query agent with context
  return pipeline.agent.prompt(`Context:\n${context}\n\nQuery: ${query}`);
}
```

## rig-onchain-kit

For blockchain interactions:

```rust
use rig_onchain_kit::solana::SolanaTools;

let solana_tools = SolanaTools::new(rpc_url, keypair);

let agent = client
    .agent("claude-sonnet-4-5-20250514")
    .tool(solana_tools.transfer())
    .tool(solana_tools.get_balance())
    .tool(solana_tools.swap())
    .build();
```

## Best Practices

### 1. Type All Tools

```typescript
// Always use Zod schemas for validation
const toolSchema = z.object({
  param: z.string().describe('Clear description'),
});
```

### 2. Meaningful Preambles

```typescript
const preamble = `You are a [specific role] that [specific capability].

Your goals:
1. [Goal 1]
2. [Goal 2]

Guidelines:
- [Guideline 1]
- [Guideline 2]

When using tools:
- [Tool usage instruction 1]
- [Tool usage instruction 2]`;
```

### 3. Error Handling

```typescript
async function executeToolSafe(tool: Tool, args: unknown) {
  try {
    const validated = tool.argsSchema.parse(args);
    const result = await tool.execute(validated);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      isError: true,
    };
  }
}
```

### 4. Max Iterations

Always enforce iteration limits:

```typescript
const MAX_ITERATIONS = 10;
let iterations = 0;

while (iterations < MAX_ITERATIONS) {
  // Agent loop
  iterations++;
}
```

## Resources

- [Rig GitHub](https://github.com/0xPlaygrounds/rig)
- [Rig Documentation](https://docs.rig.rs/)
- [rig-onchain-kit](https://github.com/0xPlaygrounds/rig-onchain-kit)
- [Rig Examples](https://github.com/0xPlaygrounds/rig/tree/main/rig-core/examples)
