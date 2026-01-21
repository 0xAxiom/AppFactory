# App Factory Templates

**Version**: 1.0.0
**Status**: Available for Phase 0 Selection

---

## What Are Templates?

Templates are pre-configured starting points for common application types. When you describe your idea in Phase 0, Claude can suggest a relevant template that includes:

- Pre-defined file structure
- Common features for that app type
- Appropriate monetization patterns
- Relevant market research focus
- Quality expectations specific to the category

Templates **accelerate** your build by providing sensible defaults while remaining fully customizable.

---

## Available Templates

### Mobile Apps (app-factory)

| Template                                          | Description                         | Best For                                 |
| ------------------------------------------------- | ----------------------------------- | ---------------------------------------- |
| [saas-starter](./mobile/saas-starter/TEMPLATE.md) | Subscription-based productivity app | Habit trackers, task managers, note apps |
| [e-commerce](./mobile/e-commerce/TEMPLATE.md)     | Shopping and retail experience      | Stores, marketplaces, catalogs           |
| [social-app](./mobile/social-app/TEMPLATE.md)     | Community and content sharing       | Photo apps, forums, social networks      |

### dApps & Websites (dapp-factory)

| Template                                              | Description                     | Best For                           |
| ----------------------------------------------------- | ------------------------------- | ---------------------------------- |
| [defi-starter](./dapp/defi-starter/TEMPLATE.md)       | DeFi dashboard with optional AI | Portfolio trackers, analytics, DEX |
| [nft-marketplace](./dapp/nft-marketplace/TEMPLATE.md) | NFT gallery and trading         | Art marketplaces, collectibles     |

### Static Websites (website-pipeline)

| Template                                           | Description                     | Best For                         |
| -------------------------------------------------- | ------------------------------- | -------------------------------- |
| [portfolio](./website/portfolio/TEMPLATE.md)       | Professional portfolio showcase | Developers, designers, creatives |
| [saas-landing](./website/saas-landing/TEMPLATE.md) | High-converting landing page    | SaaS products, B2B services      |

### Mini Apps (miniapp-pipeline)

| Template                                               | Description             | Best For                         |
| ------------------------------------------------------ | ----------------------- | -------------------------------- |
| [social-starter](./miniapp/social-starter/TEMPLATE.md) | Social content mini app | Daily prompts, community sharing |

### AI Agents (agent-factory)

| Template                                               | Description                 | Best For                   |
| ------------------------------------------------------ | --------------------------- | -------------------------- |
| [api-integration](./agent/api-integration/TEMPLATE.md) | Multi-API integration agent | Data aggregation, webhooks |

### Claude Plugins (plugin-factory)

| Template                                              | Description         | Best For                |
| ----------------------------------------------------- | ------------------- | ----------------------- |
| [code-formatter](./plugin/code-formatter/TEMPLATE.md) | Auto-format on save | Code quality automation |

---

## How Templates Work

### Phase 0 Integration

When you describe your app idea, Claude checks for template relevance:

```
User: "I want to build a habit tracking app"

Claude (Phase 0 - Intent Normalization):
"I notice your idea aligns with our SaaS Starter template which
includes dashboard layouts, streak tracking, and subscription
monetization patterns.

Would you like me to use this template as a foundation?
(The template provides defaults - you can customize everything)"
```

### Template Selection

Templates are **suggestions**, not requirements. You can:

1. **Accept** - Use the template with customizations
2. **Decline** - Build from scratch (default pipeline behavior)
3. **Mix** - Use some template elements, skip others

### What Templates Include

Each template provides:

```
templates/<pipeline>/<template-name>/
├── TEMPLATE.md        # Template documentation
├── defaults/          # (if applicable) Default files
└── examples/          # (if applicable) Example outputs
```

---

## Template Quality Standards

All templates meet these criteria:

| Criterion     | Requirement                            |
| ------------- | -------------------------------------- |
| Documentation | Complete TEMPLATE.md with all sections |
| Customization | Clear customization points documented  |
| Quality       | Ralph expectations defined             |
| Research      | Market research focus areas identified |
| Compatibility | Works with current pipeline version    |

---

## Creating New Templates

Want to contribute a template? Follow these steps:

### 1. Choose a Category

Templates should address a common use case with:

- At least 10% of builds could use it
- Distinct features from existing templates
- Clear value proposition

### 2. Create the Structure

```bash
mkdir -p templates/<pipeline>/<template-name>
touch templates/<pipeline>/<template-name>/TEMPLATE.md
```

### 3. Document the Template

Your TEMPLATE.md must include:

1. **Header** - Pipeline, category, complexity
2. **Description** - What the template provides
3. **Pre-Configured Features** - What's included
4. **Ideal For** - Target use cases
5. **File Structure** - Expected output structure
6. **Default Tech Stack** - Technologies used
7. **Usage** - How Claude uses it in Phase 0
8. **Customization Points** - What can be changed
9. **Quality Expectations** - Ralph checklist additions

### 4. Submit

Create a PR with your template to the AppFactory repository.

---

## Template Versioning

Templates follow semantic versioning:

- **Major** (1.0 -> 2.0): Breaking changes to structure
- **Minor** (1.0 -> 1.1): New features, backward compatible
- **Patch** (1.0.0 -> 1.0.1): Bug fixes, documentation

Current versions:

| Template               | Version | Last Updated |
| ---------------------- | ------- | ------------ |
| mobile/saas-starter    | 1.0.0   | 2026-01-20   |
| mobile/e-commerce      | 1.0.0   | 2026-01-20   |
| mobile/social-app      | 1.0.0   | 2026-01-20   |
| dapp/defi-starter      | 1.0.0   | 2026-01-20   |
| dapp/nft-marketplace   | 1.0.0   | 2026-01-20   |
| website/portfolio      | 1.0.0   | 2026-01-20   |
| website/saas-landing   | 1.0.0   | 2026-01-20   |
| miniapp/social-starter | 1.0.0   | 2026-01-20   |
| agent/api-integration  | 1.0.0   | 2026-01-20   |
| plugin/code-formatter  | 1.0.0   | 2026-01-20   |

---

## Future Templates (Planned)

See [ROADMAP.md](../ROADMAP.md) for planned templates:

### Mobile

- Health/fitness tracker
- Meditation/wellness
- Language learning
- Recipe/cooking

### dApps

- DAO governance dashboard
- Token launchpad
- DEX interface

### Websites

- Documentation site
- Blog with MDX
- E-commerce storefront

### Agents

- Document analyzer
- Customer support bot
- Content generator

### Plugins

- Git workflow automation
- Code review assistant
- Documentation generator

---

**Templates** - Start faster, customize freely.
