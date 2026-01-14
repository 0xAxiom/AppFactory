# Factory Implementation Checklist

## Scope: Local Tooling Only

This repo contains LOCAL-ONLY tools. The hosted platform (factoryapp.dev) is in a separate repository.

---

## What's In This Repo

### Agent Constitution (Complete)
- [x] `CLAUDE.md` - Agent constitution for prompt generation
- [x] Agent reads templates, substitutes variables, writes output files
- [x] Agent asks about token integration (optional)
- [x] No CLI required for generation

### Templates (Complete)
- [x] `generator/templates/build_prompt.hbs` - Build instructions (with token conditionals)
- [x] `generator/templates/checklist.hbs` - Verification checklist (with token conditionals)
- [x] `generator/templates/token_spec.hbs` - Token integration spec (optional)
- [x] `generator/templates/frontend_spec.hbs` - UI guidelines

### Validator (Complete)
- [x] `validator/index.ts` - Entrypoint for `npm run validate` (REQUIRED)
- [x] `validator/zip.ts` - Entrypoint for `npm run zip` (REQUIRED)
- [x] Enforces ZIP_CONTRACT.md v2.0
- [x] Auto-detects token integration
- [x] Conditional wallet validation (only if Solana deps present)
- [x] Clear pass/fail output
- [x] Points to factoryapp.dev for upload

### ZIP Contract (Complete)
- [x] `ZIP_CONTRACT.md` v2.0 - Source of truth for valid builds
- [x] Required files list
- [x] Core dependencies (next, react, react-dom)
- [x] Optional Solana dependencies (for token-enabled apps)
- [x] Forbidden files/patterns
- [x] Size limits

### Documentation (Complete)
- [x] `README.md` - Clear agent-first scope
- [x] `ARCHITECTURE.md` - System boundary diagram
- [x] `IMPLEMENTATION_CHECKLIST.md` - This file

---

## What's NOT In This Repo

These belong on factoryapp.dev (separate repository):

- [ ] Upload page
- [ ] Metadata form
- [ ] Wallet connection for launch
- [ ] Token creation API
- [ ] Transaction preparation
- [ ] Vercel deployment
- [ ] Showcase page
- [ ] Database

---

## User Flow

```
1. Open web3-factory/ in Claude Code or Cursor
2. Describe app idea
3. Agent asks: "Do you want token integration?"
4. Agent generates prompts based on choice
5. Build app using generated prompts in your AI tool
6. npm run validate (REQUIRED)
7. npm run zip (REQUIRED)
8. Upload at: https://factoryapp.dev/launch
9. If tokens enabled: Add contract address to .env after launch
```

---

## Version History

### v4.0 (2026-01-13)
- Made token integration optional
- Agent asks user about token choice
- Templates use Handlebars conditionals
- Validator auto-detects token integration
- Removed all "Bags" references
- Updated ZIP_CONTRACT to v2.0

### v3.1 (2026-01-12)
- Initial agent-first architecture
- Solana dependencies required

---

## Deprecated

The following directories contain legacy code and will be removed in future cleanup:
- `deprecated/platform-v1/`
- `scripts/`
- `pipeline/`
- `docs/bags_*.md`

---

**Last Updated:** 2026-01-13
