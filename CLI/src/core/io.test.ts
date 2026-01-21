/**
 * Unit tests for CLI/src/core/io.ts
 * Tests file I/O utilities with proper isolation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  readFile,
  readJson,
  writeFile,
  writeJson,
  fileExists,
  dirExists,
  ensureDir,
  listFiles,
  copyFile,
  readDirRecursive,
  getModTime,
  appendFile,
  deleteFile,
} from './io.js';

describe('io module', () => {
  let testDir: string;

  beforeEach(() => {
    // Create a unique temp directory for each test
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'io-test-'));
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('readFile', () => {
    it('should read file contents as string', () => {
      const testPath = path.join(testDir, 'test.txt');
      fs.writeFileSync(testPath, 'hello world', 'utf-8');

      const content = readFile(testPath);
      expect(content).toBe('hello world');
    });

    it('should throw error for non-existent file', () => {
      const testPath = path.join(testDir, 'nonexistent.txt');
      expect(() => readFile(testPath)).toThrow();
    });

    it('should handle UTF-8 characters correctly', () => {
      const testPath = path.join(testDir, 'unicode.txt');
      const unicodeContent = 'Hello, world! And some special chars too.';
      fs.writeFileSync(testPath, unicodeContent, 'utf-8');

      const content = readFile(testPath);
      expect(content).toBe(unicodeContent);
    });
  });

  describe('readJson', () => {
    it('should parse JSON file correctly', () => {
      const testPath = path.join(testDir, 'test.json');
      const data = { name: 'test', value: 42, nested: { key: 'value' } };
      fs.writeFileSync(testPath, JSON.stringify(data), 'utf-8');

      const result = readJson(testPath) as typeof data;
      expect(result).toEqual(data);
    });

    it('should throw error for invalid JSON', () => {
      const testPath = path.join(testDir, 'invalid.json');
      fs.writeFileSync(testPath, 'not valid json {', 'utf-8');

      expect(() => readJson(testPath)).toThrow();
    });

    it('should handle arrays', () => {
      const testPath = path.join(testDir, 'array.json');
      const data = [1, 2, 3, { key: 'value' }];
      fs.writeFileSync(testPath, JSON.stringify(data), 'utf-8');

      const result = readJson(testPath) as typeof data;
      expect(result).toEqual(data);
    });
  });

  describe('writeFile', () => {
    it('should write content to file', () => {
      const testPath = path.join(testDir, 'output.txt');
      writeFile(testPath, 'written content');

      expect(fs.existsSync(testPath)).toBe(true);
      expect(fs.readFileSync(testPath, 'utf-8')).toBe('written content');
    });

    it('should create parent directories if needed', () => {
      const testPath = path.join(testDir, 'nested', 'deep', 'file.txt');
      writeFile(testPath, 'nested content');

      expect(fs.existsSync(testPath)).toBe(true);
      expect(fs.readFileSync(testPath, 'utf-8')).toBe('nested content');
    });

    it('should overwrite existing file', () => {
      const testPath = path.join(testDir, 'existing.txt');
      fs.writeFileSync(testPath, 'original', 'utf-8');

      writeFile(testPath, 'updated');
      expect(fs.readFileSync(testPath, 'utf-8')).toBe('updated');
    });
  });

  describe('writeJson', () => {
    it('should write JSON with pretty formatting', () => {
      const testPath = path.join(testDir, 'output.json');
      const data = { name: 'test', value: 42 };

      writeJson(testPath, data);

      const content = fs.readFileSync(testPath, 'utf-8');
      expect(content).toBe(JSON.stringify(data, null, 2));
    });

    it('should handle nested objects', () => {
      const testPath = path.join(testDir, 'nested.json');
      const data = { level1: { level2: { level3: 'deep' } } };

      writeJson(testPath, data);

      const result = JSON.parse(fs.readFileSync(testPath, 'utf-8'));
      expect(result).toEqual(data);
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', () => {
      const testPath = path.join(testDir, 'exists.txt');
      fs.writeFileSync(testPath, 'content', 'utf-8');

      expect(fileExists(testPath)).toBe(true);
    });

    it('should return false for non-existent file', () => {
      const testPath = path.join(testDir, 'nonexistent.txt');
      expect(fileExists(testPath)).toBe(false);
    });

    it('should return true for directories', () => {
      expect(fileExists(testDir)).toBe(true);
    });
  });

  describe('dirExists', () => {
    it('should return true for existing directory', () => {
      expect(dirExists(testDir)).toBe(true);
    });

    it('should return false for non-existent directory', () => {
      const testPath = path.join(testDir, 'nonexistent');
      expect(dirExists(testPath)).toBe(false);
    });

    it('should return false for files', () => {
      const testPath = path.join(testDir, 'file.txt');
      fs.writeFileSync(testPath, 'content', 'utf-8');

      expect(dirExists(testPath)).toBe(false);
    });
  });

  describe('ensureDir', () => {
    it('should create directory if it does not exist', () => {
      const dirPath = path.join(testDir, 'new-dir');
      ensureDir(dirPath);

      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });

    it('should create nested directories', () => {
      const dirPath = path.join(testDir, 'a', 'b', 'c');
      ensureDir(dirPath);

      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should not fail if directory already exists', () => {
      const dirPath = path.join(testDir, 'existing');
      fs.mkdirSync(dirPath);

      expect(() => ensureDir(dirPath)).not.toThrow();
    });
  });

  describe('listFiles', () => {
    it('should list all files in directory', () => {
      fs.writeFileSync(path.join(testDir, 'a.txt'), '', 'utf-8');
      fs.writeFileSync(path.join(testDir, 'b.txt'), '', 'utf-8');
      fs.writeFileSync(path.join(testDir, 'c.json'), '', 'utf-8');

      const files = listFiles(testDir);
      expect(files).toContain('a.txt');
      expect(files).toContain('b.txt');
      expect(files).toContain('c.json');
    });

    it('should filter by pattern', () => {
      fs.writeFileSync(path.join(testDir, 'a.txt'), '', 'utf-8');
      fs.writeFileSync(path.join(testDir, 'b.txt'), '', 'utf-8');
      fs.writeFileSync(path.join(testDir, 'c.json'), '', 'utf-8');

      const files = listFiles(testDir, /\.txt$/);
      expect(files).toContain('a.txt');
      expect(files).toContain('b.txt');
      expect(files).not.toContain('c.json');
    });

    it('should return empty array for non-existent directory', () => {
      const files = listFiles(path.join(testDir, 'nonexistent'));
      expect(files).toEqual([]);
    });
  });

  describe('copyFile', () => {
    it('should copy file to destination', () => {
      const srcPath = path.join(testDir, 'source.txt');
      const destPath = path.join(testDir, 'dest.txt');
      fs.writeFileSync(srcPath, 'content to copy', 'utf-8');

      copyFile(srcPath, destPath);

      expect(fs.existsSync(destPath)).toBe(true);
      expect(fs.readFileSync(destPath, 'utf-8')).toBe('content to copy');
    });

    it('should create destination directory if needed', () => {
      const srcPath = path.join(testDir, 'source.txt');
      const destPath = path.join(testDir, 'nested', 'dest.txt');
      fs.writeFileSync(srcPath, 'content', 'utf-8');

      copyFile(srcPath, destPath);

      expect(fs.existsSync(destPath)).toBe(true);
    });
  });

  describe('readDirRecursive', () => {
    it('should read all files recursively', () => {
      // Create nested structure
      fs.writeFileSync(path.join(testDir, 'root.txt'), '', 'utf-8');
      fs.mkdirSync(path.join(testDir, 'subdir'));
      fs.writeFileSync(path.join(testDir, 'subdir', 'nested.txt'), '', 'utf-8');
      fs.mkdirSync(path.join(testDir, 'subdir', 'deeper'));
      fs.writeFileSync(
        path.join(testDir, 'subdir', 'deeper', 'deep.txt'),
        '',
        'utf-8'
      );

      const files = readDirRecursive(testDir);

      expect(files.length).toBe(3);
      expect(files.some((f) => f.endsWith('root.txt'))).toBe(true);
      expect(files.some((f) => f.endsWith('nested.txt'))).toBe(true);
      expect(files.some((f) => f.endsWith('deep.txt'))).toBe(true);
    });

    it('should return empty array for non-existent directory', () => {
      const files = readDirRecursive(path.join(testDir, 'nonexistent'));
      expect(files).toEqual([]);
    });

    it('should return full paths', () => {
      fs.writeFileSync(path.join(testDir, 'file.txt'), '', 'utf-8');

      const files = readDirRecursive(testDir);
      expect(files[0]).toBe(path.join(testDir, 'file.txt'));
    });
  });

  describe('getModTime', () => {
    it('should return modification time for existing file', () => {
      const testPath = path.join(testDir, 'test.txt');
      fs.writeFileSync(testPath, 'content', 'utf-8');

      const modTime = getModTime(testPath);

      expect(modTime).toBeInstanceOf(Date);
      expect(modTime!.getTime()).toBeGreaterThan(0);
    });

    it('should return null for non-existent file', () => {
      const testPath = path.join(testDir, 'nonexistent.txt');
      const modTime = getModTime(testPath);

      expect(modTime).toBeNull();
    });
  });

  describe('appendFile', () => {
    it('should append content to existing file', () => {
      const testPath = path.join(testDir, 'append.txt');
      fs.writeFileSync(testPath, 'line1\n', 'utf-8');

      appendFile(testPath, 'line2\n');

      expect(fs.readFileSync(testPath, 'utf-8')).toBe('line1\nline2\n');
    });

    it('should create file if it does not exist', () => {
      const testPath = path.join(testDir, 'new.txt');

      appendFile(testPath, 'content');

      expect(fs.existsSync(testPath)).toBe(true);
      expect(fs.readFileSync(testPath, 'utf-8')).toBe('content');
    });

    it('should create parent directories if needed', () => {
      const testPath = path.join(testDir, 'nested', 'append.txt');

      appendFile(testPath, 'content');

      expect(fs.existsSync(testPath)).toBe(true);
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file and return true', () => {
      const testPath = path.join(testDir, 'to-delete.txt');
      fs.writeFileSync(testPath, 'content', 'utf-8');

      const result = deleteFile(testPath);

      expect(result).toBe(true);
      expect(fs.existsSync(testPath)).toBe(false);
    });

    it('should return false for non-existent file', () => {
      const testPath = path.join(testDir, 'nonexistent.txt');
      const result = deleteFile(testPath);

      expect(result).toBe(false);
    });
  });
});
