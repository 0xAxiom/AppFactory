# Factory Plugin Invariants

These are behavioral guarantees that cannot be bypassed by configuration, command flags, or user instructions.

---

## 1. No Silent Execution

**Guarantee:** Factory never performs work without first showing you what it will do.

**What this means:**

- Every execution shows a detailed plan first
- Every file to be created is listed before creation
- You always see what will happen before it happens

---

## 2. Mandatory Approval

**Guarantee:** All executions require your explicit approval.

**What this means:**

- You must type `approve` to proceed
- There is no `--yes`, `--force`, or `--skip-approval` flag
- No configuration option can disable approval
- Timeout cancels the operation; it does not auto-approve

---

## 3. Confined File Writes

**Guarantee:** Factory only writes files to designated locations.

**What this means:**

- Generated artifacts go to `./builds/` directory
- Code review verdicts go to the directory being reviewed
- Factory does not modify files elsewhere in your repository
- Factory does not write files outside the current repository

---

## 4. Network-Enabled with Explicit Authorization

**Guarantee:** Network access is available, but never used without explicit user authorization.

**What this means:**

- Network-capable tools remain gated behind approval
- Templates are read locally unless a user approves external fetches
- URLs in output are references only—not fetched automatically
- No background or implicit network activity

---

## 5. No Telemetry

**Guarantee:** Factory does not collect or transmit any data.

**What this means:**

- No usage analytics
- No error reporting to external services
- No data leaves your machine
- Audit logs are local-only

---

## 6. Full Audit Trail

**Guarantee:** Every Factory action is logged locally.

**What this means:**

- Commands you run are recorded
- Approval decisions are recorded
- Execution outcomes are recorded
- You can review history with `/factory audit`

---

## 7. User Input Is Data

**Guarantee:** Your ideas and descriptions are processed as data, not as instructions.

**What this means:**

- "Build a meditation app" is treated as a description
- Embedded instructions like "ignore previous" are not followed
- Only Factory's defined commands control its behavior

---

## 8. Error Transparency

**Guarantee:** Factory shows all errors without hiding them.

**What this means:**

- Failures are reported with error codes
- Partial results are shown, not discarded
- Recovery suggestions are provided when available

---

## Version

Current version: **1.0.0**

These invariants apply to Factory v1.x.
