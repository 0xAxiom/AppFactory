/**
 * analyze_imports Tool
 * Traces import/export relationships in source files.
 * Follows Rig's Tool trait pattern.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Tool, ToolDefinition, AnalyzeImportsArgs, AnalyzeImportsOutput, ImportInfo, ExportInfo } from '../types.js';
import { validatePath } from '../../lib/path-validator.js';
import { FileUnreadableError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';

export class AnalyzeImportsTool implements Tool<AnalyzeImportsArgs, AnalyzeImportsOutput> {
  readonly name = 'analyze_imports';

  private rootDirectory: string;

  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
  }

  definition(): ToolDefinition {
    return {
      name: this.name,
      description: 'Analyze import and export statements in a source file to trace dependencies.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'Path to the file to analyze (relative to codebase root)',
          },
          direction: {
            type: 'string',
            enum: ['imports', 'exports', 'both'],
            description: 'What to analyze: imports, exports, or both (default: both)',
          },
        },
        required: ['file'],
      },
    };
  }

  async call(args: AnalyzeImportsArgs): Promise<AnalyzeImportsOutput> {
    const direction = args.direction ?? 'both';

    // Resolve path relative to root
    const targetPath = path.isAbsolute(args.file)
      ? args.file
      : path.join(this.rootDirectory, args.file);

    // Validate path
    const validatedPath = validatePath(targetPath, this.rootDirectory);

    logger.debug('Analyzing imports', { file: validatedPath, direction });

    // Check file exists
    if (!fs.existsSync(validatedPath)) {
      throw new FileUnreadableError(args.file, 'File does not exist');
    }

    // Read file
    let content: string;
    try {
      content = fs.readFileSync(validatedPath, 'utf-8');
    } catch (err) {
      throw new FileUnreadableError(args.file, `Read error: ${String(err)}`);
    }

    const ext = path.extname(validatedPath).toLowerCase();
    const imports: ImportInfo[] = [];
    const exports: ExportInfo[] = [];

    // Detect language and parse accordingly
    if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(ext)) {
      this.parseJavaScriptImports(content, imports, exports, direction);
    } else if (ext === '.py') {
      this.parsePythonImports(content, imports, exports, direction);
    } else if (ext === '.go') {
      this.parseGoImports(content, imports, exports, direction);
    } else if (ext === '.rs') {
      this.parseRustImports(content, imports, exports, direction);
    }

    logger.info('Imports analyzed', {
      file: args.file,
      importsFound: imports.length,
      exportsFound: exports.length,
    });

    return { imports, exports };
  }

  private parseJavaScriptImports(
    content: string,
    imports: ImportInfo[],
    exports: ExportInfo[],
    direction: string
  ): void {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse imports
      if (direction === 'imports' || direction === 'both') {
        // import { a, b } from 'module'
        const namedImportMatch = trimmed.match(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/);
        if (namedImportMatch) {
          const items = namedImportMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
          imports.push({ from: namedImportMatch[2], items });
          continue;
        }

        // import * as name from 'module'
        const namespaceImportMatch = trimmed.match(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
        if (namespaceImportMatch) {
          imports.push({ from: namespaceImportMatch[2], items: [`* as ${namespaceImportMatch[1]}`] });
          continue;
        }

        // import name from 'module'
        const defaultImportMatch = trimmed.match(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
        if (defaultImportMatch) {
          imports.push({ from: defaultImportMatch[2], items: [defaultImportMatch[1]] });
          continue;
        }

        // import 'module' (side effect)
        const sideEffectMatch = trimmed.match(/^import\s+['"]([^'"]+)['"]/);
        if (sideEffectMatch) {
          imports.push({ from: sideEffectMatch[1], items: [] });
          continue;
        }

        // require('module')
        const requireMatch = trimmed.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
        if (requireMatch) {
          imports.push({ from: requireMatch[1], items: ['(CommonJS)'] });
        }
      }

      // Parse exports
      if (direction === 'exports' || direction === 'both') {
        // export default
        if (trimmed.startsWith('export default')) {
          const funcMatch = trimmed.match(/export\s+default\s+(function|class)\s+(\w+)?/);
          if (funcMatch) {
            exports.push({ name: funcMatch[2] || 'default', type: 'default' });
          } else {
            exports.push({ name: 'default', type: 'default' });
          }
          continue;
        }

        // export const/let/var
        const constMatch = trimmed.match(/^export\s+(const|let|var)\s+(\w+)/);
        if (constMatch) {
          exports.push({ name: constMatch[2], type: 'const' });
          continue;
        }

        // export function
        const funcMatch = trimmed.match(/^export\s+(async\s+)?function\s+(\w+)/);
        if (funcMatch) {
          exports.push({ name: funcMatch[2], type: 'function' });
          continue;
        }

        // export class
        const classMatch = trimmed.match(/^export\s+class\s+(\w+)/);
        if (classMatch) {
          exports.push({ name: classMatch[1], type: 'class' });
          continue;
        }

        // export interface/type
        const typeMatch = trimmed.match(/^export\s+(interface|type)\s+(\w+)/);
        if (typeMatch) {
          exports.push({ name: typeMatch[2], type: typeMatch[1] as 'type' | 'interface' });
          continue;
        }

        // export { a, b }
        const namedExportMatch = trimmed.match(/^export\s+\{([^}]+)\}/);
        if (namedExportMatch) {
          const items = namedExportMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
          for (const item of items) {
            exports.push({ name: item, type: 'const' });
          }
        }
      }
    }
  }

  private parsePythonImports(
    content: string,
    imports: ImportInfo[],
    exports: ExportInfo[],
    direction: string
  ): void {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      if (direction === 'imports' || direction === 'both') {
        // from module import a, b
        const fromImportMatch = trimmed.match(/^from\s+(\S+)\s+import\s+(.+)/);
        if (fromImportMatch) {
          const items = fromImportMatch[2].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
          imports.push({ from: fromImportMatch[1], items });
          continue;
        }

        // import module
        const importMatch = trimmed.match(/^import\s+(\S+)/);
        if (importMatch) {
          imports.push({ from: importMatch[1], items: [] });
        }
      }

      if (direction === 'exports' || direction === 'both') {
        // def function_name
        const defMatch = trimmed.match(/^def\s+(\w+)\s*\(/);
        if (defMatch && !defMatch[1].startsWith('_')) {
          exports.push({ name: defMatch[1], type: 'function' });
          continue;
        }

        // class ClassName
        const classMatch = trimmed.match(/^class\s+(\w+)/);
        if (classMatch && !classMatch[1].startsWith('_')) {
          exports.push({ name: classMatch[1], type: 'class' });
        }
      }
    }
  }

  private parseGoImports(
    content: string,
    imports: ImportInfo[],
    exports: ExportInfo[],
    direction: string
  ): void {
    if (direction === 'imports' || direction === 'both') {
      // Single import
      const singleMatch = content.match(/import\s+"([^"]+)"/g);
      if (singleMatch) {
        for (const m of singleMatch) {
          const pkg = m.match(/"([^"]+)"/)?.[1];
          if (pkg) imports.push({ from: pkg, items: [] });
        }
      }

      // Import block
      const blockMatch = content.match(/import\s*\(([^)]+)\)/s);
      if (blockMatch) {
        const pkgMatches = blockMatch[1].match(/"([^"]+)"/g);
        if (pkgMatches) {
          for (const pkg of pkgMatches) {
            const name = pkg.replace(/"/g, '');
            imports.push({ from: name, items: [] });
          }
        }
      }
    }

    if (direction === 'exports' || direction === 'both') {
      // Exported functions (capitalized)
      const funcMatches = content.match(/^func\s+([A-Z]\w*)\s*\(/gm);
      if (funcMatches) {
        for (const m of funcMatches) {
          const name = m.match(/func\s+(\w+)/)?.[1];
          if (name) exports.push({ name, type: 'function' });
        }
      }

      // Exported types
      const typeMatches = content.match(/^type\s+([A-Z]\w*)\s+/gm);
      if (typeMatches) {
        for (const m of typeMatches) {
          const name = m.match(/type\s+(\w+)/)?.[1];
          if (name) exports.push({ name, type: 'type' });
        }
      }
    }
  }

  private parseRustImports(
    content: string,
    imports: ImportInfo[],
    exports: ExportInfo[],
    direction: string
  ): void {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      if (direction === 'imports' || direction === 'both') {
        // use crate::module::{a, b}
        const useMatch = trimmed.match(/^use\s+([^;]+);/);
        if (useMatch) {
          imports.push({ from: useMatch[1], items: [] });
        }
      }

      if (direction === 'exports' || direction === 'both') {
        // pub fn
        const pubFnMatch = trimmed.match(/^pub\s+(async\s+)?fn\s+(\w+)/);
        if (pubFnMatch) {
          exports.push({ name: pubFnMatch[2], type: 'function' });
          continue;
        }

        // pub struct
        const pubStructMatch = trimmed.match(/^pub\s+struct\s+(\w+)/);
        if (pubStructMatch) {
          exports.push({ name: pubStructMatch[1], type: 'type' });
          continue;
        }

        // pub enum
        const pubEnumMatch = trimmed.match(/^pub\s+enum\s+(\w+)/);
        if (pubEnumMatch) {
          exports.push({ name: pubEnumMatch[1], type: 'type' });
        }
      }
    }
  }
}
