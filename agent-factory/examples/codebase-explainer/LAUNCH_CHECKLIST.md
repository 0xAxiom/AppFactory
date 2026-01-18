# Launch Checklist: Codebase Explainer Agent

## Pre-Launch

### Code Quality
- [ ] `npm run build` completes without errors
- [ ] `npm run typecheck` passes
- [ ] All tools tested manually
- [ ] Error handling covers edge cases

### Configuration
- [ ] `.env.example` documents all variables
- [ ] `OPENAI_API_KEY` is not committed
- [ ] Default values are sensible
- [ ] `ALLOWED_ROOTS` documented for security

### Documentation
- [ ] AGENT_SPEC.md describes architecture
- [ ] RUNBOOK.md has working commands
- [ ] TESTING.md has valid curl examples
- [ ] All endpoints documented

### Security
- [ ] Path traversal prevention tested
- [ ] File size limits enforced
- [ ] Max iterations prevent runaway
- [ ] No secrets in code or logs

---

## Launch Day

### Environment Setup
- [ ] Production environment configured
- [ ] API keys set (not in code)
- [ ] Logging configured
- [ ] Health checks enabled

### Deployment
- [ ] Build succeeds in production
- [ ] Server starts on correct port
- [ ] Health endpoint returns 200
- [ ] Test request succeeds

### Monitoring
- [ ] Logs are accessible
- [ ] Error alerts configured
- [ ] Usage metrics available

---

## Post-Launch

### Validation
- [ ] Real user queries work
- [ ] Response times acceptable
- [ ] Error rates low
- [ ] No unexpected tool failures

### Documentation
- [ ] README updated with live URL
- [ ] API documentation published
- [ ] Known limitations documented

---

## Rollback Plan

If issues occur:

1. **Immediate**: Restart the service
   ```bash
   npm run build && npm start
   ```

2. **If API issues**: Check OpenAI status and API key

3. **If all else fails**: Previous version or disable service

---

## Contacts

- **Agent Owner**: [Your team]
- **Infrastructure**: [Your ops team]
- **API Provider**: OpenAI support
