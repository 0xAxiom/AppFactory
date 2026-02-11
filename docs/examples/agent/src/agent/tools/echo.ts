/**
 * Echo Tool
 *
 * A simple demonstration tool that echoes back the input message.
 * Shows the pattern for defining typed tools with Zod schemas.
 */

import { z } from 'zod';
import { logger } from '../../lib/logger.js';

/**
 * Tool Arguments Schema
 * Defines and validates the input to the tool
 */
export const EchoToolArgsSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export type EchoToolArgs = z.infer<typeof EchoToolArgsSchema>;

/**
 * Tool Output Schema
 * Defines the structure of the tool's response
 */
export const EchoToolOutputSchema = z.object({
  echoed: z.string(),
  timestamp: z.string(),
});

export type EchoToolOutput = z.infer<typeof EchoToolOutputSchema>;

/**
 * Echo Tool Definition
 */
export const echoTool = {
  name: 'echo',
  description: 'Echoes back the provided message',

  /**
   * Execute the echo tool
   */
  async execute(args: EchoToolArgs): Promise<EchoToolOutput> {
    // Validate args
    const parsed = EchoToolArgsSchema.safeParse(args);
    if (!parsed.success) {
      throw new Error(`Invalid arguments: ${parsed.error.message}`);
    }

    const { message } = parsed.data;

    logger.info('tool_execute', { tool: 'echo', message });

    // Return the echoed message
    return {
      echoed: message,
      timestamp: new Date().toISOString(),
    };
  },
};
