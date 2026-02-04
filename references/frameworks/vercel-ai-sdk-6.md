# Vercel AI SDK 6 Reference for AppFactory

## Overview

Vercel AI SDK 6 is the standard for building AI-powered applications with React and Next.js. It provides streaming, tool calling, and agent patterns.

## Installation

```bash
npm install ai @ai-sdk/anthropic
```

## Key Features

- **Streaming** - Real-time token streaming
- **Tool Calling** - Define and execute tools
- **Multi-Provider** - Claude, OpenAI, Google, more
- **Agent Patterns** - Built-in agent abstractions
- **React Hooks** - `useChat`, `useCompletion`, `useObject`

## Basic Usage

### Text Generation

```typescript
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const { text } = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  prompt: 'Explain quantum computing in simple terms.',
});
```

### Streaming

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const { textStream } = await streamText({
  model: anthropic('claude-sonnet-4-5'),
  prompt: 'Write a story about a robot.',
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```

## React Hooks

### useChat

```typescript
"use client";

import { useChat } from "ai/react";

export function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

### API Route

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-sonnet-4-5'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## Tool Calling

### Define Tools

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get the current weather for a location',
  parameters: z.object({
    location: z.string().describe('The city and state'),
    unit: z.enum(['celsius', 'fahrenheit']).optional(),
  }),
  execute: async ({ location, unit = 'celsius' }) => {
    // Fetch weather data
    return {
      location,
      temperature: 22,
      unit,
      condition: 'sunny',
    };
  },
});
```

### Use Tools

```typescript
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const { text, toolCalls, toolResults } = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  tools: { weather: weatherTool },
  prompt: "What's the weather in San Francisco?",
});
```

### Multi-Turn Tool Use

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = await streamText({
  model: anthropic('claude-sonnet-4-5'),
  tools: { weather: weatherTool },
  maxSteps: 5, // Allow multiple tool calls
  messages: [{ role: 'user', content: 'Compare weather in SF and NYC' }],
});

for await (const part of result.fullStream) {
  if (part.type === 'tool-call') {
    console.log('Calling tool:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Tool result:', part.result);
  } else if (part.type === 'text-delta') {
    process.stdout.write(part.textDelta);
  }
}
```

## Agent Patterns

### Simple Agent Loop

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const tools = {
  search: searchTool,
  calculate: calculateTool,
  fetchData: fetchDataTool,
};

const result = await streamText({
  model: anthropic('claude-sonnet-4-5'),
  tools,
  maxSteps: 10,
  system: `You are a helpful assistant. Use tools to help the user.`,
  messages: [{ role: 'user', content: userQuery }],
});
```

### Agent with Memory

```typescript
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

class Agent {
  private messages: Message[] = [];
  private model = anthropic('claude-sonnet-4-5');

  async chat(userMessage: string) {
    this.messages.push({ role: 'user', content: userMessage });

    const { text, toolCalls } = await generateText({
      model: this.model,
      tools: this.tools,
      messages: this.messages,
      maxSteps: 5,
    });

    this.messages.push({ role: 'assistant', content: text });

    return text;
  }
}
```

## Structured Output

### Generate Object

```typescript
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        })
      ),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a recipe for chocolate chip cookies.',
});
```

### Stream Object

```typescript
import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const { partialObjectStream } = await streamObject({
  model: anthropic('claude-sonnet-4-5'),
  schema: recipeSchema,
  prompt: 'Generate a recipe for pasta.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

## React Hook: useObject

```typescript
"use client";

import { useObject } from "ai/react";
import { recipeSchema } from "./schema";

export function RecipeGenerator() {
  const { object, submit, isLoading } = useObject({
    api: "/api/recipe",
    schema: recipeSchema,
  });

  return (
    <div>
      <button onClick={() => submit("chocolate cake")} disabled={isLoading}>
        Generate Recipe
      </button>

      {object && (
        <div>
          <h2>{object.recipe?.name}</h2>
          <ul>
            {object.recipe?.ingredients?.map((ing, i) => (
              <li key={i}>
                {ing.amount} {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Provider Configuration

### Anthropic (Claude)

```typescript
import { anthropic } from '@ai-sdk/anthropic';

// Models
anthropic('claude-opus-4-5'); // Most capable
anthropic('claude-sonnet-4-5'); // Balanced
anthropic('claude-haiku-3-5'); // Fast and cheap
```

### OpenAI

```typescript
import { openai } from '@ai-sdk/openai';

openai('gpt-4o'); // Latest GPT-4
openai('gpt-4o-mini'); // Smaller, faster
```

### Google

```typescript
import { google } from '@ai-sdk/google';

google('gemini-2.5-pro'); // Latest Gemini
```

## Error Handling

```typescript
import { generateText, APICallError } from 'ai';

try {
  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: 'Hello',
  });
} catch (error) {
  if (error instanceof APICallError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.statusCode);
  }
}
```

## Best Practices

1. **Use streaming** for chat interfaces
2. **Set maxSteps** to prevent infinite loops
3. **Validate tool inputs** with Zod schemas
4. **Handle errors** gracefully
5. **Use appropriate model** for task complexity

## Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Examples](https://github.com/vercel/ai/tree/main/examples)
- [API Reference](https://sdk.vercel.ai/docs/reference)
