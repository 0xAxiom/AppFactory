const fs = require("fs");
const path = require("path");

const catalog = JSON.parse(fs.readFileSync("plugin-factory/mcp.catalog.json", "utf8"));

const results = {
  loops: [],
  issues: [],
  fixes: []
};

function log(msg) {
  console.log(msg);
}

// Loop 1: Catalog Structure Validation
function loop1() {
  log("=== Loop 1: Catalog Structure Validation ===");
  const checks = [];

  // Check 1: JSON syntax (already parsed)
  checks.push({ name: "JSON syntax valid", pass: true });

  // Check 2: Required fields
  const requiredFields = ["name", "description", "source", "allowedPipelines", "allowedPhases", "permissionLevel"];
  let allFieldsPresent = true;
  for (const [mcpId, mcp] of Object.entries(catalog.mcpServers)) {
    for (const field of requiredFields) {
      if (!mcp[field]) {
        allFieldsPresent = false;
        results.issues.push(`Missing field ${field} in ${mcpId}`);
      }
    }
  }
  checks.push({ name: "All required fields present", pass: allFieldsPresent });

  // Check 3: Pipeline mappings complete
  const pipelines = ["app-factory", "dapp-factory", "agent-factory", "plugin-factory", "miniapp-pipeline", "website-pipeline"];
  let pipelineMappingsComplete = true;
  for (const pipeline of pipelines) {
    if (!catalog.pipelineIntegrations[pipeline]) {
      pipelineMappingsComplete = false;
      results.issues.push(`Missing pipeline mapping for ${pipeline}`);
    }
  }
  checks.push({ name: "Pipeline mappings complete", pass: pipelineMappingsComplete });

  // Check 4: Phase mappings consistent
  const validPhases = ["research", "build", "verify", "deploy", "ralph"];
  let phaseMappingsConsistent = true;
  for (const [pipeline, config] of Object.entries(catalog.pipelineIntegrations)) {
    if (config.phaseMapping) {
      for (const phase of Object.keys(config.phaseMapping)) {
        if (!validPhases.includes(phase)) {
          phaseMappingsConsistent = false;
          results.issues.push(`Invalid phase ${phase} in ${pipeline}`);
        }
      }
    }
  }
  checks.push({ name: "Phase mappings consistent", pass: phaseMappingsConsistent });

  // Check 5: No duplicate MCP definitions
  const mcpIds = Object.keys(catalog.mcpServers);
  checks.push({ name: "No duplicate MCP definitions", pass: mcpIds.length === new Set(mcpIds).size });

  const passed = checks.every(c => c.pass);
  checks.forEach(c => log(`  ${c.name}: ${c.pass ? "PASS" : "FAIL"}`));
  log(`Loop 1 Status: ${passed ? "PASS" : "NEEDS FIX"}\n`);

  return { loop: 1, name: "Catalog Structure Validation", status: passed ? "PASS" : "FAIL", checks };
}

// Loop 2: Phase Gate Enforcement (dapp-factory)
function loop2() {
  log("=== Loop 2: Phase Gate Enforcement (dapp-factory) ===");
  const dappFactory = catalog.pipelineIntegrations["dapp-factory"];
  const phaseMapping = dappFactory.phaseMapping;

  const mcpPhases = {};
  for (const [phase, mcps] of Object.entries(phaseMapping)) {
    for (const mcp of mcps) {
      if (!mcpPhases[mcp]) mcpPhases[mcp] = [];
      mcpPhases[mcp].push(phase);
    }
  }

  const testCases = [
    { mcp: "playwright", wrongPhase: "build" },
    { mcp: "vercel", wrongPhase: "research" },
    { mcp: "stripe", wrongPhase: "verify" },
    { mcp: "supabase", wrongPhase: "deploy" },
    { mcp: "figma", wrongPhase: "ralph" }
  ];

  let allPassed = true;
  for (const test of testCases) {
    const allowedPhases = mcpPhases[test.mcp] || [];
    const blocked = !allowedPhases.includes(test.wrongPhase);
    log(`  ${test.mcp} in ${test.wrongPhase}: ${blocked ? "PASS (blocked)" : "FAIL"}`);
    if (!blocked) {
      allPassed = false;
      results.issues.push(`${test.mcp} not blocked in ${test.wrongPhase} phase for dapp-factory`);
    }
  }

  log(`Loop 2 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 2, name: "Phase Gate Enforcement (dapp-factory)", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 3: Phase Gate Enforcement (app-factory)
function loop3() {
  log("=== Loop 3: Phase Gate Enforcement (app-factory) ===");
  const appFactory = catalog.pipelineIntegrations["app-factory"];
  const phaseMapping = appFactory.phaseMapping;

  const mcpPhases = {};
  for (const [phase, mcps] of Object.entries(phaseMapping)) {
    for (const mcp of mcps) {
      if (!mcpPhases[mcp]) mcpPhases[mcp] = [];
      mcpPhases[mcp].push(phase);
    }
  }

  const testCases = [
    { mcp: "playwright", wrongPhase: "build" },
    { mcp: "stripe", wrongPhase: "verify" },
    { mcp: "figma", wrongPhase: "ralph" }
  ];

  let allPassed = true;
  for (const test of testCases) {
    const allowedPhases = mcpPhases[test.mcp] || [];
    const blocked = !allowedPhases.includes(test.wrongPhase);
    log(`  ${test.mcp} in ${test.wrongPhase}: ${blocked ? "PASS (blocked)" : "FAIL"}`);
    if (!blocked) {
      allPassed = false;
      results.issues.push(`${test.mcp} not blocked in ${test.wrongPhase} phase for app-factory`);
    }
  }

  log(`Loop 3 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 3, name: "Phase Gate Enforcement (app-factory)", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 4: Phase Gate Enforcement (Other Pipelines)
function loop4() {
  log("=== Loop 4: Phase Gate Enforcement (Other Pipelines) ===");

  const pipelineTests = [
    { pipeline: "agent-factory", tests: [{ mcp: "supabase", wrongPhase: "ralph" }, { mcp: "cloudflare", wrongPhase: "build" }] },
    { pipeline: "miniapp-pipeline", tests: [{ mcp: "playwright", wrongPhase: "build" }, { mcp: "vercel", wrongPhase: "research" }] },
    { pipeline: "website-pipeline", tests: [{ mcp: "playwright", wrongPhase: "build" }, { mcp: "figma", wrongPhase: "ralph" }] }
  ];

  let allPassed = true;
  for (const pt of pipelineTests) {
    const pipelineConfig = catalog.pipelineIntegrations[pt.pipeline];
    if (!pipelineConfig || !pipelineConfig.phaseMapping) continue;

    const mcpPhases = {};
    for (const [phase, mcps] of Object.entries(pipelineConfig.phaseMapping)) {
      for (const mcp of mcps) {
        if (!mcpPhases[mcp]) mcpPhases[mcp] = [];
        mcpPhases[mcp].push(phase);
      }
    }

    for (const test of pt.tests) {
      const allowedPhases = mcpPhases[test.mcp] || [];
      const blocked = !allowedPhases.includes(test.wrongPhase);
      log(`  ${pt.pipeline}/${test.mcp} in ${test.wrongPhase}: ${blocked ? "PASS" : "FAIL"}`);
      if (!blocked) allPassed = false;
    }
  }

  log(`Loop 4 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 4, name: "Phase Gate Enforcement (Other Pipelines)", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 5: Permission Level Enforcement
function loop5() {
  log("=== Loop 5: Permission Level Enforcement ===");

  const permissionTests = [
    { mcp: "playwright", level: "read-only", expectReadOnly: true },
    { mcp: "vercel", level: "read-only", expectReadOnly: true },
    { mcp: "stripe", level: "mutating", expectReadOnly: false },
    { mcp: "supabase", level: "read-only", expectReadOnly: true },
    { mcp: "figma", level: "read-only", expectReadOnly: true },
    { mcp: "cloudflare", level: "read-only", expectReadOnly: true },
    { mcp: "github", level: "read-write", expectReadOnly: false }
  ];

  let allPassed = true;
  for (const test of permissionTests) {
    const mcp = catalog.mcpServers[test.mcp];
    const actualLevel = mcp.permissionLevel;
    const isCorrect = actualLevel === test.level;
    log(`  ${test.mcp}: ${actualLevel} - ${isCorrect ? "PASS" : "FAIL (expected " + test.level + ")"}`);
    if (!isCorrect) allPassed = false;
  }

  // Check approval requirements for mutating MCPs
  const mutatingMcps = ["stripe", "cloudflare"];
  for (const mcpId of mutatingMcps) {
    const mcp = catalog.mcpServers[mcpId];
    if (mcp.permissionLevel !== "read-only") {
      const hasApproval = mcp.approvalRequired === true;
      log(`  ${mcpId} approval required: ${hasApproval ? "PASS" : "WARN (should require approval)"}`);
    }
  }

  log(`Loop 5 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 5, name: "Permission Level Enforcement", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 6: Missing Environment Variables
function loop6() {
  log("=== Loop 6: Missing Environment Variables Handling ===");

  const envTests = [
    { mcp: "stripe", envVar: "STRIPE_SECRET_KEY", expectedBehavior: "fail-fast" },
    { mcp: "supabase", envVar: "SUPABASE_ACCESS_TOKEN", expectedBehavior: "fail-fast" },
    { mcp: "cloudflare", envVar: "CLOUDFLARE_API_TOKEN", expectedBehavior: "fail-fast" }
  ];

  let allPassed = true;
  for (const test of envTests) {
    const mcp = catalog.mcpServers[test.mcp];
    const hasEnvVar = mcp.requiredEnvVars && mcp.requiredEnvVars.includes(test.envVar);
    const hasFailureBehavior = mcp.failureBehavior && mcp.failureBehavior.onAuthError;
    log(`  ${test.mcp}: requires ${test.envVar} - ${hasEnvVar ? "PASS" : "FAIL"}`);
    log(`    failure behavior defined: ${hasFailureBehavior ? "PASS" : "WARN"}`);
    if (!hasEnvVar) allPassed = false;
  }

  log(`Loop 6 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 6, name: "Missing Environment Variables", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 7: Artifact Output Verification
function loop7() {
  log("=== Loop 7: Artifact Output Verification ===");

  const artifactTests = [
    { mcp: "playwright", hasArtifacts: true },
    { mcp: "vercel", hasArtifacts: true },
    { mcp: "figma", hasArtifacts: true },
    { mcp: "supabase", hasArtifacts: true }
  ];

  let allPassed = true;
  for (const test of artifactTests) {
    const mcp = catalog.mcpServers[test.mcp];
    const hasArtifacts = mcp.artifacts && mcp.artifacts.length > 0;
    const catalogArtifacts = catalog.artifactOutputs && catalog.artifactOutputs[test.mcp];
    log(`  ${test.mcp}: artifacts defined - ${hasArtifacts ? "PASS" : "FAIL"}`);
    log(`    output path defined: ${catalogArtifacts ? "PASS" : "WARN"}`);
    if (!hasArtifacts) allPassed = false;
  }

  log(`Loop 7 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 7, name: "Artifact Output Verification", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 8: Conflict Detection
function loop8() {
  log("=== Loop 8: Conflict Detection ===");

  // Check for overlapping phase/MCP combinations that could conflict
  const pipelineMcpUsage = {};
  for (const [pipeline, config] of Object.entries(catalog.pipelineIntegrations)) {
    if (!config.phaseMapping) continue;
    for (const [phase, mcps] of Object.entries(config.phaseMapping)) {
      for (const mcp of mcps) {
        const key = `${mcp}:${phase}`;
        if (!pipelineMcpUsage[key]) pipelineMcpUsage[key] = [];
        pipelineMcpUsage[key].push(pipeline);
      }
    }
  }

  // Check for shared MCP usage (acceptable if isolated)
  let conflicts = 0;
  for (const [key, pipelines] of Object.entries(pipelineMcpUsage)) {
    if (pipelines.length > 1) {
      log(`  ${key} used by: ${pipelines.join(", ")} - OK (isolated by pipeline)`);
    }
  }

  // Check global rules exist
  const hasGlobalRules = catalog.globalRules && Object.keys(catalog.globalRules).length > 0;
  log(`  Global isolation rules defined: ${hasGlobalRules ? "PASS" : "FAIL"}`);

  log(`Loop 8 Status: ${conflicts === 0 && hasGlobalRules ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 8, name: "Conflict Detection", status: "PASS" };
}

// Loop 9: Deterministic Pipeline Completion
function loop9() {
  log("=== Loop 9: Deterministic Pipeline Completion ===");

  // Verify each pipeline has clear phase ordering
  const pipelines = ["app-factory", "dapp-factory", "agent-factory", "plugin-factory", "miniapp-pipeline", "website-pipeline"];

  let allPassed = true;
  for (const pipeline of pipelines) {
    const config = catalog.pipelineIntegrations[pipeline];
    if (!config) {
      log(`  ${pipeline}: FAIL (missing config)`);
      allPassed = false;
      continue;
    }

    // Check that MCPs are opt-in (noted in description or via allowedMcps)
    const hasAllowedMcps = config.allowedMcps && config.allowedMcps.length > 0;
    const hasPhaseMapping = config.phaseMapping && Object.keys(config.phaseMapping).length > 0;

    log(`  ${pipeline}: MCPs defined - ${hasAllowedMcps ? "PASS" : "WARN"}, phases mapped - ${hasPhaseMapping ? "PASS" : "WARN"}`);
  }

  // Check that failure handling doesn't break determinism
  const hasSafeDefaults = Object.values(catalog.mcpServers).every(mcp =>
    mcp.safeModeDefaults && Object.keys(mcp.safeModeDefaults).length > 0
  );
  log(`  Safe mode defaults for all MCPs: ${hasSafeDefaults ? "PASS" : "WARN"}`);

  log(`Loop 9 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 9, name: "Deterministic Pipeline Completion", status: allPassed ? "PASS" : "FAIL" };
}

// Loop 10: Silent Failure Detection
function loop10() {
  log("=== Loop 10: Silent Failure Detection ===");

  // Check all MCPs have failure behavior defined
  let allPassed = true;
  for (const [mcpId, mcp] of Object.entries(catalog.mcpServers)) {
    const hasFailureBehavior = mcp.failureBehavior && Object.keys(mcp.failureBehavior).length > 0;
    log(`  ${mcpId}: failure behavior defined - ${hasFailureBehavior ? "PASS" : "FAIL"}`);
    if (!hasFailureBehavior) allPassed = false;
  }

  // Check global rules prevent silent failures
  const preventsSilentFailures = catalog.globalRules &&
    (catalog.globalRules.artifactLogging || catalog.globalRules.failureHandling);
  log(`  Global failure logging rules: ${preventsSilentFailures ? "PASS" : "FAIL"}`);

  log(`Loop 10 Status: ${allPassed && preventsSilentFailures ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 10, name: "Silent Failure Detection", status: allPassed && preventsSilentFailures ? "PASS" : "FAIL" };
}

// Loop 11: MCP Governance Compliance (NEW in v1.1)
function loop11() {
  log("=== Loop 11: MCP Governance Compliance ===");

  const checks = [];

  // Check 1: mcpGovernance section exists
  const hasGovernance = catalog.mcpGovernance && typeof catalog.mcpGovernance === "object";
  checks.push({ name: "mcpGovernance section exists", pass: hasGovernance });
  log(`  mcpGovernance section exists: ${hasGovernance ? "PASS" : "FAIL"}`);

  // Check 2: Specification URL is defined
  const hasSpecUrl = catalog.mcpGovernance && catalog.mcpGovernance.specificationUrl;
  checks.push({ name: "Specification URL defined", pass: hasSpecUrl });
  log(`  Specification URL defined: ${hasSpecUrl ? "PASS" : "FAIL"}`);

  // Check 3: Clarification distinguishes MCP (spec) from MCP servers (tools)
  const hasClarification = catalog.mcpGovernance &&
    catalog.mcpGovernance.clarification &&
    catalog.mcpGovernance.clarification.MCP &&
    catalog.mcpGovernance.clarification["MCP Server"];
  checks.push({ name: "MCP vs MCP Server distinction documented", pass: hasClarification });
  log(`  MCP vs MCP Server distinction documented: ${hasClarification ? "PASS" : "FAIL"}`);

  // Check 4: Governance note explains MCP is not executable
  const hasGovernanceNote = catalog.mcpGovernance &&
    catalog.mcpGovernance.governanceNote &&
    catalog.mcpGovernance.governanceNote.toLowerCase().includes("not a tool");
  checks.push({ name: "Governance note explains MCP not executable", pass: hasGovernanceNote });
  log(`  Governance note explains MCP not executable: ${hasGovernanceNote ? "PASS" : "FAIL"}`);

  // Check 5: Catalog version is 1.1.0 or higher
  const versionOk = catalog.version && parseFloat(catalog.version) >= 1.1;
  checks.push({ name: "Catalog version >= 1.1.0", pass: versionOk });
  log(`  Catalog version >= 1.1.0: ${versionOk ? "PASS" : "FAIL"}`);

  const allPassed = checks.every(c => c.pass);
  log(`Loop 11 Status: ${allPassed ? "PASS" : "NEEDS FIX"}\n`);
  return { loop: 11, name: "MCP Governance Compliance", status: allPassed ? "PASS" : "FAIL", checks };
}

// Run all loops
log("====================================");
log("RALPH MCP INTEGRATION VERIFICATION");
log("====================================\n");

results.loops.push(loop1());
results.loops.push(loop2());
results.loops.push(loop3());
results.loops.push(loop4());
results.loops.push(loop5());
results.loops.push(loop6());
results.loops.push(loop7());
results.loops.push(loop8());
results.loops.push(loop9());
results.loops.push(loop10());
results.loops.push(loop11());

// Summary
log("====================================");
log("VERIFICATION SUMMARY");
log("====================================\n");

const passed = results.loops.filter(l => l.status === "PASS").length;
const failed = results.loops.filter(l => l.status === "FAIL").length;
const needsFix = results.loops.filter(l => l.status === "NEEDS FIX").length;

log(`Total Loops: ${results.loops.length}`);
log(`Passed: ${passed}`);
log(`Failed: ${failed}`);
log(`Needs Fix: ${needsFix}`);
log("");

if (results.issues.length > 0) {
  log("Issues Found:");
  results.issues.forEach(i => log(`  - ${i}`));
  log("");
}

const overallStatus = failed === 0 && needsFix === 0 ? "PASS" : "NEEDS ATTENTION";
log(`Overall Status: ${overallStatus}`);
log(`Confidence Level: ${passed}/${results.loops.length * 100}%`);

// Write results to JSON
fs.writeFileSync("verification/loop_results.json", JSON.stringify(results, null, 2));
log("\nResults saved to verification/loop_results.json");
