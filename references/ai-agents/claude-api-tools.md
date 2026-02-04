# Claude API Tool Use Reference (2026)

## Overview

Claude's tool use allows the model to call external functions, enabling agents that can take actions in the real world.

## Basic Structure

### Tool Definition

```typescript
const tools = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a location',
    input_schema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: "City and state, e.g., 'San Francisco, CA'",
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature unit',
        },
      },
      required: ['location'],
    },
  },
];
```

### API Call

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  tools: tools,
  messages: [{ role: 'user', content: "What's the weather in NYC?" }],
});
```

## Best Practices (2026)

### 1. Use Strict Schema Validation

```typescript
const tool = {
  name: 'search',
  description: 'Search for information',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
    },
    required: ['query'],
    additionalProperties: false, // Strict validation
  },
  strict: true, // Enable strict mode
};
```

### 2. Add Tool Examples in Prompts

Include examples to improve tool usage:

```typescript
const systemPrompt = `You are a helpful assistant with access to tools.

When searching for code, use the search tool like this:
- search({ query: "function handleSubmit", file_pattern: "*.tsx" })
- search({ query: "import React" })

When getting weather, specify the location clearly:
- get_weather({ location: "San Francisco, CA", unit: "fahrenheit" })
`;
```

### 3. Model Selection for Tools

| Model             | Best For                        |
| ----------------- | ------------------------------- |
| claude-opus-4-5   | Complex tools, ambiguous inputs |
| claude-sonnet-4-5 | Standard tools, clear inputs    |
| claude-haiku-3-5  | Simple tools, fast responses    |

### 4. Error Handling

Return descriptive errors:

```typescript
function executeToolCall(toolName: string, toolInput: unknown) {
  try {
    const result = toolRegistry[toolName](toolInput);
    return {
      type: 'tool_result',
      tool_use_id: toolUseId,
      content: JSON.stringify(result),
    };
  } catch (error) {
    return {
      type: 'tool_result',
      tool_use_id: toolUseId,
      content: `Error: ${error.message}. Please try a different approach.`,
      is_error: true, // Mark as error
    };
  }
}
```

### 5. Validate Parameters

```typescript
import { z } from 'zod';

const WeatherSchema = z.object({
  location: z.string().min(1),
  unit: z.enum(['celsius', 'fahrenheit']).optional(),
});

function getWeather(input: unknown) {
  const validated = WeatherSchema.parse(input);
  // Use validated.location, validated.unit
}
```

## Tool Use Loop

### Standard Pattern

```typescript
async function runAgent(userMessage: string) {
  const messages = [{ role: 'user', content: userMessage }];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 4096,
      tools: tools,
      messages: messages,
    });

    // Check if done
    if (response.stop_reason === 'end_turn' || !response.content.some((block) => block.type === 'tool_use')) {
      return response;
    }

    // Process tool calls
    const toolResults = [];
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        const result = await executeToolCall(block.name, block.input);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }
    }

    // Add assistant message and tool results
    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });
  }
}
```

### With Max Iterations

```typescript
const MAX_ITERATIONS = 10;

async function runAgentSafe(userMessage: string) {
  const messages = [{ role: 'user', content: userMessage }];
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 4096,
      tools: tools,
      messages: messages,
    });

    if (response.stop_reason === 'end_turn') {
      return response;
    }

    // Process tools...
  }

  throw new Error('Max iterations reached');
}
```

## Advanced Features (2025-2026)

### Tool Search Tool

For large tool sets, use tool search to defer loading:

```typescript
const toolSearchTool = {
  name: 'search_tools',
  description: 'Search for available tools by description',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'What you want to do' },
    },
    required: ['query'],
  },
};

// When search_tools is called, return relevant tool definitions
```

### Parallel Tool Calling

Claude 4+ models have improved parallel tool calling. Allow it by default:

```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 4096,
  tools: tools,
  // tool_choice: "auto" is default, allows parallel calls
  messages: messages,
});

// Response may contain multiple tool_use blocks
for (const block of response.content) {
  if (block.type === 'tool_use') {
    // Execute in parallel if independent
    toolPromises.push(executeToolCall(block.name, block.input));
  }
}
```

### Forced Tool Use

Force Claude to use a specific tool:

```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 4096,
  tools: tools,
  tool_choice: { type: 'tool', name: 'get_weather' },
  messages: messages,
});
```

Or force any tool use:

```typescript
tool_choice: {
  type: 'any';
}
```

## Common Tool Patterns

### Database Query Tool

```typescript
const queryDbTool = {
  name: 'query_database',
  description: 'Execute a read-only SQL query',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'SQL SELECT query (read-only)',
      },
    },
    required: ['query'],
  },
};
```

### File Operations

```typescript
const readFileTool = {
  name: 'read_file',
  description: 'Read contents of a file',
  input_schema: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'File path' },
    },
    required: ['path'],
  },
};

const writeFileTool = {
  name: 'write_file',
  description: 'Write content to a file',
  input_schema: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['path', 'content'],
  },
};
```

### Web Search

```typescript
const webSearchTool = {
  name: 'web_search',
  description: 'Search the web for information',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      num_results: {
        type: 'integer',
        description: 'Number of results (1-10)',
        minimum: 1,
        maximum: 10,
      },
    },
    required: ['query'],
  },
};
```

## Security Considerations

1. **Validate all inputs** before execution
2. **Limit tool scope** - only expose necessary tools
3. **Audit tool calls** - log all executions
4. **Sandbox dangerous operations** - use E2B or similar
5. **Rate limit** - prevent abuse
6. **Confirm destructive actions** - require user approval

## Resources

- [Tool Use Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
