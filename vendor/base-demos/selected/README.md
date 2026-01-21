# Selected Templates from base/demos

This directory contains curated extractions from the upstream `base/demos` repository.

## Contents

| Directory               | Source                                                    | Purpose                  |
| ----------------------- | --------------------------------------------------------- | ------------------------ |
| `quickstart/`           | `mini-apps/templates/minikit/new-mini-app-quickstart/`    | Official MiniKit starter |
| `full-demo-reference/`  | `mini-apps/templates/minikit/mini-app-full-demo-minikit/` | Reference patterns       |
| `notifications-module/` | `mini-apps/workshops/my-simple-mini-app/`                 | Notification patterns    |

## Usage

### Quickstart Template

The `quickstart/` directory contains a ready-to-use MiniKit starter template:

```bash
# Copy to a new project
cp -r vendor/base-demos/selected/quickstart/ my-new-app/
cd my-new-app
npm install
npm run dev
```

### Notifications Module

To add notifications to your app:

1. Copy the files from `notifications-module/` to your app
2. Install dependencies: `npm install @upstash/redis`
3. Set up Upstash Redis and add environment variables
4. Add `webhookUrl` to your `minikit.config.ts`

See `notifications-module/` files for implementation details.

### Reference Patterns

The `full-demo-reference/` directory contains component patterns:

- `src/components/actions/` - SDK action examples
- `src/components/wallet/` - Wallet integration
- `src/components/providers/` - Provider setup

Use these as reference when building advanced features.

## Modifications

All modifications from upstream are documented in `MODIFICATIONS.md`.

## Updates

To refresh from upstream:

1. Delete the contents of each subdirectory
2. Re-extract from updated `_upstream/base-demos/`
3. Update `MODIFICATIONS.md` with changes
4. Update `UPSTREAM.md` with new commit SHA
