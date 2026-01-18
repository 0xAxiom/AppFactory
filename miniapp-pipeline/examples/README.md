# MiniApp Pipeline Examples

Example applications built using the miniapp-pipeline, demonstrating real-world use cases.

## Available Examples

### [commit-app](./commit-app/)

**Commit - Stake ETH on Your Goals**

An accountability app with financial stakes. Users set goals, stake crypto, and let friends verify their progress. Demonstrates:

- Complete MiniKit integration
- Wallet connection flow
- Tab-based navigation
- Form handling
- Social features (partner selection)
- Status-based UI states

**Business Model**: 5% protocol fee on forfeited stakes

**Why It's Interesting**:
- Fills a gap in the Base ecosystem (no accountability apps exist)
- Inherently sticky (money at stake)
- Viral potential (share commitments and achievements)
- Clear revenue model

---

## Example Structure

Each example follows the standard pipeline output structure:

```
example-name/
├── app/                    # The Next.js application
│   ├── app/
│   │   ├── .well-known/farcaster.json/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── minikit.config.ts
│   ├── package.json
│   └── ...
│
├── artifacts/              # Pipeline stage outputs
│   ├── inputs/
│   ├── stage01/
│   ├── stage02/
│   └── ...
│
└── README.md               # Documentation
```

---

## Running Examples

```bash
# Navigate to example
cd examples/commit-app/app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run locally
npm run dev
```

---

## Creating New Examples

To create a new example using the pipeline:

```bash
cd miniapp-pipeline
claude

# Describe your app idea to Claude
# The pipeline will generate a complete example
```

---

## Pipeline Stages Demonstrated

Each example shows outputs from all 10 pipeline stages:

| Stage | Output |
|-------|--------|
| M0 | `artifacts/inputs/normalized_prompt.md` |
| M1 | `artifacts/stage01/scaffold_plan.md` |
| M2 | `artifacts/stage02/scaffold_complete.md` |
| M3 | `artifacts/stage03/manifest_config.md` |
| M4 | `artifacts/stage04/DEPLOYMENT.md` |
| M5 | `artifacts/stage05/ACCOUNT_ASSOCIATION_TODO.md` |
| M6 | Validation via base.dev/preview |
| M7 | `artifacts/stage07/hardening_report.md` |
| M8 | `artifacts/stage08/build_validation_summary.json` |
| M9 | `artifacts/stage09/PUBLISH.md` |
| M10 | Ralph QA reports (optional) |

---

## Contributing Examples

To add a new example:

1. Build your app using the pipeline
2. Move to `examples/your-app-name/`
3. Add a comprehensive README
4. Submit a PR

Good examples should:
- Fill a real gap in the ecosystem
- Have a clear business model
- Demonstrate interesting patterns
- Include complete documentation
