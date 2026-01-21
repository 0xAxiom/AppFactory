/**
 * list_directory Tool
 * Discovers project structure by listing files and directories.
 * Follows Rig's Tool trait pattern.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  Tool,
  ToolDefinition,
  ListDirectoryArgs,
  ListDirectoryOutput,
  DirectoryEntry,
} from '../types.js';
import { validatePath } from '../../lib/path-validator.js';
import { FileUnreadableError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';

export class ListDirectoryTool implements Tool<
  ListDirectoryArgs,
  ListDirectoryOutput
> {
  readonly name = 'list_directory';

  private rootDirectory: string;

  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
  }

  definition(): ToolDefinition {
    return {
      name: this.name,
      description:
        'List files and directories in a given path. Use this to discover project structure.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to list (relative to codebase root)',
          },
          maxDepth: {
            type: 'number',
            description: 'Maximum directory depth to traverse (default: 3)',
          },
          includeHidden: {
            type: 'boolean',
            description:
              'Include hidden files/directories starting with . (default: false)',
          },
        },
        required: ['path'],
      },
    };
  }

  async call(args: ListDirectoryArgs): Promise<ListDirectoryOutput> {
    const maxDepth = args.maxDepth ?? 3;
    const includeHidden = args.includeHidden ?? false;

    // Resolve path relative to root
    const targetPath = path.isAbsolute(args.path)
      ? args.path
      : path.join(this.rootDirectory, args.path);

    // Validate path is within allowed root
    const validatedPath = validatePath(targetPath, this.rootDirectory);

    logger.debug('Listing directory', {
      path: validatedPath,
      maxDepth,
      includeHidden,
    });

    const entries: DirectoryEntry[] = [];
    let totalFiles = 0;
    let totalDirectories = 0;

    const traverse = (currentPath: string, depth: number): void => {
      if (depth > maxDepth) return;

      let items: string[];
      try {
        items = fs.readdirSync(currentPath);
      } catch (err) {
        logger.warn('Failed to read directory', {
          path: currentPath,
          error: String(err),
        });
        return;
      }

      for (const item of items) {
        // Skip hidden files unless requested
        if (!includeHidden && item.startsWith('.')) continue;

        // Skip common non-essential directories
        if (
          [
            'node_modules',
            '.git',
            'dist',
            'build',
            '__pycache__',
            '.next',
          ].includes(item)
        )
          continue;

        const itemPath = path.join(currentPath, item);
        const relativePath = path.relative(this.rootDirectory, itemPath);

        try {
          const stat = fs.statSync(itemPath);

          if (stat.isDirectory()) {
            entries.push({ path: relativePath, type: 'directory' });
            totalDirectories++;
            traverse(itemPath, depth + 1);
          } else if (stat.isFile()) {
            entries.push({ path: relativePath, type: 'file', size: stat.size });
            totalFiles++;
          }
        } catch (err) {
          logger.warn('Failed to stat item', {
            path: itemPath,
            error: String(err),
          });
        }
      }
    };

    traverse(validatedPath, 0);

    // Sort entries: directories first, then by path
    entries.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.path.localeCompare(b.path);
    });

    logger.info('Directory listed', {
      totalFiles,
      totalDirectories,
      entriesReturned: entries.length,
    });

    return { entries, totalFiles, totalDirectories };
  }
}
