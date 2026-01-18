# Factory Plugin Verification

Steps to verify that the Factory plugin is correctly installed and functioning.

---

## Prerequisites

1. Claude Code is installed and running
2. You are in the AppFactory repository

---

## Marketplace Sanity Checklist

Quick verification that the plugin meets marketplace expectations:

| Requirement | How to Verify | Status |
|-------------|---------------|--------|
| Help works | Run `/factory help` — displays commands | ☐ |
| Plan requires approval | Run `/factory run miniapp test` — blocks for approval | ☐ |
| Audit log exists | Run `/factory audit` — shows history | ☐ |
| No network by default | Check `config.default.yaml` — `offline.enabled: true` | ☐ |
| Writes confined | Check `config.default.yaml` — `output_base: ./builds` | ☐ |
| No telemetry | No external connections, no usage reporting | ☐ |

---

## Functional Verification Steps

### 1. Plugin Loads

**Test:** Verify the plugin is recognized.

**Command:**
```
/factory help
```

**Expected:** Help text displays without errors.

---

### 2. Help Works

**Test:** Verify help provides accurate documentation.

**Command:**
```
/factory help
```

**Expected:**
- All 5 commands listed (help, plan, run, ralph, audit)
- Each command has a description

---

### 3. Plan Does Not Execute

**Test:** Verify `/factory plan` only plans, doesn't write files.

**Command:**
```
/factory plan a simple hello world app
```

**Expected:**
- A structured plan is displayed
- **No files are created**
- No approval prompt appears

**Verify:**
```bash
ls ./builds/  # Should not contain new directories
```

---

### 4. Run Requires Approval

**Test:** Verify `/factory run` blocks for approval.

**Command:**
```
/factory run miniapp a counter app
```

**Expected:**
1. Plan is displayed
2. Approval prompt appears:
   ```
   Type 'approve' to proceed, 'reject' to cancel:
   ```
3. Execution blocked until response
4. Typing `reject` cancels gracefully

---

### 5. Ralph Runs

**Test:** Verify code review functions.

**Setup:**
```bash
mkdir -p ./builds/test-target
echo "console.log('hello');" > ./builds/test-target/index.js
```

**Command:**
```
/factory ralph ./builds/test-target --loops 1
```

**Expected:**
- Review loop executes
- `ralph_verdict.md` created in target directory

---

### 6. Audit Log Works

**Test:** Verify audit logging functions.

**Command:**
```
/factory audit
```

**Expected:**
- Recent commands appear with timestamps
- Each entry shows: command, status

---

## Verification Checklist

| # | Test | Status |
|---|------|--------|
| 1 | Plugin loads | ☐ |
| 2 | Help works | ☐ |
| 3 | Plan doesn't write files | ☐ |
| 4 | Run requires approval | ☐ |
| 5 | Ralph runs | ☐ |
| 6 | Audit works | ☐ |

**All 6 tests must pass.**

---

## Troubleshooting

### Plugin Not Found

**Check:**
1. Directory exists: `plugins/factory/.claude-plugin/plugin.json`
2. Plugin JSON is valid
3. Claude Code has refreshed plugin list

### Commands Fail

**Check:**
1. You are in the AppFactory repository
2. Pipeline directories exist (e.g., `miniapp-pipeline/`)

### Audit Empty

**Check:**
1. Previous commands were executed
2. Audit log directory is writable
