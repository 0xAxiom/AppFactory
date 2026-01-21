/**
 * Pipeline Type Definitions
 *
 * Core types for all AppFactory pipelines. These types provide a standardized
 * interface for pipeline configuration, execution context, and results.
 *
 * @module @appfactory/core/types
 */
/**
 * Supported pipeline identifiers
 */
export type PipelineId =
  | 'app-factory'
  | 'dapp-factory'
  | 'agent-factory'
  | 'plugin-factory'
  | 'miniapp-pipeline'
  | 'website-pipeline';
/**
 * Pipeline execution status
 */
export type PipelineStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'paused';
/**
 * Phase execution status
 */
export type PhaseStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';
/**
 * Severity levels for issues and violations
 */
export type Severity = 'critical' | 'high' | 'medium' | 'low';
/**
 * Pipeline configuration that all pipelines must provide
 */
export interface PipelineConfig {
  /** Unique pipeline identifier */
  id: PipelineId;
  /** Human-readable pipeline name */
  name: string;
  /** Pipeline version (semver) */
  version: string;
  /** Output directory relative to pipeline root */
  outputDir: string;
  /** Directory for execution logs */
  runsDir: string;
  /** List of phase definitions */
  phases: PhaseDefinition[];
  /** Technology stack constraints */
  techStack?: TechStackConfig;
  /** Quality gates configuration */
  qualityGates?: QualityGateConfig[];
}
/**
 * Phase definition within a pipeline
 */
export interface PhaseDefinition {
  /** Unique phase identifier (e.g., "M0", "Phase1", "W1") */
  id: string;
  /** Human-readable phase name */
  name: string;
  /** Phase description */
  description: string;
  /** Whether this phase is mandatory */
  mandatory: boolean;
  /** Whether this phase requires user interaction */
  requiresUserAction?: boolean;
  /** Expected outputs from this phase */
  outputs: string[];
  /** Phases that must complete before this one */
  dependencies?: string[];
}
/**
 * Technology stack configuration
 */
export interface TechStackConfig {
  /** Primary framework (e.g., "Next.js", "Expo", "Node.js") */
  framework: string;
  /** Framework version constraint */
  frameworkVersion: string;
  /** Primary language */
  language: 'TypeScript' | 'JavaScript';
  /** Required dependencies */
  requiredDependencies: string[];
  /** Forbidden dependencies */
  forbiddenDependencies?: string[];
}
/**
 * Quality gate configuration
 */
export interface QualityGateConfig {
  /** Gate identifier */
  id: string;
  /** Gate name */
  name: string;
  /** Minimum passing score (0-100) */
  threshold: number;
  /** Whether failing this gate blocks progress */
  blocking: boolean;
  /** Maximum retry attempts */
  maxRetries?: number;
}
/**
 * Pipeline execution context passed between phases
 */
export interface PipelineContext {
  /** Unique run identifier */
  runId: string;
  /** Pipeline configuration */
  config: PipelineConfig;
  /** Path to the run directory */
  runPath: string;
  /** Path to the output directory for this build */
  outputPath: string;
  /** Original user intent/prompt */
  rawIntent: string;
  /** Normalized intent after Phase 0 */
  normalizedIntent?: string;
  /** Current phase being executed */
  currentPhase?: string;
  /** Completed phases and their results */
  completedPhases: Map<string, PhaseResult>;
  /** Pipeline start timestamp */
  startedAt: Date;
  /** Pipeline completion timestamp */
  completedAt?: Date;
  /** Current status */
  status: PipelineStatus;
  /** Metadata for this run */
  metadata: Record<string, unknown>;
}
/**
 * Result of a phase execution
 */
export interface PhaseResult {
  /** Phase identifier */
  phaseId: string;
  /** Phase status */
  status: PhaseStatus;
  /** Phase start time */
  startedAt: Date;
  /** Phase completion time */
  completedAt?: Date;
  /** Duration in milliseconds */
  duration?: number;
  /** Output artifacts produced */
  artifacts: ArtifactInfo[];
  /** Issues found during this phase */
  issues: Issue[];
  /** Error message if failed */
  error?: string;
  /** Additional phase-specific data */
  data?: Record<string, unknown>;
}
/**
 * Information about a generated artifact
 */
export interface ArtifactInfo {
  /** Artifact type */
  type: 'file' | 'directory' | 'report';
  /** Relative path from output directory */
  path: string;
  /** Human-readable description */
  description?: string;
  /** Whether this artifact is required for completion */
  required: boolean;
}
/**
 * Issue found during pipeline execution
 */
export interface Issue {
  /** Issue severity */
  severity: Severity;
  /** Issue category (e.g., "build", "lint", "accessibility") */
  category: string;
  /** Issue message */
  message: string;
  /** File path where issue was found */
  file?: string;
  /** Line number */
  line?: number;
  /** Column number */
  column?: number;
  /** Rule that was violated */
  rule?: string;
  /** Suggested fix */
  fix?: string;
}
/**
 * Run manifest stored in runs directory
 */
export interface RunManifest {
  /** Run identifier */
  runId: string;
  /** Pipeline that created this run */
  pipeline: PipelineId;
  /** Pipeline version */
  pipelineVersion: string;
  /** Run creation timestamp */
  createdAt: string;
  /** Run completion timestamp */
  completedAt?: string;
  /** Run status */
  status: PipelineStatus;
  /** Original user intent */
  intent: string;
  /** Output path */
  outputPath: string;
  /** Phases executed */
  phases: PhaseManifestEntry[];
  /** Hash of inputs for reproducibility */
  inputsHash: string;
  /** Any failure information */
  failure?: {
    phase: string;
    error: string;
    timestamp: string;
  };
}
/**
 * Phase entry in run manifest
 */
export interface PhaseManifestEntry {
  /** Phase ID */
  id: string;
  /** Phase name */
  name: string;
  /** Phase status */
  status: PhaseStatus;
  /** Start timestamp */
  startedAt: string;
  /** Completion timestamp */
  completedAt?: string;
  /** Duration in milliseconds */
  duration?: number;
  /** Artifacts produced */
  artifacts: string[];
}
//# sourceMappingURL=pipeline.d.ts.map
