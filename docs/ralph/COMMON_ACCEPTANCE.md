# Common Acceptance Criteria for Pipeline Polish

A pipeline is considered "polished" when ALL of the following are true:

---

## Documentation Quality

### README.md

- [ ] **What It Is** - First paragraph explains the pipeline purpose
- [ ] **Who It's For** - Target audience is clear
- [ ] **What It Produces** - Output artifacts are listed
- [ ] **How to Run** - Step-by-step commands that match reality
- [ ] **What You Get** - Output directory structure documented
- [ ] **Quality Gates** - Explains how quality is ensured
- [ ] **No Broken Links** - All relative links resolve to existing files
- [ ] **No Stale Names** - No references to renamed pipelines (e.g., "web3-factory")

### CLAUDE.md

- [ ] **Operating Instructions** - Clear phases/stages documented
- [ ] **Guardrails** - DO and DO NOT sections exist
- [ ] **Output Contract** - Required files/folders listed
- [ ] **Success Definition** - What "done" means
- [ ] **Version History** - At least one version entry

---

## Structural Quality

- [ ] **Folder Exists** - Pipeline directory exists at repo root
- [ ] **README Exists** - `<pipeline>/README.md` exists
- [ ] **CLAUDE.md Exists** - `<pipeline>/CLAUDE.md` exists
- [ ] **Example Exists** - At least one example or template exists (if applicable)
- [ ] **Scripts Match** - Commands in docs match actual `package.json` scripts (if applicable)

---

## Consistency

- [ ] **Pipeline Name** - Folder name matches all internal references
- [ ] **Output Directory** - Documented output dir matches actual output dir
- [ ] **Stage Names** - Quality gate names are consistent with other pipelines
- [ ] **How to Run Format** - Uses standard `cd <pipeline> && claude` pattern

---

## Verification

- [ ] **Grep Clean** - No grep hits for deprecated names in pipeline docs
- [ ] **Links Valid** - All `./` and `../` links resolve
- [ ] **Commands Runnable** - At least one key command can be executed without error

---

## Sign-off

When all criteria pass:

```
PIPELINE_POLISHED: <pipeline-name> meets all acceptance criteria.
```
