/**
 * Agent Definition
 *
 * Defines the agent's configuration, capabilities, and processing logic.
 * Follows Rig-aligned architecture patterns.
 */

import { echoTool, EchoToolArgs } from './tools/echo.js';
import { logger } from '../lib/logger.js';

/**
 * Agent Definition Interface
 * Describes the agent's identity and capabilities
 */
export interface AgentDefinition {
  name: string;
  version: string;
  description: string;
  preamble: string;
  tools: Tool[];
}

/**
 * Tool Interface
 * Describes a capability the agent can use
 */
export interface Tool {
  name: string;
  description: string;
  execute: (args: unknown) => Promise<unknown>;
}

/**
 * Agent Definition
 */
export const agentDefinition: AgentDefinition = {
  name: 'example-agent',
  version: '1.0.0',
  description: 'A minimal example agent demonstrating App Factory patterns',
  preamble: `You are a helpful assistant. You can use tools to accomplish tasks.
Available tools:
- echo: Repeat back the input message

Always be helpful, accurate, and concise.`,
  tools: [echoTool],
};

/**
 * Process Input
 *
 * Main entry point for processing user input.
 * In a real agent, this would:
 * 1. Parse the input
 * 2. Decide which tools to use
 * 3. Execute tools in a loop
 * 4. Return the final response
 */
export async function processInput(
  input: string,
  context?: Record<string, string>
): Promise<{ response: string; toolsUsed: string[] }> {
  logger.info('process_input', { input, hasContext: !!context });

  const toolsUsed: string[] = [];

  // Simple demo: if input starts with "echo:", use the echo tool
  if (input.toLowerCase().startsWith('echo:')) {
    const message = input.slice(5).trim();
    const result = await echoTool.execute({ message } as EchoToolArgs);
    toolsUsed.push('echo');

    return {
      response: `Echo tool result: ${(result as { echoed: string }).echoed}`,
      toolsUsed,
    };
  }

  // Default response
  return {
    response: `Hello! I received your message: "${input}". This is a demo agent. Try starting your message with "echo:" to use the echo tool.`,
    toolsUsed,
  };
}
