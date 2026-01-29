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
export declare const PHASE_IDS: {
    /** Intent normalization phase */
    readonly INTENT: "Phase0";
    /** Market research phase */
    readonly RESEARCH: "Phase1";
    /** Planning and specification phase */
    readonly PLANNING: "Phase2";
    /** Implementation/build phase */
    readonly BUILD: "Phase3";
    /** Quality assurance phase */
    readonly QA: "Phase4";
    /** Packaging and delivery phase */
    readonly PACKAGE: "Phase5";
};
/**
 * Mobile pipeline (app-factory) phase identifiers
 */
export declare const MOBILE_PHASES: {
    /** Intent normalization */
    readonly M0: "M0";
    /** Research phase */
    readonly M1: "M1";
    /** Planning phase */
    readonly M2: "M2";
    /** Build phase */
    readonly M3: "M3";
    /** Ralph QA phase */
    readonly M4: "M4";
    /** Expo package phase */
    readonly M5: "M5";
};
/**
 * dApp pipeline phase identifiers
 */
export declare const DAPP_PHASES: {
    /** Intent normalization */
    readonly D0: "D0";
    /** Research phase */
    readonly D1: "D1";
    /** Planning phase */
    readonly D2: "D2";
    /** Agent decision gate */
    readonly D_GATE: "D-Gate";
    /** Build phase */
    readonly D3: "D3";
    /** Ralph QA phase */
    readonly D4: "D4";
    /** Package phase */
    readonly D5: "D5";
};
/**
 * Website pipeline phase identifiers
 */
export declare const WEBSITE_PHASES: {
    /** Intent normalization */
    readonly W0: "W0";
    /** Research phase */
    readonly W1: "W1";
    /** Planning phase */
    readonly W2: "W2";
    /** Build phase */
    readonly W3: "W3";
    /** Ralph QA phase */
    readonly W4: "W4";
    /** Package phase */
    readonly W5: "W5";
};
/**
 * Agent pipeline phase identifiers
 */
export declare const AGENT_PHASES: {
    /** Intent normalization */
    readonly A0: "A0";
    /** Research phase */
    readonly A1: "A1";
    /** Planning phase */
    readonly A2: "A2";
    /** Build phase */
    readonly A3: "A3";
    /** Ralph QA phase */
    readonly A4: "A4";
    /** Package phase */
    readonly A5: "A5";
};
/**
 * Plugin pipeline phase identifiers
 */
export declare const PLUGIN_PHASES: {
    /** Intent normalization */
    readonly P0: "P0";
    /** Research phase */
    readonly P1: "P1";
    /** Planning phase */
    readonly P2: "P2";
    /** Build phase */
    readonly P3: "P3";
    /** Ralph QA phase */
    readonly P4: "P4";
    /** Package phase */
    readonly P5: "P5";
};
/**
 * Mini App pipeline phase identifiers
 */
export declare const MINIAPP_PHASES: {
    /** Intent normalization */
    readonly N0: "N0";
    /** Research phase */
    readonly N1: "N1";
    /** Planning phase */
    readonly N2: "N2";
    /** Build phase */
    readonly N3: "N3";
    /** Ralph QA phase */
    readonly N4: "N4";
    /** Package phase */
    readonly N5: "N5";
};
/**
 * Phase status values
 */
export declare const PHASE_STATUS: {
    /** Phase has not started */
    readonly PENDING: "pending";
    /** Phase is currently running */
    readonly RUNNING: "running";
    /** Phase completed successfully */
    readonly COMPLETED: "completed";
    /** Phase failed */
    readonly FAILED: "failed";
    /** Phase was skipped */
    readonly SKIPPED: "skipped";
};
/**
 * Pipeline status values
 */
export declare const PIPELINE_STATUS: {
    /** Pipeline has not started */
    readonly PENDING: "pending";
    /** Pipeline is currently running */
    readonly IN_PROGRESS: "in_progress";
    /** Pipeline completed successfully */
    readonly COMPLETED: "completed";
    /** Pipeline failed */
    readonly FAILED: "failed";
    /** Pipeline was paused */
    readonly PAUSED: "paused";
};
//# sourceMappingURL=phases.d.ts.map