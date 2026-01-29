/**
 * Pipeline Configuration Schema
 *
 * JSON Schema and Zod schemas for pipeline configuration validation.
 *
 * @module @appfactory/core/config
 */
import { z } from 'zod';
/**
 * Severity level schema
 */
export declare const SeveritySchema: z.ZodEnum<["critical", "high", "medium", "low"]>;
/**
 * Phase definition schema
 */
export declare const PhaseDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    mandatory: z.ZodBoolean;
    requiresUserAction: z.ZodOptional<z.ZodBoolean>;
    outputs: z.ZodArray<z.ZodString, "many">;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    name: string;
    mandatory: boolean;
    outputs: string[];
    requiresUserAction?: boolean | undefined;
    dependencies?: string[] | undefined;
}, {
    description: string;
    id: string;
    name: string;
    mandatory: boolean;
    outputs: string[];
    requiresUserAction?: boolean | undefined;
    dependencies?: string[] | undefined;
}>;
/**
 * Technology stack configuration schema
 */
export declare const TechStackConfigSchema: z.ZodObject<{
    framework: z.ZodString;
    frameworkVersion: z.ZodString;
    language: z.ZodEnum<["TypeScript", "JavaScript"]>;
    requiredDependencies: z.ZodArray<z.ZodString, "many">;
    forbiddenDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    framework: string;
    frameworkVersion: string;
    language: "TypeScript" | "JavaScript";
    requiredDependencies: string[];
    forbiddenDependencies?: string[] | undefined;
}, {
    framework: string;
    frameworkVersion: string;
    language: "TypeScript" | "JavaScript";
    requiredDependencies: string[];
    forbiddenDependencies?: string[] | undefined;
}>;
/**
 * Quality gate configuration schema
 */
export declare const QualityGateConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    threshold: z.ZodNumber;
    blocking: z.ZodBoolean;
    maxRetries: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    threshold: number;
    blocking: boolean;
    maxRetries?: number | undefined;
}, {
    id: string;
    name: string;
    threshold: number;
    blocking: boolean;
    maxRetries?: number | undefined;
}>;
/**
 * Pipeline configuration schema
 */
export declare const PipelineConfigSchema: z.ZodObject<{
    id: z.ZodEnum<["app-factory", "dapp-factory", "agent-factory", "plugin-factory", "miniapp-pipeline", "website-pipeline"]>;
    name: z.ZodString;
    version: z.ZodString;
    outputDir: z.ZodString;
    runsDir: z.ZodString;
    phases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        mandatory: z.ZodBoolean;
        requiresUserAction: z.ZodOptional<z.ZodBoolean>;
        outputs: z.ZodArray<z.ZodString, "many">;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        outputs: string[];
        requiresUserAction?: boolean | undefined;
        dependencies?: string[] | undefined;
    }, {
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        outputs: string[];
        requiresUserAction?: boolean | undefined;
        dependencies?: string[] | undefined;
    }>, "many">;
    techStack: z.ZodOptional<z.ZodObject<{
        framework: z.ZodString;
        frameworkVersion: z.ZodString;
        language: z.ZodEnum<["TypeScript", "JavaScript"]>;
        requiredDependencies: z.ZodArray<z.ZodString, "many">;
        forbiddenDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        framework: string;
        frameworkVersion: string;
        language: "TypeScript" | "JavaScript";
        requiredDependencies: string[];
        forbiddenDependencies?: string[] | undefined;
    }, {
        framework: string;
        frameworkVersion: string;
        language: "TypeScript" | "JavaScript";
        requiredDependencies: string[];
        forbiddenDependencies?: string[] | undefined;
    }>>;
    qualityGates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        threshold: z.ZodNumber;
        blocking: z.ZodBoolean;
        maxRetries: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        threshold: number;
        blocking: boolean;
        maxRetries?: number | undefined;
    }, {
        id: string;
        name: string;
        threshold: number;
        blocking: boolean;
        maxRetries?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: "app-factory" | "dapp-factory" | "agent-factory" | "plugin-factory" | "miniapp-pipeline" | "website-pipeline";
    name: string;
    version: string;
    outputDir: string;
    runsDir: string;
    phases: {
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        outputs: string[];
        requiresUserAction?: boolean | undefined;
        dependencies?: string[] | undefined;
    }[];
    techStack?: {
        framework: string;
        frameworkVersion: string;
        language: "TypeScript" | "JavaScript";
        requiredDependencies: string[];
        forbiddenDependencies?: string[] | undefined;
    } | undefined;
    qualityGates?: {
        id: string;
        name: string;
        threshold: number;
        blocking: boolean;
        maxRetries?: number | undefined;
    }[] | undefined;
}, {
    id: "app-factory" | "dapp-factory" | "agent-factory" | "plugin-factory" | "miniapp-pipeline" | "website-pipeline";
    name: string;
    version: string;
    outputDir: string;
    runsDir: string;
    phases: {
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        outputs: string[];
        requiresUserAction?: boolean | undefined;
        dependencies?: string[] | undefined;
    }[];
    techStack?: {
        framework: string;
        frameworkVersion: string;
        language: "TypeScript" | "JavaScript";
        requiredDependencies: string[];
        forbiddenDependencies?: string[] | undefined;
    } | undefined;
    qualityGates?: {
        id: string;
        name: string;
        threshold: number;
        blocking: boolean;
        maxRetries?: number | undefined;
    }[] | undefined;
}>;
/**
 * Ralph configuration schema
 */
export declare const RalphConfigSchema: z.ZodObject<{
    passingThreshold: z.ZodDefault<z.ZodNumber>;
    maxIterations: z.ZodDefault<z.ZodNumber>;
    checks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<["build", "runtime", "ui", "ux", "accessibility", "performance", "security", "documentation", "research", "code-quality", "seo"]>;
        description: z.ZodString;
        mandatory: z.ZodBoolean;
        points: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        points: number;
    }, {
        category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        points: number;
    }>, "many">;
    skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        threshold: z.ZodNumber;
        blocking: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        name: string;
        threshold: number;
        blocking: boolean;
    }, {
        name: string;
        threshold: number;
        blocking: boolean;
    }>, "many">>;
    runE2ETests: z.ZodDefault<z.ZodBoolean>;
    e2eConfig: z.ZodOptional<z.ZodObject<{
        framework: z.ZodEnum<["playwright", "cypress"]>;
        testDir: z.ZodString;
        baseUrl: z.ZodString;
        timeout: z.ZodNumber;
        browser: z.ZodEnum<["chromium", "firefox", "webkit"]>;
    }, "strip", z.ZodTypeAny, {
        framework: "playwright" | "cypress";
        testDir: string;
        baseUrl: string;
        timeout: number;
        browser: "chromium" | "firefox" | "webkit";
    }, {
        framework: "playwright" | "cypress";
        testDir: string;
        baseUrl: string;
        timeout: number;
        browser: "chromium" | "firefox" | "webkit";
    }>>;
}, "strip", z.ZodTypeAny, {
    checks: {
        category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        points: number;
    }[];
    passingThreshold: number;
    maxIterations: number;
    runE2ETests: boolean;
    e2eConfig?: {
        framework: "playwright" | "cypress";
        testDir: string;
        baseUrl: string;
        timeout: number;
        browser: "chromium" | "firefox" | "webkit";
    } | undefined;
    skills?: {
        name: string;
        threshold: number;
        blocking: boolean;
    }[] | undefined;
}, {
    checks: {
        category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
        description: string;
        id: string;
        name: string;
        mandatory: boolean;
        points: number;
    }[];
    e2eConfig?: {
        framework: "playwright" | "cypress";
        testDir: string;
        baseUrl: string;
        timeout: number;
        browser: "chromium" | "firefox" | "webkit";
    } | undefined;
    passingThreshold?: number | undefined;
    maxIterations?: number | undefined;
    skills?: {
        name: string;
        threshold: number;
        blocking: boolean;
    }[] | undefined;
    runE2ETests?: boolean | undefined;
}>;
/**
 * Validation configuration schema
 */
export declare const ValidationConfigSchema: z.ZodObject<{
    requiredFiles: z.ZodArray<z.ZodString, "many">;
    forbiddenFiles: z.ZodArray<z.ZodString, "many">;
    forbiddenPatterns: z.ZodArray<z.ZodObject<{
        pattern: z.ZodString;
        description: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        pattern: string;
        severity: "critical" | "high" | "medium" | "low";
    }, {
        description: string;
        pattern: string;
        severity: "critical" | "high" | "medium" | "low";
    }>, "many">;
    sizeLimits: z.ZodObject<{
        totalSize: z.ZodNumber;
        singleFile: z.ZodNumber;
        maxFiles: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalSize: number;
        singleFile: number;
        maxFiles: number;
    }, {
        totalSize: number;
        singleFile: number;
        maxFiles: number;
    }>;
    requiredDependencies: z.ZodArray<z.ZodString, "many">;
    forbiddenDependencies: z.ZodArray<z.ZodString, "many">;
    requiredScripts: z.ZodArray<z.ZodString, "many">;
    allowedDotfiles: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    requiredDependencies: string[];
    forbiddenDependencies: string[];
    requiredFiles: string[];
    forbiddenFiles: string[];
    forbiddenPatterns: {
        description: string;
        pattern: string;
        severity: "critical" | "high" | "medium" | "low";
    }[];
    sizeLimits: {
        totalSize: number;
        singleFile: number;
        maxFiles: number;
    };
    requiredScripts: string[];
    allowedDotfiles: string[];
}, {
    requiredDependencies: string[];
    forbiddenDependencies: string[];
    requiredFiles: string[];
    forbiddenFiles: string[];
    forbiddenPatterns: {
        description: string;
        pattern: string;
        severity: "critical" | "high" | "medium" | "low";
    }[];
    sizeLimits: {
        totalSize: number;
        singleFile: number;
        maxFiles: number;
    };
    requiredScripts: string[];
    allowedDotfiles: string[];
}>;
/**
 * Complete pipeline.config.ts schema
 */
export declare const PipelineConfigFileSchema: z.ZodObject<{
    pipeline: z.ZodObject<{
        id: z.ZodEnum<["app-factory", "dapp-factory", "agent-factory", "plugin-factory", "miniapp-pipeline", "website-pipeline"]>;
        name: z.ZodString;
        version: z.ZodString;
        outputDir: z.ZodString;
        runsDir: z.ZodString;
        phases: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            mandatory: z.ZodBoolean;
            requiresUserAction: z.ZodOptional<z.ZodBoolean>;
            outputs: z.ZodArray<z.ZodString, "many">;
            dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            outputs: string[];
            requiresUserAction?: boolean | undefined;
            dependencies?: string[] | undefined;
        }, {
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            outputs: string[];
            requiresUserAction?: boolean | undefined;
            dependencies?: string[] | undefined;
        }>, "many">;
        techStack: z.ZodOptional<z.ZodObject<{
            framework: z.ZodString;
            frameworkVersion: z.ZodString;
            language: z.ZodEnum<["TypeScript", "JavaScript"]>;
            requiredDependencies: z.ZodArray<z.ZodString, "many">;
            forbiddenDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            framework: string;
            frameworkVersion: string;
            language: "TypeScript" | "JavaScript";
            requiredDependencies: string[];
            forbiddenDependencies?: string[] | undefined;
        }, {
            framework: string;
            frameworkVersion: string;
            language: "TypeScript" | "JavaScript";
            requiredDependencies: string[];
            forbiddenDependencies?: string[] | undefined;
        }>>;
        qualityGates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            threshold: z.ZodNumber;
            blocking: z.ZodBoolean;
            maxRetries: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            threshold: number;
            blocking: boolean;
            maxRetries?: number | undefined;
        }, {
            id: string;
            name: string;
            threshold: number;
            blocking: boolean;
            maxRetries?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: "app-factory" | "dapp-factory" | "agent-factory" | "plugin-factory" | "miniapp-pipeline" | "website-pipeline";
        name: string;
        version: string;
        outputDir: string;
        runsDir: string;
        phases: {
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            outputs: string[];
            requiresUserAction?: boolean | undefined;
            dependencies?: string[] | undefined;
        }[];
        techStack?: {
            framework: string;
            frameworkVersion: string;
            language: "TypeScript" | "JavaScript";
            requiredDependencies: string[];
            forbiddenDependencies?: string[] | undefined;
        } | undefined;
        qualityGates?: {
            id: string;
            name: string;
            threshold: number;
            blocking: boolean;
            maxRetries?: number | undefined;
        }[] | undefined;
    }, {
        id: "app-factory" | "dapp-factory" | "agent-factory" | "plugin-factory" | "miniapp-pipeline" | "website-pipeline";
        name: string;
        version: string;
        outputDir: string;
        runsDir: string;
        phases: {
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            outputs: string[];
            requiresUserAction?: boolean | undefined;
            dependencies?: string[] | undefined;
        }[];
        techStack?: {
            framework: string;
            frameworkVersion: string;
            language: "TypeScript" | "JavaScript";
            requiredDependencies: string[];
            forbiddenDependencies?: string[] | undefined;
        } | undefined;
        qualityGates?: {
            id: string;
            name: string;
            threshold: number;
            blocking: boolean;
            maxRetries?: number | undefined;
        }[] | undefined;
    }>;
    ralph: z.ZodOptional<z.ZodObject<{
        passingThreshold: z.ZodDefault<z.ZodNumber>;
        maxIterations: z.ZodDefault<z.ZodNumber>;
        checks: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            category: z.ZodEnum<["build", "runtime", "ui", "ux", "accessibility", "performance", "security", "documentation", "research", "code-quality", "seo"]>;
            description: z.ZodString;
            mandatory: z.ZodBoolean;
            points: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            points: number;
        }, {
            category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            points: number;
        }>, "many">;
        skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            threshold: z.ZodNumber;
            blocking: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            name: string;
            threshold: number;
            blocking: boolean;
        }, {
            name: string;
            threshold: number;
            blocking: boolean;
        }>, "many">>;
        runE2ETests: z.ZodDefault<z.ZodBoolean>;
        e2eConfig: z.ZodOptional<z.ZodObject<{
            framework: z.ZodEnum<["playwright", "cypress"]>;
            testDir: z.ZodString;
            baseUrl: z.ZodString;
            timeout: z.ZodNumber;
            browser: z.ZodEnum<["chromium", "firefox", "webkit"]>;
        }, "strip", z.ZodTypeAny, {
            framework: "playwright" | "cypress";
            testDir: string;
            baseUrl: string;
            timeout: number;
            browser: "chromium" | "firefox" | "webkit";
        }, {
            framework: "playwright" | "cypress";
            testDir: string;
            baseUrl: string;
            timeout: number;
            browser: "chromium" | "firefox" | "webkit";
        }>>;
    }, "strip", z.ZodTypeAny, {
        checks: {
            category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            points: number;
        }[];
        passingThreshold: number;
        maxIterations: number;
        runE2ETests: boolean;
        e2eConfig?: {
            framework: "playwright" | "cypress";
            testDir: string;
            baseUrl: string;
            timeout: number;
            browser: "chromium" | "firefox" | "webkit";
        } | undefined;
        skills?: {
            name: string;
            threshold: number;
            blocking: boolean;
        }[] | undefined;
    }, {
        checks: {
            category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            points: number;
        }[];
        e2eConfig?: {
            framework: "playwright" | "cypress";
            testDir: string;
            baseUrl: string;
            timeout: number;
            browser: "chromium" | "firefox" | "webkit";
        } | undefined;
        passingThreshold?: number | undefined;
        maxIterations?: number | undefined;
        skills?: {
            name: string;
            threshold: number;
            blocking: boolean;
        }[] | undefined;
        runE2ETests?: boolean | undefined;
    }>>;
    validation: z.ZodOptional<z.ZodObject<{
        requiredFiles: z.ZodArray<z.ZodString, "many">;
        forbiddenFiles: z.ZodArray<z.ZodString, "many">;
        forbiddenPatterns: z.ZodArray<z.ZodObject<{
            pattern: z.ZodString;
            description: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            pattern: string;
            severity: "critical" | "high" | "medium" | "low";
        }, {
            description: string;
            pattern: string;
            severity: "critical" | "high" | "medium" | "low";
        }>, "many">;
        sizeLimits: z.ZodObject<{
            totalSize: z.ZodNumber;
            singleFile: z.ZodNumber;
            maxFiles: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            totalSize: number;
            singleFile: number;
            maxFiles: number;
        }, {
            totalSize: number;
            singleFile: number;
            maxFiles: number;
        }>;
        requiredDependencies: z.ZodArray<z.ZodString, "many">;
        forbiddenDependencies: z.ZodArray<z.ZodString, "many">;
        requiredScripts: z.ZodArray<z.ZodString, "many">;
        allowedDotfiles: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        requiredDependencies: string[];
        forbiddenDependencies: string[];
        requiredFiles: string[];
        forbiddenFiles: string[];
        forbiddenPatterns: {
            description: string;
            pattern: string;
            severity: "critical" | "high" | "medium" | "low";
        }[];
        sizeLimits: {
            totalSize: number;
            singleFile: number;
            maxFiles: number;
        };
        requiredScripts: string[];
        allowedDotfiles: string[];
    }, {
        requiredDependencies: string[];
        forbiddenDependencies: string[];
        requiredFiles: string[];
        forbiddenFiles: string[];
        forbiddenPatterns: {
            description: string;
            pattern: string;
            severity: "critical" | "high" | "medium" | "low";
        }[];
        sizeLimits: {
            totalSize: number;
            singleFile: number;
            maxFiles: number;
        };
        requiredScripts: string[];
        allowedDotfiles: string[];
    }>>;
}, "strip", z.ZodTypeAny, {
    pipeline: {
        id: "app-factory" | "dapp-factory" | "agent-factory" | "plugin-factory" | "miniapp-pipeline" | "website-pipeline";
        name: string;
        version: string;
        outputDir: string;
        runsDir: string;
        phases: {
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            outputs: string[];
            requiresUserAction?: boolean | undefined;
            dependencies?: string[] | undefined;
        }[];
        techStack?: {
            framework: string;
            frameworkVersion: string;
            language: "TypeScript" | "JavaScript";
            requiredDependencies: string[];
            forbiddenDependencies?: string[] | undefined;
        } | undefined;
        qualityGates?: {
            id: string;
            name: string;
            threshold: number;
            blocking: boolean;
            maxRetries?: number | undefined;
        }[] | undefined;
    };
    validation?: {
        requiredDependencies: string[];
        forbiddenDependencies: string[];
        requiredFiles: string[];
        forbiddenFiles: string[];
        forbiddenPatterns: {
            description: string;
            pattern: string;
            severity: "critical" | "high" | "medium" | "low";
        }[];
        sizeLimits: {
            totalSize: number;
            singleFile: number;
            maxFiles: number;
        };
        requiredScripts: string[];
        allowedDotfiles: string[];
    } | undefined;
    ralph?: {
        checks: {
            category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            points: number;
        }[];
        passingThreshold: number;
        maxIterations: number;
        runE2ETests: boolean;
        e2eConfig?: {
            framework: "playwright" | "cypress";
            testDir: string;
            baseUrl: string;
            timeout: number;
            browser: "chromium" | "firefox" | "webkit";
        } | undefined;
        skills?: {
            name: string;
            threshold: number;
            blocking: boolean;
        }[] | undefined;
    } | undefined;
}, {
    pipeline: {
        id: "app-factory" | "dapp-factory" | "agent-factory" | "plugin-factory" | "miniapp-pipeline" | "website-pipeline";
        name: string;
        version: string;
        outputDir: string;
        runsDir: string;
        phases: {
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            outputs: string[];
            requiresUserAction?: boolean | undefined;
            dependencies?: string[] | undefined;
        }[];
        techStack?: {
            framework: string;
            frameworkVersion: string;
            language: "TypeScript" | "JavaScript";
            requiredDependencies: string[];
            forbiddenDependencies?: string[] | undefined;
        } | undefined;
        qualityGates?: {
            id: string;
            name: string;
            threshold: number;
            blocking: boolean;
            maxRetries?: number | undefined;
        }[] | undefined;
    };
    validation?: {
        requiredDependencies: string[];
        forbiddenDependencies: string[];
        requiredFiles: string[];
        forbiddenFiles: string[];
        forbiddenPatterns: {
            description: string;
            pattern: string;
            severity: "critical" | "high" | "medium" | "low";
        }[];
        sizeLimits: {
            totalSize: number;
            singleFile: number;
            maxFiles: number;
        };
        requiredScripts: string[];
        allowedDotfiles: string[];
    } | undefined;
    ralph?: {
        checks: {
            category: "build" | "runtime" | "ui" | "ux" | "accessibility" | "performance" | "security" | "documentation" | "research" | "code-quality" | "seo";
            description: string;
            id: string;
            name: string;
            mandatory: boolean;
            points: number;
        }[];
        e2eConfig?: {
            framework: "playwright" | "cypress";
            testDir: string;
            baseUrl: string;
            timeout: number;
            browser: "chromium" | "firefox" | "webkit";
        } | undefined;
        passingThreshold?: number | undefined;
        maxIterations?: number | undefined;
        skills?: {
            name: string;
            threshold: number;
            blocking: boolean;
        }[] | undefined;
        runE2ETests?: boolean | undefined;
    } | undefined;
}>;
/**
 * Type inference from schemas
 */
export type PipelineConfigFromSchema = z.infer<typeof PipelineConfigSchema>;
export type RalphConfigFromSchema = z.infer<typeof RalphConfigSchema>;
export type ValidationConfigFromSchema = z.infer<typeof ValidationConfigSchema>;
export type PipelineConfigFileFromSchema = z.infer<typeof PipelineConfigFileSchema>;
//# sourceMappingURL=schema.d.ts.map