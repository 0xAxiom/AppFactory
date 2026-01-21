/**
 * search_code Tool
 * Finds code matching a pattern across files.
 * Follows Rig's Tool trait pattern.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  Tool,
  ToolDefinition,
  SearchCodeArgs,
  SearchCodeOutput,
  SearchMatch,
} from '../types.js';
import { validatePath } from '../../lib/path-validator.js';
import { logger } from '../../lib/logger.js';

const DEFAULT_MAX_RESULTS = 50;

// Default file patterns to search
const DEFAULT_FILE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.py',
  '.go',
  '.rs',
  '.java',
  '.rb',
  '.php',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
];

export class SearchCodeTool implements Tool<SearchCodeArgs, SearchCodeOutput> {
  readonly name = 'search_code';

  private rootDirectory: string;

  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
  }

  definition(): ToolDefinition {
    return {
      name: this.name,
      description:
        'Search for code matching a pattern (regex or literal). Returns matching lines with context.',
      parameters: {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: 'Search pattern (regex supported)',
          },
          directory: {
            type: 'string',
            description:
              'Directory to search in (relative to codebase root, defaults to root)',
          },
          fileGlob: {
            type: 'string',
            description: 'File pattern to filter (e.g., "*.ts", "*.py")',
          },
          maxResults: {
            type: 'number',
            description: 'Maximum number of results to return (default: 50)',
          },
        },
        required: ['pattern'],
      },
    };
  }

  async call(args: SearchCodeArgs): Promise<SearchCodeOutput> {
    const maxResults = args.maxResults ?? DEFAULT_MAX_RESULTS;
    const searchDir = args.directory
      ? path.isAbsolute(args.directory)
        ? args.directory
        : path.join(this.rootDirectory, args.directory)
      : this.rootDirectory;

    // Validate path
    const validatedPath = validatePath(searchDir, this.rootDirectory);

    logger.debug('Searching code', {
      pattern: args.pattern,
      directory: validatedPath,
      fileGlob: args.fileGlob,
    });

    // Build regex
    let regex: RegExp;
    try {
      regex = new RegExp(args.pattern, 'gi');
    } catch (err) {
      // If invalid regex, treat as literal
      regex = new RegExp(
        args.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi'
      );
    }

    // Parse file glob to extension filter
    const extFilter = args.fileGlob
      ? this.parseGlobToExtensions(args.fileGlob)
      : DEFAULT_FILE_EXTENSIONS;

    const matches: SearchMatch[] = [];
    let totalMatches = 0;
    let truncated = false;

    const searchFile = (filePath: string): void => {
      if (matches.length >= maxResults) {
        truncated = true;
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      if (!extFilter.includes(ext)) return;

      let content: string;
      try {
        const stat = fs.statSync(filePath);
        // Skip large files
        if (stat.size > 500 * 1024) return;
        content = fs.readFileSync(filePath, 'utf-8');
      } catch {
        return;
      }

      const lines = content.split('\n');
      const relativePath = path.relative(this.rootDirectory, filePath);

      for (let i = 0; i < lines.length && matches.length < maxResults; i++) {
        const line = lines[i];
        regex.lastIndex = 0; // Reset regex state

        if (regex.test(line)) {
          totalMatches++;
          matches.push({
            file: relativePath,
            line: i + 1,
            content: line.trim(),
            context: {
              before: i > 0 ? lines[i - 1].trim() : '',
              after: i < lines.length - 1 ? lines[i + 1].trim() : '',
            },
          });
        }
      }
    };

    const searchDirectory = (dirPath: string): void => {
      if (matches.length >= maxResults) return;

      let items: string[];
      try {
        items = fs.readdirSync(dirPath);
      } catch {
        return;
      }

      for (const item of items) {
        if (matches.length >= maxResults) break;

        // Skip hidden and non-essential directories
        if (
          item.startsWith('.') ||
          [
            'node_modules',
            'dist',
            'build',
            '__pycache__',
            '.next',
            'coverage',
          ].includes(item)
        ) {
          continue;
        }

        const itemPath = path.join(dirPath, item);

        try {
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            searchDirectory(itemPath);
          } else if (stat.isFile()) {
            searchFile(itemPath);
          }
        } catch {
          continue;
        }
      }
    };

    searchDirectory(validatedPath);

    logger.info('Search completed', {
      pattern: args.pattern,
      matchesFound: matches.length,
      totalMatches,
      truncated,
    });

    return { matches, totalMatches, truncated };
  }

  private parseGlobToExtensions(glob: string): string[] {
    // Simple glob to extension conversion
    // e.g., "*.ts" -> [".ts"], "*.{ts,tsx}" -> [".ts", ".tsx"]

    const match = glob.match(/\*\.(?:\{([^}]+)\}|(\w+))/);
    if (!match) return DEFAULT_FILE_EXTENSIONS;

    if (match[1]) {
      // Handle {ts,tsx} pattern
      return match[1].split(',').map((ext) => `.${ext.trim()}`);
    } else if (match[2]) {
      // Handle single extension
      return [`.${match[2]}`];
    }

    return DEFAULT_FILE_EXTENSIONS;
  }
}
