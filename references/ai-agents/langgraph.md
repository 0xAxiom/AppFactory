# LangGraph Reference for AppFactory

## Overview

LangGraph is a library for building stateful, multi-step agent applications. It provides graph-based orchestration for complex agent workflows.

## Installation

```bash
npm install @langchain/langgraph @langchain/anthropic
```

## Core Concepts

### State

State is passed between nodes and persists across the graph:

```typescript
import { Annotation } from '@langchain/langgraph';

const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => a.concat(b),
  }),
  next: Annotation<string>(),
});
```

### Nodes

Nodes are functions that process state:

```typescript
async function agent(state: typeof AgentState.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

async function tools(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.tool_calls;
  const results = await executeTools(toolCalls);
  return { messages: results };
}
```

### Edges

Edges define flow between nodes:

```typescript
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls?.length > 0) {
    return 'tools';
  }
  return 'end';
}
```

## Basic Agent

```typescript
import { StateGraph } from '@langchain/langgraph';
import { ChatAnthropic } from '@langchain/anthropic';

const model = new ChatAnthropic({
  model: 'claude-sonnet-4-5-20250514',
});

// Define the graph
const graph = new StateGraph(AgentState)
  .addNode('agent', agent)
  .addNode('tools', tools)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldContinue, {
    tools: 'tools',
    end: '__end__',
  })
  .addEdge('tools', 'agent');

// Compile
const app = graph.compile();

// Run
const result = await app.invoke({
  messages: [new HumanMessage("What's the weather in NYC?")],
});
```

## Multi-Agent Patterns

### Supervisor Pattern

One agent coordinates others:

```typescript
const supervisorGraph = new StateGraph(SupervisorState)
  .addNode('supervisor', supervisorAgent)
  .addNode('researcher', researcherAgent)
  .addNode('writer', writerAgent)
  .addConditionalEdges('supervisor', routeTask, {
    researcher: 'researcher',
    writer: 'writer',
    end: '__end__',
  })
  .addEdge('researcher', 'supervisor')
  .addEdge('writer', 'supervisor');
```

### Hierarchical Pattern

Nested graphs for complex workflows:

```typescript
// Sub-graph for research
const researchGraph = new StateGraph(ResearchState)
  .addNode('search', searchNode)
  .addNode('summarize', summarizeNode)
  .compile();

// Main graph using sub-graph
const mainGraph = new StateGraph(MainState)
  .addNode('plan', planNode)
  .addNode('research', researchGraph) // Nested graph
  .addNode('write', writeNode);
```

## Checkpointing

Persist state for recovery and human-in-the-loop:

```typescript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const app = graph.compile({ checkpointer });

// Run with thread ID
const config = { configurable: { thread_id: "user-123" } };
const result = await app.invoke({ messages: [...] }, config);

// Resume later
const resumedResult = await app.invoke(
  { messages: [new HumanMessage("continue")] },
  config
);
```

## Human-in-the-Loop

Pause for human approval:

```typescript
import { interrupt } from '@langchain/langgraph';

async function sensitiveAction(state: typeof AgentState.State) {
  // Pause and wait for human approval
  const approved = interrupt({
    action: 'delete_user',
    user_id: state.userId,
    message: 'Approve user deletion?',
  });

  if (approved) {
    await deleteUser(state.userId);
    return { messages: [new AIMessage('User deleted')] };
  }

  return { messages: [new AIMessage('Action cancelled')] };
}
```

Resume after approval:

```typescript
// Human approves
await app.invoke({ approved: true }, config);
```

## Streaming

Stream intermediate results:

```typescript
const stream = await app.stream({ messages: [new HumanMessage('Research AI trends')] }, { streamMode: 'values' });

for await (const state of stream) {
  console.log('Current state:', state);
}
```

Or stream events:

```typescript
const eventStream = await app.streamEvents(
  { messages: [...] },
  { version: "v2" }
);

for await (const event of eventStream) {
  if (event.event === "on_chat_model_stream") {
    console.log(event.data.chunk.content);
  }
}
```

## Tool Integration

```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const searchTool = tool(
  async ({ query }) => {
    // Perform search
    return results;
  },
  {
    name: 'search',
    description: 'Search the web',
    schema: z.object({
      query: z.string(),
    }),
  }
);

const modelWithTools = model.bindTools([searchTool]);
```

## Error Handling

```typescript
import { RetryPolicy } from '@langchain/langgraph';

const graph = new StateGraph(AgentState)
  .addNode('agent', agent, {
    retryPolicy: new RetryPolicy({
      maxAttempts: 3,
      initialDelay: 1000,
      backoffFactor: 2,
    }),
  })
  .addNode('tools', tools);
```

## Best Practices

1. **Keep state minimal** - Only store what's needed
2. **Use reducers** - Properly merge state updates
3. **Add timeouts** - Prevent infinite loops
4. **Checkpoint frequently** - Enable recovery
5. **Stream when possible** - Better user experience
6. **Test edges** - Verify routing logic

## Common Patterns

### ReAct Agent

```typescript
const reactGraph = new StateGraph(AgentState)
  .addNode('reason', reasonNode)
  .addNode('act', actNode)
  .addNode('observe', observeNode)
  .addEdge('__start__', 'reason')
  .addEdge('reason', 'act')
  .addEdge('act', 'observe')
  .addConditionalEdges('observe', shouldContinue, {
    reason: 'reason',
    end: '__end__',
  });
```

### Plan-and-Execute

```typescript
const planExecuteGraph = new StateGraph(PlanState)
  .addNode('planner', plannerNode)
  .addNode('executor', executorNode)
  .addNode('replanner', replannerNode)
  .addEdge('__start__', 'planner')
  .addEdge('planner', 'executor')
  .addConditionalEdges('executor', checkCompletion, {
    replanner: 'replanner',
    end: '__end__',
  })
  .addEdge('replanner', 'executor');
```

## Resources

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangGraph Examples](https://github.com/langchain-ai/langgraph/tree/main/examples)
- [LangChain TypeScript](https://js.langchain.com/)
