/**
 * Config Parsing Tests
 *
 * Tests for parsing CLAUDE.md and configuration files.
 * Validates that pipeline configurations are correctly extracted and validated.
 *
 * @module tests/unit
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

/**
 * Pipeline configuration extracted from CLAUDE.md
 */
interface ParsedPipelineConfig {
  /** Pipeline name */
  name: string;
  /** Pipeline version */
  version: string;
  /** Pipeline mode */
  mode: string;
  /** Output directory */
  outputDir?: string;
  /** Phases defined */
  phases: string[];
  /** Invariants referenced */
  invariants: string[];
  /** Cross-links to other pipelines */
  crossLinks: string[];
  /** Is valid configuration */
  valid: boolean;
  /** Parsing errors */
  errors: string[];
}

/**
 * Parse a CLAUDE.md file and extract configuration
 */
function parseClaudeMd(content: string): ParsedPipelineConfig {
  const config: ParsedPipelineConfig = {
    name: '',
    version: '',
    mode: '',
    phases: [],
    invariants: [],
    crossLinks: [],
    valid: true,
    errors: [],
  };

  // Extract name from header (full line after #)
  const nameMatch = content.match(/^#\s+(.+)$/m);
  if (nameMatch) {
    config.name = nameMatch[1].trim();
  } else {
    config.errors.push('Missing pipeline name in header');
    config.valid = false;
  }

  // Extract version
  const versionMatch = content.match(/\*\*Version\*\*:\s*([\d.]+)/);
  if (versionMatch) {
    config.version = versionMatch[1];
  } else {
    config.errors.push('Missing version field');
    config.valid = false;
  }

  // Extract mode
  const modeMatch = content.match(/\*\*Mode\*\*:\s*(.+)/);
  if (modeMatch) {
    config.mode = modeMatch[1].trim();
  }

  // Extract output directory from table or text
  const outputDirMatch = content.match(
    /Output\s*(?:Directory|directory).*?[`"]([^`"]+)[`"]/
  );
  if (outputDirMatch) {
    config.outputDir = outputDirMatch[1];
  }

  // Extract phases from numbered headers or list
  const phaseMatches = content.matchAll(
    /(?:PHASE|Phase)\s+(\d+(?:\.\d+)?)[:\s]+([^\n]+)/g
  );
  for (const match of phaseMatches) {
    config.phases.push(`Phase ${match[1]}: ${match[2].trim()}`);
  }

  // Extract invariants (references to INVARIANTS.md or numbered invariants)
  const invariantMatches = content.matchAll(
    /(?:Invariant\s+)?(\d+)\.\s+(?:\*\*)?([^*\n]+)/g
  );
  for (const match of invariantMatches) {
    if (
      match[2].toLowerCase().includes('approval') ||
      match[2].toLowerCase().includes('offline') ||
      match[2].toLowerCase().includes('audit') ||
      match[2].toLowerCase().includes('telemetry') ||
      match[2].toLowerCase().includes('silent')
    ) {
      config.invariants.push(match[2].trim());
    }
  }

  // Extract cross-links to other pipelines
  const crossLinkMatches = content.matchAll(
    /(?:app-factory|dapp-factory|agent-factory|plugin-factory|miniapp-pipeline|website-pipeline)/gi
  );
  const crossLinkSet = new Set<string>();
  for (const match of crossLinkMatches) {
    crossLinkSet.add(match[0].toLowerCase());
  }
  config.crossLinks = Array.from(crossLinkSet);

  return config;
}

/**
 * Validate that a parsed config meets minimum requirements
 */
function validatePipelineConfig(config: ParsedPipelineConfig): string[] {
  const errors: string[] = [];

  if (!config.name) {
    errors.push('Pipeline name is required');
  }

  if (!config.version || !/^\d+\.\d+(\.\d+)?$/.test(config.version)) {
    errors.push('Valid semantic version is required (e.g., 1.0.0)');
  }

  if (config.phases.length === 0) {
    errors.push('At least one phase must be defined');
  }

  return errors;
}

describe('CLAUDE.md Parsing', () => {
  describe('Header Extraction', () => {
    it('should extract pipeline name from header', () => {
      const content = `# App Factory - Mobile Pipeline

**Version**: 1.0.0
**Mode**: Full Build
`;
      const config = parseClaudeMd(content);
      expect(config.name).toBe('App Factory - Mobile Pipeline');
    });

    it('should handle simple header without subtitle', () => {
      const content = `# dApp Factory

**Version**: 9.0.0
`;
      const config = parseClaudeMd(content);
      expect(config.name).toBe('dApp Factory');
    });

    it('should fail when header is missing', () => {
      const content = `**Version**: 1.0.0`;
      const config = parseClaudeMd(content);
      expect(config.valid).toBe(false);
      expect(config.errors).toContain('Missing pipeline name in header');
    });
  });

  describe('Version Extraction', () => {
    it('should extract version from Version field', () => {
      const content = `# Test Pipeline

**Version**: 2.5.1
`;
      const config = parseClaudeMd(content);
      expect(config.version).toBe('2.5.1');
    });

    it('should handle major.minor version format', () => {
      const content = `# Test Pipeline

**Version**: 9.0
`;
      const config = parseClaudeMd(content);
      expect(config.version).toBe('9.0');
    });

    it('should fail when version is missing', () => {
      const content = `# Test Pipeline

**Mode**: Full Build
`;
      const config = parseClaudeMd(content);
      expect(config.valid).toBe(false);
      expect(config.errors).toContain('Missing version field');
    });
  });

  describe('Mode Extraction', () => {
    it('should extract mode from Mode field', () => {
      const content = `# Test Pipeline

**Version**: 1.0.0
**Mode**: Full Build Factory
`;
      const config = parseClaudeMd(content);
      expect(config.mode).toBe('Full Build Factory');
    });

    it('should handle complex mode descriptions', () => {
      const content = `# Test Pipeline

**Version**: 1.0.0
**Mode**: Full Build Factory with Agent Decision Gate
`;
      const config = parseClaudeMd(content);
      expect(config.mode).toBe('Full Build Factory with Agent Decision Gate');
    });
  });

  describe('Phase Extraction', () => {
    it('should extract phases from content', () => {
      const content = `# Test Pipeline

**Version**: 1.0.0

## PHASE 0: INTENT NORMALIZATION

Details about phase 0...

## PHASE 1: DREAM SPEC AUTHOR

Details about phase 1...

## PHASE 2: RESEARCH

Details about phase 2...
`;
      const config = parseClaudeMd(content);
      expect(config.phases.length).toBe(3);
      expect(config.phases).toContain('Phase 0: INTENT NORMALIZATION');
      expect(config.phases).toContain('Phase 1: DREAM SPEC AUTHOR');
    });

    it('should handle decimal phase numbers', () => {
      const content = `# Test

**Version**: 1.0.0

### PHASE 0.5: AGENT DECISION GATE

Details...
`;
      const config = parseClaudeMd(content);
      expect(config.phases.some((p) => p.includes('0.5'))).toBe(true);
    });
  });

  describe('Cross-Link Extraction', () => {
    it('should extract references to other pipelines', () => {
      const content = `# Test Pipeline

**Version**: 1.0.0

For mobile apps, use app-factory.
For dApps, use dapp-factory.
For agents, use agent-factory.
`;
      const config = parseClaudeMd(content);
      expect(config.crossLinks).toContain('app-factory');
      expect(config.crossLinks).toContain('dapp-factory');
      expect(config.crossLinks).toContain('agent-factory');
    });

    it('should deduplicate cross-links', () => {
      const content = `# Test

**Version**: 1.0.0

Use app-factory here and also app-factory there.
`;
      const config = parseClaudeMd(content);
      expect(config.crossLinks.filter((l) => l === 'app-factory').length).toBe(
        1
      );
    });

    it('should be case-insensitive for pipeline names', () => {
      const content = `# Test

**Version**: 1.0.0

Use App-Factory or APP-FACTORY.
`;
      const config = parseClaudeMd(content);
      expect(config.crossLinks.length).toBe(1);
    });
  });
});

describe('Pipeline Config Validation', () => {
  it('should pass valid configuration', () => {
    const config: ParsedPipelineConfig = {
      name: 'Test Pipeline',
      version: '1.0.0',
      mode: 'Full Build',
      phases: ['Phase 0: Init', 'Phase 1: Build'],
      invariants: [],
      crossLinks: [],
      valid: true,
      errors: [],
    };

    const errors = validatePipelineConfig(config);
    expect(errors).toEqual([]);
  });

  it('should fail when name is missing', () => {
    const config: ParsedPipelineConfig = {
      name: '',
      version: '1.0.0',
      mode: 'Full Build',
      phases: ['Phase 0: Init'],
      invariants: [],
      crossLinks: [],
      valid: true,
      errors: [],
    };

    const errors = validatePipelineConfig(config);
    expect(errors).toContain('Pipeline name is required');
  });

  it('should fail when version is invalid', () => {
    const config: ParsedPipelineConfig = {
      name: 'Test',
      version: 'invalid',
      mode: 'Full Build',
      phases: ['Phase 0: Init'],
      invariants: [],
      crossLinks: [],
      valid: true,
      errors: [],
    };

    const errors = validatePipelineConfig(config);
    expect(errors.some((e) => e.includes('semantic version'))).toBe(true);
  });

  it('should fail when no phases defined', () => {
    const config: ParsedPipelineConfig = {
      name: 'Test',
      version: '1.0.0',
      mode: 'Full Build',
      phases: [],
      invariants: [],
      crossLinks: [],
      valid: true,
      errors: [],
    };

    const errors = validatePipelineConfig(config);
    expect(errors).toContain('At least one phase must be defined');
  });
});

describe('Real CLAUDE.md Parsing', () => {
  it('should parse the dapp-factory format correctly', () => {
    const content = `# dApp Factory (dapp-factory)

**Version**: 9.0.0
**Mode**: Full Build Factory with Agent Decision Gate
**Status**: MANDATORY CONSTITUTION

---

## 1. PURPOSE & SCOPE

### What This Pipeline Does

dApp Factory generates **complete, production-ready decentralized applications**.

### PHASE 0: INTENT NORMALIZATION (MANDATORY)

Before planning...

### PHASE 0.5: AGENT DECISION GATE (MANDATORY)

Before building...

### PHASE 1: DREAM SPEC AUTHOR

Required spec sections...

### PHASE 2: RESEARCH & POSITIONING

Required research...

### PHASE 3: BUILD

Write complete application...

### PHASE 4: RALPH POLISH LOOP (MANDATORY)

After building...

## Related Pipelines

| Pipeline | When to Use |
|----------|-------------|
| app-factory | Mobile apps |
| agent-factory | AI agent scaffolds only |
| plugin-factory | Claude plugins/MCP servers |
`;

    const config = parseClaudeMd(content);

    expect(config.name).toBe('dApp Factory (dapp-factory)');
    expect(config.version).toBe('9.0.0');
    expect(config.mode).toBe('Full Build Factory with Agent Decision Gate');
    expect(config.phases.length).toBeGreaterThanOrEqual(4);
    expect(config.crossLinks).toContain('app-factory');
    expect(config.crossLinks).toContain('agent-factory');
    expect(config.crossLinks).toContain('plugin-factory');
  });
});

describe('Config File Loading', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should load and parse JSON config', () => {
    const configContent = {
      pipeline: 'test',
      version: '1.0.0',
      settings: {
        maxIterations: 20,
        threshold: 97,
      },
    };

    const configPath = path.join(tempDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));

    const loaded = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(loaded.pipeline).toBe('test');
    expect(loaded.settings.maxIterations).toBe(20);
  });

  it('should handle missing config file gracefully', () => {
    const configPath = path.join(tempDir, 'nonexistent.json');

    let config = null;
    let error = null;

    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      error = e;
    }

    expect(config).toBeNull();
    expect(error).not.toBeNull();
  });

  it('should handle malformed JSON gracefully', () => {
    const configPath = path.join(tempDir, 'bad.json');
    fs.writeFileSync(configPath, '{ invalid json }');

    let config = null;
    let error = null;

    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      error = e;
    }

    expect(config).toBeNull();
    expect(error).not.toBeNull();
  });
});
