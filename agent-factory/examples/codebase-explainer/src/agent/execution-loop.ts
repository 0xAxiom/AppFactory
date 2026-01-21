/**
 * Agent Execution Loop
 * Follows Rig's PromptRequest pattern for iterative tool execution.
 * @see https://github.com/0xPlaygrounds/rig/blob/main/rig-core/src/agent/prompt_request/mod.rs
 */

import OpenAI from 'openai';
import {
  AgentDefinition,
  AgentResponse,
  ExplainRequest,
  CodeSnippet,
} from './types.js';
import { MaxIterationsError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[];
  tool_call_id?: string;
}

/**
 * Execution loop that runs the agent with iterative tool calling.
 * Equivalent to Rig's run_with_tools_concurrently pattern.
 */
export class AgentExecutionLoop {
  private openai: OpenAI;
  private filesExamined: Set<string> = new Set();
  private toolCallCount: number = 0;
  private collectedSnippets: CodeSnippet[] = [];

  constructor(
    private agent: AgentDefinition,
    apiKey: string
  ) {
    this.openai = new OpenAI({ apiKey });
  }

  async run(request: ExplainRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    const maxIterations = this.agent.maxIterations ?? 10;

    // Reset state
    this.filesExamined.clear();
    this.toolCallCount = 0;
    this.collectedSnippets = [];

    // Build initial messages
    const messages: Message[] = [
      { role: 'system', content: this.agent.preamble },
      {
        role: 'user',
        content: `Question: ${request.question}\n\nCodebase directory: ${request.directory}\n\nOptions: ${JSON.stringify(request.options || {})}`,
      },
    ];

    // Build tool definitions for OpenAI
    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] =
      this.agent.tools.map((tool) => ({
        type: 'function',
        function: {
          name: tool.definition().name,
          description: tool.definition().description,
          parameters: tool.definition().parameters,
        },
      }));

    let iteration = 0;

    while (iteration < maxIterations) {
      logger.info('Agent iteration', {
        iteration: iteration + 1,
        messageCount: messages.length,
      });

      // Call OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        tools,
        tool_choice: 'auto',
        temperature: this.agent.temperature ?? 0.7,
        max_tokens: this.agent.maxTokens ?? 4000,
      });

      const choice = response.choices[0];
      const assistantMessage = choice.message;

      // Add assistant message to history
      messages.push({
        role: 'assistant',
        content: assistantMessage.content || '',
        tool_calls: assistantMessage.tool_calls,
      });

      // Check if we're done (no tool calls)
      if (
        !assistantMessage.tool_calls ||
        assistantMessage.tool_calls.length === 0
      ) {
        // Parse final response
        return this.parseAgentResponse(
          assistantMessage.content || '',
          Date.now() - startTime
        );
      }

      // Execute tool calls
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        logger.info('Executing tool', { tool: toolName, args: toolArgs });
        this.toolCallCount++;

        // Find and execute the tool
        const tool = this.agent.tools.find((t) => t.name === toolName);
        if (!tool) {
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: `Unknown tool: ${toolName}` }),
          });
          continue;
        }

        try {
          const result = await tool.call(toolArgs);

          // Track files examined
          if (toolName === 'read_file' && toolArgs.path) {
            this.filesExamined.add(toolArgs.path);
          }

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.warn('Tool execution failed', {
            tool: toolName,
            error: errorMessage,
          });

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: errorMessage }),
          });
        }
      }

      iteration++;
    }

    // Max iterations reached - request final summary
    logger.warn('Max iterations reached, requesting final response');

    messages.push({
      role: 'user',
      content:
        'You have reached the maximum number of tool calls. Please provide your best explanation based on what you have learned so far. Remember to respond with valid JSON in the specified format.',
    });

    const finalResponse = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages:
        messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: this.agent.temperature ?? 0.7,
      max_tokens: this.agent.maxTokens ?? 4000,
    });

    return this.parseAgentResponse(
      finalResponse.choices[0].message.content || '',
      Date.now() - startTime
    );
  }

  private parseAgentResponse(
    content: string,
    executionTimeMs: number
  ): AgentResponse {
    // Try to parse JSON response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;

      const parsed = JSON.parse(jsonContent.trim());

      return {
        explanation: parsed.explanation || 'Unable to generate explanation',
        codeSnippets: parsed.codeSnippets || [],
        metadata: {
          filesExamined: this.filesExamined.size,
          toolCalls: this.toolCallCount,
          executionTimeMs,
          confidence: this.determineConfidence(),
        },
        suggestedQuestions: parsed.suggestedQuestions || [],
      };
    } catch {
      // If JSON parsing fails, treat content as explanation
      logger.warn('Failed to parse JSON response, using raw content');

      return {
        explanation: content,
        codeSnippets: [],
        metadata: {
          filesExamined: this.filesExamined.size,
          toolCalls: this.toolCallCount,
          executionTimeMs,
          confidence: 'low',
        },
        suggestedQuestions: [],
      };
    }
  }

  private determineConfidence(): 'high' | 'medium' | 'low' {
    // Heuristic confidence based on exploration depth
    if (this.filesExamined.size >= 3 && this.toolCallCount >= 5) {
      return 'high';
    }
    if (this.filesExamined.size >= 1 && this.toolCallCount >= 2) {
      return 'medium';
    }
    return 'low';
  }
}
