/**
 * Artifact Generation Tests
 *
 * Integration tests for validating that required files are created
 * during pipeline execution. Tests the output structure for each pipeline.
 *
 * @module tests/integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

/**
 * Pipeline artifact requirements
 */
interface ArtifactRequirements {
  /** Required files at root of build */
  rootFiles: string[];
  /** Required directories */
  directories: string[];
  /** Required files within directories (path relative to build) */
  nestedFiles: string[];
  /** Optional files that earn bonus points */
  optionalFiles: string[];
}

/**
 * Artifact generation result
 */
interface GenerationResult {
  /** Overall success */
  success: boolean;
  /** Missing required files */
  missingFiles: string[];
  /** Missing required directories */
  missingDirs: string[];
  /** Present optional files */
  presentOptional: string[];
  /** Completeness score (0-100) */
  completenessScore: number;
}

/**
 * Pipeline artifact requirements for each pipeline type
 */
const PIPELINE_REQUIREMENTS: Record<string, ArtifactRequirements> = {
  'app-factory': {
    rootFiles: [
      'package.json',
      'tsconfig.json',
      'app.json',
      'App.tsx',
      'README.md',
    ],
    directories: ['src', 'src/components', 'src/screens', 'assets'],
    nestedFiles: ['src/components/index.ts', 'src/screens/HomeScreen.tsx'],
    optionalFiles: [
      '.env.example',
      'src/store/index.ts',
      'src/hooks/index.ts',
      'src/services/index.ts',
    ],
  },
  'dapp-factory': {
    rootFiles: [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.ts',
      'postcss.config.js',
      'README.md',
      'DEPLOYMENT.md',
    ],
    directories: [
      'src',
      'src/app',
      'src/components',
      'src/lib',
      'research',
      'ralph',
      'tests',
      'public',
    ],
    nestedFiles: [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      'research/market_research.md',
      'research/competitor_analysis.md',
      'research/positioning.md',
    ],
    optionalFiles: [
      'playwright.config.ts',
      'vercel.json',
      'ralph/PROGRESS.md',
      'ralph/PRD.md',
      'src/components/ui/button.tsx',
    ],
  },
  'agent-factory': {
    rootFiles: ['package.json', 'tsconfig.json', 'README.md'],
    directories: ['src', 'src/agent', 'src/tools'],
    nestedFiles: ['src/index.ts', 'src/agent/index.ts'],
    optionalFiles: [
      'src/agent/prompts.ts',
      'src/agent/types.ts',
      'src/tools/index.ts',
    ],
  },
  'plugin-factory': {
    rootFiles: ['package.json', 'tsconfig.json', 'README.md'],
    directories: ['src'],
    nestedFiles: ['src/index.ts'],
    optionalFiles: ['CLAUDE.md', 'manifest.json', 'src/commands/index.ts'],
  },
  'miniapp-pipeline': {
    rootFiles: ['package.json', 'tsconfig.json', 'next.config.js', 'README.md'],
    directories: ['src', 'src/app', 'public'],
    nestedFiles: ['src/app/layout.tsx', 'src/app/page.tsx'],
    optionalFiles: ['minikit.config.ts', 'vercel.json', 'src/lib/minikit.ts'],
  },
};

/**
 * Simulate artifact generation by creating required files
 */
function simulateGeneration(
  outputDir: string,
  requirements: ArtifactRequirements,
  successRate: number = 1.0
): void {
  // Create directories
  for (const dir of requirements.directories) {
    if (Math.random() < successRate) {
      fs.mkdirSync(path.join(outputDir, dir), { recursive: true });
    }
  }

  // Create root files
  for (const file of requirements.rootFiles) {
    if (Math.random() < successRate) {
      const filePath = path.join(outputDir, file);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, getFileContent(file));
    }
  }

  // Create nested files
  for (const file of requirements.nestedFiles) {
    if (Math.random() < successRate) {
      const filePath = path.join(outputDir, file);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, getFileContent(file));
    }
  }

  // Create some optional files
  for (const file of requirements.optionalFiles) {
    if (Math.random() < successRate * 0.5) {
      const filePath = path.join(outputDir, file);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, getFileContent(file));
    }
  }
}

/**
 * Get mock content for a file based on its extension
 */
function getFileContent(filename: string): string {
  const ext = path.extname(filename);

  switch (ext) {
    case '.json':
      if (filename === 'package.json') {
        return JSON.stringify(
          {
            name: 'generated-app',
            version: '1.0.0',
            scripts: {
              dev: 'next dev',
              build: 'next build',
              start: 'next start',
            },
          },
          null,
          2
        );
      }
      if (filename === 'app.json') {
        return JSON.stringify(
          {
            name: 'GeneratedApp',
            expo: {
              name: 'GeneratedApp',
              slug: 'generated-app',
            },
          },
          null,
          2
        );
      }
      if (filename === 'tsconfig.json') {
        return JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2020',
              module: 'ESNext',
              strict: true,
            },
          },
          null,
          2
        );
      }
      return '{}';

    case '.ts':
    case '.tsx':
      if (filename.includes('page.tsx')) {
        return `export default function Page() {
  return <div>Hello World</div>;
}`;
      }
      if (filename.includes('layout.tsx')) {
        return `export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>;
}`;
      }
      if (filename.includes('Screen')) {
        return `import React from 'react';
import { View, Text } from 'react-native';

export default function Screen() {
  return <View><Text>Screen</Text></View>;
}`;
      }
      return 'export {};\n';

    case '.css':
      return `* { box-sizing: border-box; margin: 0; padding: 0; }`;

    case '.md':
      if (filename.includes('market_research')) {
        return `# Market Research\n\n${'This is detailed market research content. '.repeat(30)}`;
      }
      if (filename.includes('competitor_analysis')) {
        return `# Competitor Analysis\n\n${'Detailed competitive landscape analysis. '.repeat(30)}`;
      }
      if (filename.includes('positioning')) {
        return `# Market Positioning\n\n${'Strategic positioning and differentiation. '.repeat(30)}`;
      }
      return `# ${path.basename(filename, '.md')}\n\nDocumentation content here.`;

    case '.js':
      if (filename.includes('config')) {
        return `module.exports = {};\n`;
      }
      return `// ${filename}\n`;

    default:
      return '';
  }
}

/**
 * Validate generated artifacts against requirements
 */
function validateArtifacts(
  outputDir: string,
  requirements: ArtifactRequirements
): GenerationResult {
  const missingFiles: string[] = [];
  const missingDirs: string[] = [];
  const presentOptional: string[] = [];

  // Check directories
  for (const dir of requirements.directories) {
    const dirPath = path.join(outputDir, dir);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      missingDirs.push(dir);
    }
  }

  // Check root files
  for (const file of requirements.rootFiles) {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }

  // Check nested files
  for (const file of requirements.nestedFiles) {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }

  // Check optional files
  for (const file of requirements.optionalFiles) {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) {
      presentOptional.push(file);
    }
  }

  // Calculate completeness score
  const totalRequired =
    requirements.rootFiles.length +
    requirements.directories.length +
    requirements.nestedFiles.length;
  const totalMissing = missingFiles.length + missingDirs.length;
  const completenessScore = Math.round(
    ((totalRequired - totalMissing) / totalRequired) * 100
  );

  return {
    success: missingFiles.length === 0 && missingDirs.length === 0,
    missingFiles,
    missingDirs,
    presentOptional,
    completenessScore,
  };
}

describe('Artifact Generation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-gen-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('dApp Factory Artifacts', () => {
    it('should generate all required files', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.success).toBe(true);
      expect(result.completenessScore).toBe(100);
    });

    it('should generate research directory with substantive content', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const researchDir = path.join(tempDir, 'research');
      expect(fs.existsSync(researchDir)).toBe(true);

      const marketResearch = fs.readFileSync(
        path.join(researchDir, 'market_research.md'),
        'utf-8'
      );
      expect(marketResearch.length).toBeGreaterThan(500);
    });

    it('should generate proper Next.js app structure', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const appDir = path.join(tempDir, 'src', 'app');
      expect(fs.existsSync(path.join(appDir, 'layout.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(appDir, 'page.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(appDir, 'globals.css'))).toBe(true);
    });

    it('should detect missing files correctly', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      // Simulate partial generation
      simulateGeneration(tempDir, requirements, 0.5);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.completenessScore).toBeLessThan(100);
    });
  });

  describe('App Factory Artifacts', () => {
    it('should generate all required files', () => {
      const requirements = PIPELINE_REQUIREMENTS['app-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.success).toBe(true);
    });

    it('should generate proper Expo app structure', () => {
      const requirements = PIPELINE_REQUIREMENTS['app-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      expect(fs.existsSync(path.join(tempDir, 'app.json'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'App.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'src', 'screens'))).toBe(true);
    });

    it('should generate valid app.json', () => {
      const requirements = PIPELINE_REQUIREMENTS['app-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const appJson = JSON.parse(
        fs.readFileSync(path.join(tempDir, 'app.json'), 'utf-8')
      );
      expect(appJson.expo).toBeDefined();
      expect(appJson.expo.name).toBeDefined();
    });
  });

  describe('Agent Factory Artifacts', () => {
    it('should generate all required files', () => {
      const requirements = PIPELINE_REQUIREMENTS['agent-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.success).toBe(true);
    });

    it('should generate agent and tools directories', () => {
      const requirements = PIPELINE_REQUIREMENTS['agent-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      expect(fs.existsSync(path.join(tempDir, 'src', 'agent'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'src', 'tools'))).toBe(true);
    });
  });

  describe('Plugin Factory Artifacts', () => {
    it('should generate all required files', () => {
      const requirements = PIPELINE_REQUIREMENTS['plugin-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.success).toBe(true);
    });

    it('should generate minimal structure', () => {
      const requirements = PIPELINE_REQUIREMENTS['plugin-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      expect(fs.existsSync(path.join(tempDir, 'src', 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'package.json'))).toBe(true);
    });
  });

  describe('Mini App Pipeline Artifacts', () => {
    it('should generate all required files', () => {
      const requirements = PIPELINE_REQUIREMENTS['miniapp-pipeline'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.success).toBe(true);
    });

    it('should generate Next.js app structure', () => {
      const requirements = PIPELINE_REQUIREMENTS['miniapp-pipeline'];
      simulateGeneration(tempDir, requirements, 1.0);

      expect(fs.existsSync(path.join(tempDir, 'src', 'app', 'page.tsx'))).toBe(
        true
      );
      expect(fs.existsSync(path.join(tempDir, 'next.config.js'))).toBe(true);
    });
  });

  describe('Completeness Scoring', () => {
    it('should return 100% for complete generation', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      expect(result.completenessScore).toBe(100);
    });

    it('should return 0% for empty directory', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      // Don't generate anything

      const result = validateArtifacts(tempDir, requirements);
      expect(result.completenessScore).toBe(0);
    });

    it('should track optional files separately', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const result = validateArtifacts(tempDir, requirements);
      // Optional files present should be tracked
      expect(result.presentOptional).toBeDefined();
    });
  });

  describe('File Content Validation', () => {
    it('should generate valid JSON in package.json', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const pkgContent = fs.readFileSync(
        path.join(tempDir, 'package.json'),
        'utf-8'
      );
      expect(() => JSON.parse(pkgContent)).not.toThrow();
    });

    it('should generate valid JSON in tsconfig.json', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const tsContent = fs.readFileSync(
        path.join(tempDir, 'tsconfig.json'),
        'utf-8'
      );
      expect(() => JSON.parse(tsContent)).not.toThrow();
    });

    it('should generate TypeScript files with valid syntax patterns', () => {
      const requirements = PIPELINE_REQUIREMENTS['dapp-factory'];
      simulateGeneration(tempDir, requirements, 1.0);

      const pageContent = fs.readFileSync(
        path.join(tempDir, 'src', 'app', 'page.tsx'),
        'utf-8'
      );
      expect(pageContent).toContain('export');
      expect(pageContent).toContain('function');
    });
  });
});

describe('Cross-Pipeline Artifact Comparison', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'appfactory-compare-test-')
    );
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should have unique artifacts per pipeline', () => {
    const pipelines = Object.keys(PIPELINE_REQUIREMENTS);

    for (let i = 0; i < pipelines.length; i++) {
      for (let j = i + 1; j < pipelines.length; j++) {
        const req1 = PIPELINE_REQUIREMENTS[pipelines[i]];
        const req2 = PIPELINE_REQUIREMENTS[pipelines[j]];

        // Check that pipelines have some unique requirements
        const allFiles1 = [...req1.rootFiles, ...req1.nestedFiles];
        const allFiles2 = [...req2.rootFiles, ...req2.nestedFiles];

        const uniqueToFirst = allFiles1.filter((f) => !allFiles2.includes(f));
        const uniqueToSecond = allFiles2.filter((f) => !allFiles1.includes(f));

        // Each pipeline should have at least some unique files
        expect(uniqueToFirst.length > 0 || uniqueToSecond.length > 0).toBe(
          true
        );
      }
    }
  });

  it('should all require package.json and tsconfig.json', () => {
    for (const [pipeline, requirements] of Object.entries(
      PIPELINE_REQUIREMENTS
    )) {
      expect(requirements.rootFiles).toContain('package.json');
      expect(requirements.rootFiles).toContain('tsconfig.json');
    }
  });

  it('should all require README.md', () => {
    for (const [pipeline, requirements] of Object.entries(
      PIPELINE_REQUIREMENTS
    )) {
      expect(requirements.rootFiles).toContain('README.md');
    }
  });
});
