/**
 * Type definitions following Rig framework patterns.
 * @see https://github.com/0xPlaygrounds/rig
 */

import { z } from 'zod';

// ============================================================================
// Tool Types (Rig Tool trait equivalent)
// ============================================================================

/**
 * Tool definition for LLM function calling.
 * Equivalent to Rig's ToolDefinition struct.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Base interface for all tools.
 * Equivalent to Rig's Tool trait.
 */
export interface Tool<TArgs = unknown, TOutput = unknown> {
  readonly name: string;
  definition(): ToolDefinition;
  call(args: TArgs): Promise<TOutput>;
}

// ============================================================================
// Agent Types (Rig Agent<M> equivalent)
// ============================================================================

/**
 * Agent definition following Rig's Agent<M> struct pattern.
 */
export interface AgentDefinition {
  name: string;
  description: string;
  preamble: string;
  tools: Tool[];
  staticContext?: string;
  temperature?: number;
  maxTokens?: number;
  maxIterations?: number;
}

/**
 * Result of agent execution.
 */
export interface AgentResponse {
  explanation: string;
  codeSnippets: CodeSnippet[];
  metadata: ExecutionMetadata;
  suggestedQuestions: string[];
}

// ============================================================================
// Domain Types
// ============================================================================

export interface CodeSnippet {
  file: string;
  startLine: number;
  endLine: number;
  content: string;
  relevance: string;
}

export interface ExecutionMetadata {
  filesExamined: number;
  toolCalls: number;
  executionTimeMs: number;
  confidence: 'high' | 'medium' | 'low';
}

// ============================================================================
// Input/Output Schemas (Zod)
// ============================================================================

export const ExplainRequestSchema = z.object({
  question: z.string().min(1).max(2000).describe('Natural language question about the codebase'),
  directory: z.string().min(1).describe('Absolute path to codebase root'),
  options: z.object({
    maxFiles: z.number().min(1).max(100).default(20).describe('Max files to read'),
    maxDepth: z.number().min(1).max(10).default(5).describe('Max directory depth'),
    includePatterns: z.array(z.string()).default(['**/*.ts', '**/*.js', '**/*.py', '**/*.go', '**/*.rs']),
    excludePatterns: z.array(z.string()).default(['**/node_modules/**', '**/.git/**', '**/dist/**']),
  }).optional(),
});

export type ExplainRequest = z.infer<typeof ExplainRequestSchema>;

export const ExplainResponseSchema = z.object({
  explanation: z.string().describe('Clear, structured explanation'),
  codeSnippets: z.array(z.object({
    file: z.string(),
    startLine: z.number(),
    endLine: z.number(),
    content: z.string(),
    relevance: z.string().describe('Why this snippet matters'),
  })),
  metadata: z.object({
    filesExamined: z.number(),
    toolCalls: z.number(),
    executionTimeMs: z.number(),
    confidence: z.enum(['high', 'medium', 'low']),
  }),
  suggestedQuestions: z.array(z.string()).max(3),
});

export type ExplainResponse = z.infer<typeof ExplainResponseSchema>;

// ============================================================================
// Tool-Specific Types
// ============================================================================

// list_directory
export interface ListDirectoryArgs {
  path: string;
  maxDepth?: number;
  includeHidden?: boolean;
}

export interface DirectoryEntry {
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

export interface ListDirectoryOutput {
  entries: DirectoryEntry[];
  totalFiles: number;
  totalDirectories: number;
}

// read_file
export interface ReadFileArgs {
  path: string;
  startLine?: number;
  endLine?: number;
}

export interface ReadFileOutput {
  content: string;
  totalLines: number;
  language: string;
  truncated: boolean;
}

// search_code
export interface SearchCodeArgs {
  pattern: string;
  directory: string;
  fileGlob?: string;
  maxResults?: number;
}

export interface SearchMatch {
  file: string;
  line: number;
  content: string;
  context: { before: string; after: string };
}

export interface SearchCodeOutput {
  matches: SearchMatch[];
  totalMatches: number;
  truncated: boolean;
}

// analyze_imports
export interface AnalyzeImportsArgs {
  file: string;
  direction: 'imports' | 'exports' | 'both';
}

export interface ImportInfo {
  from: string;
  items: string[];
}

export interface ExportInfo {
  name: string;
  type: 'function' | 'class' | 'const' | 'default' | 'type' | 'interface';
}

export interface AnalyzeImportsOutput {
  imports: ImportInfo[];
  exports: ExportInfo[];
}
