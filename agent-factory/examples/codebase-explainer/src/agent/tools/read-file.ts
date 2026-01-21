/**
 * read_file Tool
 * Reads file contents with optional line range.
 * Follows Rig's Tool trait pattern.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  Tool,
  ToolDefinition,
  ReadFileArgs,
  ReadFileOutput,
} from '../types.js';
import { validatePath } from '../../lib/path-validator.js';
import { FileUnreadableError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';

const MAX_FILE_SIZE_KB = parseInt(process.env.MAX_FILE_SIZE_KB || '500', 10);

// Language detection by extension
const LANGUAGE_MAP: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.py': 'python',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.rb': 'ruby',
  '.php': 'php',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.cs': 'csharp',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.scala': 'scala',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.md': 'markdown',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sql': 'sql',
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
};

export class ReadFileTool implements Tool<ReadFileArgs, ReadFileOutput> {
  readonly name = 'read_file';

  private rootDirectory: string;

  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
  }

  definition(): ToolDefinition {
    return {
      name: this.name,
      description:
        'Read the contents of a file. Optionally specify line range for large files.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the file (relative to codebase root)',
          },
          startLine: {
            type: 'number',
            description: 'Starting line number (1-indexed, optional)',
          },
          endLine: {
            type: 'number',
            description: 'Ending line number (1-indexed, inclusive, optional)',
          },
        },
        required: ['path'],
      },
    };
  }

  async call(args: ReadFileArgs): Promise<ReadFileOutput> {
    // Resolve path relative to root
    const targetPath = path.isAbsolute(args.path)
      ? args.path
      : path.join(this.rootDirectory, args.path);

    // Validate path is within allowed root
    const validatedPath = validatePath(targetPath, this.rootDirectory);

    logger.debug('Reading file', {
      path: validatedPath,
      startLine: args.startLine,
      endLine: args.endLine,
    });

    // Check file exists and is readable
    if (!fs.existsSync(validatedPath)) {
      throw new FileUnreadableError(args.path, 'File does not exist');
    }

    const stat = fs.statSync(validatedPath);
    if (!stat.isFile()) {
      throw new FileUnreadableError(args.path, 'Not a file');
    }

    // Check file size
    const fileSizeKB = stat.size / 1024;
    if (fileSizeKB > MAX_FILE_SIZE_KB) {
      throw new FileUnreadableError(
        args.path,
        `File too large (${fileSizeKB.toFixed(1)}KB > ${MAX_FILE_SIZE_KB}KB limit)`
      );
    }

    // Read file content
    let content: string;
    try {
      content = fs.readFileSync(validatedPath, 'utf-8');
    } catch (err) {
      throw new FileUnreadableError(args.path, `Read error: ${String(err)}`);
    }

    const lines = content.split('\n');
    const totalLines = lines.length;

    // Detect language
    const ext = path.extname(validatedPath).toLowerCase();
    const language = LANGUAGE_MAP[ext] || 'plaintext';

    // Handle line range
    let truncated = false;
    if (args.startLine !== undefined || args.endLine !== undefined) {
      const start = Math.max(1, args.startLine ?? 1) - 1; // Convert to 0-indexed
      const end =
        args.endLine !== undefined
          ? Math.min(args.endLine, totalLines)
          : totalLines;

      const selectedLines = lines.slice(start, end);
      content = selectedLines
        .map((line, idx) => `${start + idx + 1}: ${line}`)
        .join('\n');
      truncated = start > 0 || end < totalLines;
    } else {
      // Add line numbers
      content = lines.map((line, idx) => `${idx + 1}: ${line}`).join('\n');
    }

    logger.info('File read', {
      path: args.path,
      totalLines,
      language,
      truncated,
    });

    return { content, totalLines, language, truncated };
  }
}
