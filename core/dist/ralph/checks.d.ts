/**
 * Ralph Built-in Checks
 *
 * Common check implementations that can be reused across pipelines.
 *
 * @module @appfactory/core/ralph
 */
import type { RalphCheck } from '../types/ralph.js';
/**
 * Check that npm install succeeds
 */
export declare const checkNpmInstall: RalphCheck;
/**
 * Check that npm run build succeeds
 */
export declare const checkNpmBuild: RalphCheck;
/**
 * Check that npm run lint passes
 */
export declare const checkNpmLint: RalphCheck;
/**
 * Check that npm run typecheck passes
 */
export declare const checkTypecheck: RalphCheck;
/**
 * Create a check for file existence
 */
export declare function createFileExistsCheck(
  id: string,
  filePath: string,
  description: string,
  mandatory?: boolean,
  points?: number
): RalphCheck;
/**
 * Check that package.json exists
 */
export declare const checkPackageJson: RalphCheck;
/**
 * Check that tsconfig.json exists
 */
export declare const checkTsConfig: RalphCheck;
/**
 * Check that README.md exists
 */
export declare const checkReadme: RalphCheck;
/**
 * Check that package.json has required scripts
 */
export declare function createPackageScriptCheck(script: string): RalphCheck;
/**
 * Check that no hardcoded secrets exist
 */
export declare const checkNoSecrets: RalphCheck;
/**
 * Check that research files are substantive (not placeholders)
 */
export declare function createResearchCheck(
  fileName: string,
  minLength?: number
): RalphCheck;
/**
 * Standard research checks
 */
export declare const checkMarketResearch: RalphCheck;
export declare const checkCompetitorAnalysis: RalphCheck;
export declare const checkPositioning: RalphCheck;
/**
 * Check for loading states
 */
export declare const checkLoadingStates: RalphCheck;
/**
 * Check for error boundaries
 */
export declare const checkErrorBoundaries: RalphCheck;
/**
 * Standard build checks for web applications
 */
export declare const WEB_BUILD_CHECKS: RalphCheck[];
/**
 * Standard research checks
 */
export declare const RESEARCH_CHECKS: RalphCheck[];
/**
 * Standard security checks
 */
export declare const SECURITY_CHECKS: RalphCheck[];
/**
 * Standard UX checks
 */
export declare const UX_CHECKS: RalphCheck[];
/**
 * All standard checks combined
 */
export declare const STANDARD_CHECKS: RalphCheck[];
//# sourceMappingURL=checks.d.ts.map
