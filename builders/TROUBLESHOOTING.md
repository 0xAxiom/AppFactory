# Troubleshooting Guide - App Factory

**Version**: 1.0  
**Purpose**: Common issues and solutions for App Factory pipeline execution  

## Quick Diagnostics

### First Steps for Any Issue
```bash
# 1. Run the system check
./bin/appfactory doctor

# 2. Check verbose mode for more details  
./bin/appfactory run my-app --verbose

# 3. Check recent logs
find runs/ -name "*_claude.stdout.log" -exec tail -10 {} \;
```

---

## Claude CLI Issues

### Problem: Claude CLI not found
**Error Message**: `Claude CLI not found in PATH`

**Diagnosis**:
```bash
which claude
claude --version
```

**Solutions**:
1. **Install Claude CLI** from Anthropic:
   ```bash
   # Visit: https://docs.anthropic.com/claude/docs/claude-cli
   # Follow platform-specific installation instructions
   ```

2. **Add to PATH** if installed but not found:
   ```bash
   # Find Claude binary
   find /usr/local /opt /usr /home -name "claude" 2>/dev/null
   
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export PATH="/path/to/claude/bin:$PATH"
   ```

3. **Verify installation**:
   ```bash
   claude --version
   claude auth status
   ```

### Problem: Claude authentication failed  
**Error Message**: `Authentication failed` or `API key invalid`

**Diagnosis**:
```bash
claude auth status
claude auth list-keys
```

**Solutions**:
1. **Re-authenticate**:
   ```bash
   claude auth logout
   claude auth login
   ```

2. **Verify API access**:
   ```bash
   claude test-connection
   ```

3. **Check organization access** (if using team Claude):
   - Verify your account has access to Claude API
   - Contact your organization admin if needed

### Problem: Claude timeout
**Error Message**: `Timeout after X seconds`

**Diagnosis**: Long-running stage operations hitting timeout limit

**Solutions**:
1. **Increase timeout globally**:
   ```bash
   export APPFACTORY_CLAUDE_ARGS="--timeout=300"
   ./bin/appfactory run my-app
   ```

2. **Increase timeout for specific command**:
   ```bash
   ./bin/appfactory run my-app --timeout=300
   ```

3. **Check network connectivity**:
   ```bash
   ping claude.ai
   curl -I https://api.anthropic.com/
   ```

4. **Try during off-peak hours** if network congestion is suspected

---

## Pipeline Parsing Issues

### Problem: File parsing failed
**Error Message**: `Failed to parse Claude output` or `Missing file block for: spec/file.md`

**Diagnosis**: Claude output doesn't contain required file delimiters

**Investigation**:
```bash
# Check the raw Claude output
find runs/ -name "*_claude.stdout.log" -exec cat {} \;

# Look for delimiter format issues
grep -n "===FILE:" runs/*/outputs/*_claude.stdout.log
grep -n "===END FILE===" runs/*/outputs/*_claude.stdout.log
```

**Solutions**:
1. **Verify delimiter format** in Claude output:
   - Must be exactly: `===FILE: spec/filename.md===`
   - Must end with: `===END FILE===`
   - No spaces or variations allowed

2. **Repair prompt triggered automatically** - pipeline will attempt repair
   
3. **Manual intervention** if repair fails:
   - Edit the stage template to be more explicit about delimiter requirements
   - Add example output format to template

### Problem: File validation failed
**Error Message**: `File missing or empty` or validation errors

**Diagnosis**: Files created but don't meet quality requirements

**Investigation**:
```bash
# Check file sizes and content
find runs/*/spec/ -name "*.md" -exec wc -l {} \;

# Check for required sections
grep -n "## " runs/*/spec/*.md
```

**Solutions**:
1. **Review content quality** - files may be too short or missing sections
2. **Repair loop activated** - pipeline will attempt to fix missing content
3. **Manual review** of generated content for completeness

---

## Stub Mode Usage (CI/Testing)

### Problem: Stuck in stub mode
**Error Message**: Running in stub mode when real Claude expected

**Diagnosis**: 
```bash
echo $APPFACTORY_CLAUDE_MODE
echo $APPFACTORY_TEST_MODE
```

**Solutions**:
1. **Clear stub mode environment**:
   ```bash
   unset APPFACTORY_CLAUDE_MODE
   unset APPFACTORY_TEST_MODE
   ./bin/appfactory run my-app
   ```

2. **Force real mode explicitly**:
   ```bash
   APPFACTORY_CLAUDE_MODE=real ./bin/appfactory run my-app
   ```

### Problem: Need to run in stub mode
**Use Case**: CI/testing environments without Claude access

**Solutions**:
1. **Enable stub mode**:
   ```bash
   export APPFACTORY_CLAUDE_MODE=stub
   ./bin/appfactory run my-app
   ```

2. **Run test suite**:
   ```bash
   APPFACTORY_TEST_MODE=1 ./scripts/test_cli.sh
   ```

**Important**: Stub mode generates synthetic content for testing only. Quality does not reflect real Claude output.

---

## Permission Issues

### Problem: Permission denied errors
**Error Message**: `Permission denied` when writing files

**Diagnosis**:
```bash
# Check write permissions in project directory
touch runs/test-write && rm runs/test-write

# Check config directory permissions  
ls -la ~/.config/appfactory/
```

**Solutions**:
1. **Fix project permissions**:
   ```bash
   chmod -R u+w runs/
   chmod -R u+w .
   ```

2. **Create config directory** if missing:
   ```bash
   mkdir -p ~/.config/appfactory
   mkdir -p ~/.local/share/appfactory  
   mkdir -p ~/.cache/appfactory
   ```

3. **Run as proper user** (avoid sudo unless necessary)

### Problem: Disk space issues
**Error Message**: `No space left on device`

**Diagnosis**:
```bash
df -h .
du -sh runs/
```

**Solutions**:
1. **Clean old runs**:
   ```bash
   ./bin/appfactory clean --all-runs
   ```

2. **Remove large log files**:
   ```bash
   find runs/ -name "*.log" -size +10M -delete
   ```

---

## Resume and State Issues

### Problem: Cannot resume run
**Error Message**: `No active run found` or `Run directory corrupted`

**Diagnosis**:
```bash
# Check active run state
cat ~/.config/appfactory/active_run.json 2>/dev/null || echo "No active run"

# Check run directories
ls -la runs/*/
```

**Solutions**:
1. **Clear corrupted state**:
   ```bash
   rm -f ~/.config/appfactory/active_run.json
   ```

2. **Manually specify run to resume**:
   ```bash
   ./bin/appfactory status
   # Then copy run path and resume specific run
   ```

3. **Start fresh run** if resume not critical:
   ```bash
   ./bin/appfactory run new-project
   ```

### Problem: Stage completion detection failed
**Error Message**: Stage marked incomplete when files exist

**Diagnosis**:
```bash
# Check stage completion markers
find runs/*/outputs/ -name "*.exitcode"

# Verify file quality
find runs/*/spec/ -name "*.md" -exec wc -l {} \;
```

**Solutions**:
1. **Re-validate stage outputs**:
   ```bash
   # Pipeline will re-check all prior stages on resume
   ./bin/appfactory status
   ```

2. **Manual stage validation**:
   - Check file line counts meet minimums
   - Verify required sections present
   - Ensure files are not corrupted

---

## Performance Issues

### Problem: Very slow execution
**Symptoms**: Stages taking much longer than expected

**Diagnosis**:
```bash
# Check system resources
top
df -h
free -h  # Linux
vm_stat  # macOS
```

**Solutions**:
1. **Check network connectivity**:
   ```bash
   ping claude.ai
   curl -w "@-" -o /dev/null -s https://api.anthropic.com/ <<< "time_total: %{time_total}"
   ```

2. **Disable streaming mode** if terminal is slow:
   ```bash
   APPFACTORY_STREAM_OUTPUT=false ./bin/appfactory run my-app
   ```

3. **Run during off-peak hours** for better API response times

### Problem: Memory usage issues
**Symptoms**: System slowdown, swap usage

**Solutions**:
1. **Clean old run data**:
   ```bash
   ./bin/appfactory clean --all-runs
   ```

2. **Monitor memory during runs**:
   ```bash
   # Run in background and monitor
   ./bin/appfactory run my-app &
   watch "ps aux | grep -E '(claude|appfactory)'"
   ```

---

## Development and Testing

### Problem: Template changes not taking effect
**Symptoms**: Output doesn't reflect template modifications

**Diagnosis**:
```bash
# Verify template file timestamps
ls -la templates/agents/
find templates/ -name "*.md" -newer run/*/spec/
```

**Solutions**:
1. **Clear any cached data**:
   ```bash
   rm -rf ~/.cache/appfactory/
   ```

2. **Verify template syntax**:
   - Check for proper delimiter formatting
   - Ensure no syntax errors in prompts

3. **Run with fresh project name** to avoid resume logic

### Problem: Test failures in CI
**Error**: Tests failing in automated environments

**Diagnosis**:
```bash
# Check test mode environment  
APPFACTORY_DEBUG=true ./scripts/test_cli.sh
```

**Solutions**:
1. **Ensure proper test environment**:
   ```bash
   export APPFACTORY_TEST_MODE=1
   export APPFACTORY_CLAUDE_MODE=stub
   ./scripts/test_cli.sh
   ```

2. **Check for timing issues** in CI:
   - Add delays if filesystem operations are slow
   - Verify all temp files are properly cleaned

3. **Review test logs** for specific failure points:
   ```bash
   find . -name "*test*.log" -exec cat {} \;
   ```

---

## Emergency Recovery

### Problem: Pipeline completely broken
**Symptoms**: No commands work, errors everywhere

**Nuclear Option - Complete Reset**:
```bash
# 1. Stop all running processes
pkill -f appfactory
pkill -f claude

# 2. Clear all state  
rm -rf runs/*
rm -f ~/.config/appfactory/active_run.json
rm -rf ~/.cache/appfactory/

# 3. Reset environment
unset APPFACTORY_CLAUDE_MODE
unset APPFACTORY_TEST_MODE  
unset APPFACTORY_DEBUG

# 4. Verify system health
./bin/appfactory doctor

# 5. Test with simple run
./bin/appfactory run fresh-start
```

### Problem: Need support
**When to seek help**: After trying the above solutions

**Information to gather**:
```bash
# 1. System information
uname -a
./bin/appfactory doctor

# 2. Error logs  
find runs/ -name "*.log" -exec tail -20 {} \;

# 3. Environment
env | grep APPFACTORY
which claude
claude --version
```

**Where to get help**:
- GitHub Issues: [repository]/issues
- Check existing documentation: BUILDERS/ folder
- Review error messages for specific guidance

---

## Prevention

### Best Practices to Avoid Issues
1. **Always run doctor check** before major operations
2. **Use descriptive project names** to avoid conflicts  
3. **Don't interrupt running stages** - let them complete
4. **Keep Claude CLI updated** to latest version
5. **Monitor disk space** in CI environments
6. **Use stub mode for testing** pipeline logic
7. **Clear old runs periodically** to free space

### Regular Maintenance
```bash
# Weekly cleanup
./bin/appfactory clean --older-than=7d

# Monthly full cleanup  
./bin/appfactory clean --all-runs

# Update dependencies
claude update  # if available

# Test pipeline health
./scripts/test_cli.sh
```

---

**Last Updated**: 2026-01-06  
**Version**: 1.0