/**
 * Phase Detection Tests
 *
 * Tests for pipeline phase transition logic.
 * Validates that phases transition correctly and maintain proper state.
 *
 * @module tests/unit
 */

import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Phase status type matching the pipeline types
 */
type PhaseStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

/**
 * Pipeline status type
 */
type PipelineStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'paused';

/**
 * Phase definition for testing
 */
interface PhaseDefinition {
  id: string;
  name: string;
  mandatory: boolean;
  dependencies?: string[];
}

/**
 * Phase result for testing
 */
interface PhaseResult {
  phaseId: string;
  status: PhaseStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
}

/**
 * Phase transition rules
 */
const VALID_TRANSITIONS: Record<PhaseStatus, PhaseStatus[]> = {
  pending: ['running', 'skipped'],
  running: ['completed', 'failed'],
  completed: [], // Terminal state
  failed: ['pending'], // Can retry
  skipped: [], // Terminal state
};

/**
 * Check if a phase transition is valid
 */
function isValidTransition(from: PhaseStatus, to: PhaseStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Get the next valid statuses for a phase
 */
function getNextValidStatuses(current: PhaseStatus): PhaseStatus[] {
  return VALID_TRANSITIONS[current];
}

/**
 * Check if all dependencies are completed
 */
function areDependenciesCompleted(
  phaseId: string,
  phases: PhaseDefinition[],
  completedPhases: Map<string, PhaseResult>
): boolean {
  const phase = phases.find((p) => p.id === phaseId);
  if (!phase || !phase.dependencies) {
    return true;
  }

  return phase.dependencies.every((depId) => {
    const depResult = completedPhases.get(depId);
    return depResult && depResult.status === 'completed';
  });
}

/**
 * Calculate pipeline status from phase results
 */
function calculatePipelineStatus(
  phases: PhaseDefinition[],
  results: Map<string, PhaseResult>
): PipelineStatus {
  const mandatoryPhases = phases.filter((p) => p.mandatory);

  // Check if any mandatory phase failed
  for (const phase of mandatoryPhases) {
    const result = results.get(phase.id);
    if (result?.status === 'failed') {
      return 'failed';
    }
  }

  // Check if any phase is running
  for (const phase of phases) {
    const result = results.get(phase.id);
    if (result?.status === 'running') {
      return 'in_progress';
    }
  }

  // Check if all mandatory phases are completed
  const allMandatoryCompleted = mandatoryPhases.every((phase) => {
    const result = results.get(phase.id);
    return result?.status === 'completed';
  });

  if (allMandatoryCompleted) {
    return 'completed';
  }

  // Check if nothing has started
  if (results.size === 0) {
    return 'pending';
  }

  return 'in_progress';
}

describe('Phase Status Transitions', () => {
  describe('Valid Transitions', () => {
    it('should allow pending -> running transition', () => {
      expect(isValidTransition('pending', 'running')).toBe(true);
    });

    it('should allow pending -> skipped transition', () => {
      expect(isValidTransition('pending', 'skipped')).toBe(true);
    });

    it('should allow running -> completed transition', () => {
      expect(isValidTransition('running', 'completed')).toBe(true);
    });

    it('should allow running -> failed transition', () => {
      expect(isValidTransition('running', 'failed')).toBe(true);
    });

    it('should allow failed -> pending transition (retry)', () => {
      expect(isValidTransition('failed', 'pending')).toBe(true);
    });
  });

  describe('Invalid Transitions', () => {
    it('should not allow pending -> completed transition', () => {
      expect(isValidTransition('pending', 'completed')).toBe(false);
    });

    it('should not allow pending -> failed transition', () => {
      expect(isValidTransition('pending', 'failed')).toBe(false);
    });

    it('should not allow completed -> any transition', () => {
      expect(isValidTransition('completed', 'pending')).toBe(false);
      expect(isValidTransition('completed', 'running')).toBe(false);
      expect(isValidTransition('completed', 'failed')).toBe(false);
      expect(isValidTransition('completed', 'skipped')).toBe(false);
    });

    it('should not allow skipped -> any transition', () => {
      expect(isValidTransition('skipped', 'pending')).toBe(false);
      expect(isValidTransition('skipped', 'running')).toBe(false);
    });

    it('should not allow running -> pending transition', () => {
      expect(isValidTransition('running', 'pending')).toBe(false);
    });

    it('should not allow running -> skipped transition', () => {
      expect(isValidTransition('running', 'skipped')).toBe(false);
    });
  });

  describe('Next Valid Statuses', () => {
    it('should return correct next statuses for pending', () => {
      const next = getNextValidStatuses('pending');
      expect(next).toContain('running');
      expect(next).toContain('skipped');
      expect(next).not.toContain('completed');
      expect(next).not.toContain('failed');
    });

    it('should return correct next statuses for running', () => {
      const next = getNextValidStatuses('running');
      expect(next).toContain('completed');
      expect(next).toContain('failed');
      expect(next).not.toContain('pending');
      expect(next).not.toContain('skipped');
    });

    it('should return empty array for terminal states', () => {
      expect(getNextValidStatuses('completed')).toEqual([]);
      expect(getNextValidStatuses('skipped')).toEqual([]);
    });
  });
});

describe('Phase Dependencies', () => {
  const testPhases: PhaseDefinition[] = [
    { id: 'phase0', name: 'Intent Normalization', mandatory: true },
    {
      id: 'phase1',
      name: 'Dream Spec',
      mandatory: true,
      dependencies: ['phase0'],
    },
    {
      id: 'phase2',
      name: 'Research',
      mandatory: true,
      dependencies: ['phase1'],
    },
    {
      id: 'phase3',
      name: 'Build',
      mandatory: true,
      dependencies: ['phase1', 'phase2'],
    },
    {
      id: 'phase4',
      name: 'Ralph QA',
      mandatory: true,
      dependencies: ['phase3'],
    },
  ];

  describe('Dependency Checking', () => {
    it('should allow phase with no dependencies', () => {
      const completed = new Map<string, PhaseResult>();
      expect(areDependenciesCompleted('phase0', testPhases, completed)).toBe(
        true
      );
    });

    it('should block phase when dependency not completed', () => {
      const completed = new Map<string, PhaseResult>();
      expect(areDependenciesCompleted('phase1', testPhases, completed)).toBe(
        false
      );
    });

    it('should allow phase when all dependencies completed', () => {
      const completed = new Map<string, PhaseResult>([
        [
          'phase0',
          {
            phaseId: 'phase0',
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
          },
        ],
      ]);
      expect(areDependenciesCompleted('phase1', testPhases, completed)).toBe(
        true
      );
    });

    it('should block phase when only some dependencies completed', () => {
      const completed = new Map<string, PhaseResult>([
        [
          'phase1',
          {
            phaseId: 'phase1',
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
          },
        ],
      ]);
      // phase3 requires both phase1 and phase2
      expect(areDependenciesCompleted('phase3', testPhases, completed)).toBe(
        false
      );
    });

    it('should allow phase when all multiple dependencies completed', () => {
      const completed = new Map<string, PhaseResult>([
        [
          'phase1',
          {
            phaseId: 'phase1',
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
          },
        ],
        [
          'phase2',
          {
            phaseId: 'phase2',
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
          },
        ],
      ]);
      expect(areDependenciesCompleted('phase3', testPhases, completed)).toBe(
        true
      );
    });

    it('should not count failed dependency as completed', () => {
      const completed = new Map<string, PhaseResult>([
        [
          'phase0',
          {
            phaseId: 'phase0',
            status: 'failed',
            startedAt: new Date(),
          },
        ],
      ]);
      expect(areDependenciesCompleted('phase1', testPhases, completed)).toBe(
        false
      );
    });
  });
});

describe('Pipeline Status Calculation', () => {
  const testPhases: PhaseDefinition[] = [
    { id: 'phase0', name: 'Phase 0', mandatory: true },
    { id: 'phase1', name: 'Phase 1', mandatory: true },
    { id: 'phase2', name: 'Phase 2', mandatory: false },
    { id: 'phase3', name: 'Phase 3', mandatory: true },
  ];

  it('should return pending when no phases started', () => {
    const results = new Map<string, PhaseResult>();
    expect(calculatePipelineStatus(testPhases, results)).toBe('pending');
  });

  it('should return in_progress when a phase is running', () => {
    const results = new Map<string, PhaseResult>([
      [
        'phase0',
        {
          phaseId: 'phase0',
          status: 'running',
          startedAt: new Date(),
        },
      ],
    ]);
    expect(calculatePipelineStatus(testPhases, results)).toBe('in_progress');
  });

  it('should return in_progress when some mandatory phases incomplete', () => {
    const results = new Map<string, PhaseResult>([
      [
        'phase0',
        {
          phaseId: 'phase0',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
    ]);
    expect(calculatePipelineStatus(testPhases, results)).toBe('in_progress');
  });

  it('should return failed when any mandatory phase fails', () => {
    const results = new Map<string, PhaseResult>([
      [
        'phase0',
        {
          phaseId: 'phase0',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      [
        'phase1',
        {
          phaseId: 'phase1',
          status: 'failed',
          startedAt: new Date(),
        },
      ],
    ]);
    expect(calculatePipelineStatus(testPhases, results)).toBe('failed');
  });

  it('should return completed when all mandatory phases complete', () => {
    const results = new Map<string, PhaseResult>([
      [
        'phase0',
        {
          phaseId: 'phase0',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      [
        'phase1',
        {
          phaseId: 'phase1',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      [
        'phase3',
        {
          phaseId: 'phase3',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
    ]);
    expect(calculatePipelineStatus(testPhases, results)).toBe('completed');
  });

  it('should return completed even if optional phase skipped', () => {
    const results = new Map<string, PhaseResult>([
      [
        'phase0',
        {
          phaseId: 'phase0',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      [
        'phase1',
        {
          phaseId: 'phase1',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      [
        'phase2',
        {
          phaseId: 'phase2',
          status: 'skipped',
          startedAt: new Date(),
        },
      ],
      [
        'phase3',
        {
          phaseId: 'phase3',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
    ]);
    expect(calculatePipelineStatus(testPhases, results)).toBe('completed');
  });

  it('should still fail if optional phase is running but mandatory failed', () => {
    const results = new Map<string, PhaseResult>([
      [
        'phase0',
        {
          phaseId: 'phase0',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      [
        'phase1',
        {
          phaseId: 'phase1',
          status: 'failed',
          startedAt: new Date(),
        },
      ],
      [
        'phase2',
        {
          phaseId: 'phase2',
          status: 'running',
          startedAt: new Date(),
        },
      ],
    ]);
    expect(calculatePipelineStatus(testPhases, results)).toBe('failed');
  });
});

describe('Phase Duration Tracking', () => {
  it('should calculate duration from start and complete times', () => {
    const startedAt = new Date('2024-01-01T10:00:00Z');
    const completedAt = new Date('2024-01-01T10:05:00Z');

    const result: PhaseResult = {
      phaseId: 'test',
      status: 'completed',
      startedAt,
      completedAt,
      duration: completedAt.getTime() - startedAt.getTime(),
    };

    expect(result.duration).toBe(5 * 60 * 1000); // 5 minutes in milliseconds
  });

  it('should not have duration for running phase', () => {
    const result: PhaseResult = {
      phaseId: 'test',
      status: 'running',
      startedAt: new Date(),
    };

    expect(result.duration).toBeUndefined();
    expect(result.completedAt).toBeUndefined();
  });
});
