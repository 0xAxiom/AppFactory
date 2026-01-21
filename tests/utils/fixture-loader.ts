/**
 * Fixture Loader Utilities
 *
 * Load test fixtures from the fixtures directory for consistent test data.
 * Supports JSON, Markdown, TypeScript config files, and directory structures.
 *
 * @module tests/utils
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the fixtures directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures');

/**
 * Fixture types supported by the loader
 */
export type FixtureType = 'json' | 'markdown' | 'text' | 'directory';

/**
 * Fixture metadata
 */
export interface FixtureInfo {
  /** Fixture name */
  name: string;
  /** Full path to fixture */
  path: string;
  /** Fixture type */
  type: FixtureType;
  /** Size in bytes */
  size: number;
}

/**
 * Directory fixture structure
 */
export interface DirectoryFixture {
  /** Directory path */
  path: string;
  /** Files in the directory */
  files: string[];
  /** Subdirectories */
  subdirs: string[];
}

/**
 * Load a JSON fixture file
 *
 * @param fixtureName - Name of the fixture file (with or without .json extension)
 * @returns Parsed JSON content
 */
export function loadJsonFixture<T = unknown>(fixtureName: string): T {
  const filename = fixtureName.endsWith('.json')
    ? fixtureName
    : `${fixtureName}.json`;
  const fixturePath = path.join(FIXTURES_DIR, filename);

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture not found: ${fixturePath}`);
  }

  const content = fs.readFileSync(fixturePath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * Load a JSON fixture file safely (returns null if not found)
 *
 * @param fixtureName - Name of the fixture file
 * @returns Parsed JSON content or null
 */
export function loadJsonFixtureSafe<T = unknown>(
  fixtureName: string
): T | null {
  try {
    return loadJsonFixture<T>(fixtureName);
  } catch {
    return null;
  }
}

/**
 * Load a markdown fixture file
 *
 * @param fixtureName - Name of the fixture file (with or without .md extension)
 * @returns Markdown content as string
 */
export function loadMarkdownFixture(fixtureName: string): string {
  const filename = fixtureName.endsWith('.md')
    ? fixtureName
    : `${fixtureName}.md`;
  const fixturePath = path.join(FIXTURES_DIR, filename);

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture not found: ${fixturePath}`);
  }

  return fs.readFileSync(fixturePath, 'utf-8');
}

/**
 * Load a text fixture file
 *
 * @param fixtureName - Name of the fixture file
 * @returns File content as string
 */
export function loadTextFixture(fixtureName: string): string {
  const fixturePath = path.join(FIXTURES_DIR, fixtureName);

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture not found: ${fixturePath}`);
  }

  return fs.readFileSync(fixturePath, 'utf-8');
}

/**
 * Load a directory fixture (creates temp directory with fixture contents)
 *
 * @param fixtureName - Name of the fixture directory
 * @returns Path to the temporary directory
 */
export function loadDirectoryFixture(fixtureName: string): DirectoryFixture {
  const fixturePath = path.join(FIXTURES_DIR, fixtureName);

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture directory not found: ${fixturePath}`);
  }

  const stat = fs.statSync(fixturePath);
  if (!stat.isDirectory()) {
    throw new Error(`Fixture is not a directory: ${fixturePath}`);
  }

  const entries = fs.readdirSync(fixturePath, { withFileTypes: true });
  const files: string[] = [];
  const subdirs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      subdirs.push(entry.name);
    } else {
      files.push(entry.name);
    }
  }

  return {
    path: fixturePath,
    files,
    subdirs,
  };
}

/**
 * Get information about a fixture
 *
 * @param fixtureName - Name of the fixture
 * @returns Fixture metadata
 */
export function getFixtureInfo(fixtureName: string): FixtureInfo | null {
  const fixturePath = path.join(FIXTURES_DIR, fixtureName);

  if (!fs.existsSync(fixturePath)) {
    return null;
  }

  const stat = fs.statSync(fixturePath);
  let type: FixtureType = 'text';

  if (stat.isDirectory()) {
    type = 'directory';
  } else if (fixtureName.endsWith('.json')) {
    type = 'json';
  } else if (fixtureName.endsWith('.md')) {
    type = 'markdown';
  }

  return {
    name: fixtureName,
    path: fixturePath,
    type,
    size: stat.size,
  };
}

/**
 * List all available fixtures
 *
 * @param type - Optional filter by fixture type
 * @returns Array of fixture names
 */
export function listFixtures(type?: FixtureType): string[] {
  if (!fs.existsSync(FIXTURES_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(FIXTURES_DIR, { withFileTypes: true });
  const fixtures: string[] = [];

  for (const entry of entries) {
    if (type === 'directory' && entry.isDirectory()) {
      fixtures.push(entry.name);
    } else if (type === 'json' && entry.name.endsWith('.json')) {
      fixtures.push(entry.name);
    } else if (type === 'markdown' && entry.name.endsWith('.md')) {
      fixtures.push(entry.name);
    } else if (!type) {
      fixtures.push(entry.name);
    }
  }

  return fixtures;
}

/**
 * Create a temporary fixture directory for testing
 *
 * @param structure - Object describing the directory structure
 * @returns Path to the created directory
 */
export function createTempFixture(
  structure: Record<string, string | Record<string, string>>
): string {
  const tmpDir = fs.mkdtempSync(
    path.join(fs.realpathSync(os.tmpdir()), 'appfactory-test-')
  );

  for (const [name, content] of Object.entries(structure)) {
    const itemPath = path.join(tmpDir, name);

    if (typeof content === 'string') {
      // It's a file
      fs.mkdirSync(path.dirname(itemPath), { recursive: true });
      fs.writeFileSync(itemPath, content);
    } else {
      // It's a directory
      fs.mkdirSync(itemPath, { recursive: true });
      for (const [fileName, fileContent] of Object.entries(content)) {
        fs.writeFileSync(path.join(itemPath, fileName), fileContent);
      }
    }
  }

  return tmpDir;
}

/**
 * Clean up a temporary fixture directory
 *
 * @param tmpDir - Path to the temporary directory
 */
export function cleanupTempFixture(tmpDir: string): void {
  if (fs.existsSync(tmpDir) && tmpDir.includes('appfactory-test-')) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/**
 * Get the fixtures directory path
 *
 * @returns Path to the fixtures directory
 */
export function getFixturesDir(): string {
  return FIXTURES_DIR;
}
