/**
 * Phase Definitions
 *
 * Standard phase identifiers and configurations used across all pipelines.
 *
 * @module @appfactory/core/constants
 */
/**
 * Standard phase identifiers used across pipelines
 */
export const PHASE_IDS = {
    /** Intent normalization phase */
    INTENT: 'Phase0',
    /** Market research phase */
    RESEARCH: 'Phase1',
    /** Planning and specification phase */
    PLANNING: 'Phase2',
    /** Implementation/build phase */
    BUILD: 'Phase3',
    /** Quality assurance phase */
    QA: 'Phase4',
    /** Packaging and delivery phase */
    PACKAGE: 'Phase5',
};
/**
 * Mobile pipeline (app-factory) phase identifiers
 */
export const MOBILE_PHASES = {
    /** Intent normalization */
    M0: 'M0',
    /** Research phase */
    M1: 'M1',
    /** Planning phase */
    M2: 'M2',
    /** Build phase */
    M3: 'M3',
    /** Ralph QA phase */
    M4: 'M4',
    /** Expo package phase */
    M5: 'M5',
};
/**
 * dApp pipeline phase identifiers
 */
export const DAPP_PHASES = {
    /** Intent normalization */
    D0: 'D0',
    /** Research phase */
    D1: 'D1',
    /** Planning phase */
    D2: 'D2',
    /** Agent decision gate */
    D_GATE: 'D-Gate',
    /** Build phase */
    D3: 'D3',
    /** Ralph QA phase */
    D4: 'D4',
    /** Package phase */
    D5: 'D5',
};
/**
 * Website pipeline phase identifiers
 */
export const WEBSITE_PHASES = {
    /** Intent normalization */
    W0: 'W0',
    /** Research phase */
    W1: 'W1',
    /** Planning phase */
    W2: 'W2',
    /** Build phase */
    W3: 'W3',
    /** Ralph QA phase */
    W4: 'W4',
    /** Package phase */
    W5: 'W5',
};
/**
 * Agent pipeline phase identifiers
 */
export const AGENT_PHASES = {
    /** Intent normalization */
    A0: 'A0',
    /** Research phase */
    A1: 'A1',
    /** Planning phase */
    A2: 'A2',
    /** Build phase */
    A3: 'A3',
    /** Ralph QA phase */
    A4: 'A4',
    /** Package phase */
    A5: 'A5',
};
/**
 * Plugin pipeline phase identifiers
 */
export const PLUGIN_PHASES = {
    /** Intent normalization */
    P0: 'P0',
    /** Research phase */
    P1: 'P1',
    /** Planning phase */
    P2: 'P2',
    /** Build phase */
    P3: 'P3',
    /** Ralph QA phase */
    P4: 'P4',
    /** Package phase */
    P5: 'P5',
};
/**
 * Mini App pipeline phase identifiers
 */
export const MINIAPP_PHASES = {
    /** Intent normalization */
    N0: 'N0',
    /** Research phase */
    N1: 'N1',
    /** Planning phase */
    N2: 'N2',
    /** Build phase */
    N3: 'N3',
    /** Ralph QA phase */
    N4: 'N4',
    /** Package phase */
    N5: 'N5',
};
/**
 * Phase status values
 */
export const PHASE_STATUS = {
    /** Phase has not started */
    PENDING: 'pending',
    /** Phase is currently running */
    RUNNING: 'running',
    /** Phase completed successfully */
    COMPLETED: 'completed',
    /** Phase failed */
    FAILED: 'failed',
    /** Phase was skipped */
    SKIPPED: 'skipped',
};
/**
 * Pipeline status values
 */
export const PIPELINE_STATUS = {
    /** Pipeline has not started */
    PENDING: 'pending',
    /** Pipeline is currently running */
    IN_PROGRESS: 'in_progress',
    /** Pipeline completed successfully */
    COMPLETED: 'completed',
    /** Pipeline failed */
    FAILED: 'failed',
    /** Pipeline was paused */
    PAUSED: 'paused',
};
//# sourceMappingURL=phases.js.map