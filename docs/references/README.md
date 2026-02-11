# AppFactory Reference Documentation

This directory contains reference documentation for frameworks, libraries, and integrations used by AppFactory pipelines.

## Contents

### MCP Servers (`/mcp-servers/`)

Model Context Protocol server documentation and integration guides.

- `essential-servers.md` - Tier 1/2/3 MCP server recommendations
- `supabase.md` - Supabase MCP integration
- `playwright.md` - Playwright MCP for browser testing
- `figma.md` - Figma MCP for design-to-code

### Frameworks (`/frameworks/`)

Current framework documentation:

- `expo-sdk-53.md` - Expo SDK 53+ (React Native)
- `nextjs-15.md` - Next.js 15+ (Web)
- `tailwind-v4.md` - Tailwind CSS v4
- `shadcn-ui.md` - shadcn/ui component library
- `vercel-ai-sdk-6.md` - Vercel AI SDK 6

### AI Agents (`/ai-agents/`)

AI agent framework documentation:

- `claude-api-tools.md` - Claude API Tool Use
- `langgraph.md` - LangGraph workflows
- `crewai.md` - CrewAI agent teams
- `rig-framework.md` - Rig production framework

### Web3 (`/web3/`)

Web3 integration documentation:

- `solana-wallet-adapter.md` - Solana Wallet Adapter
- `base-minikit.md` - Base MiniKit
- `farcaster-frames.md` - Farcaster Frames

## Usage

These references are designed to:

1. **Inform Claude** - Provide accurate, up-to-date information during code generation
2. **Guide developers** - Serve as quick reference for AppFactory users
3. **Reduce hallucination** - Ensure generated code uses current APIs

## Keeping References Updated

These references should be updated when:

1. Major framework versions are released
2. New MCP servers become essential
3. Best practices change significantly
4. Security advisories affect recommendations

## Contributing

When updating references:

1. Verify information against official documentation
2. Include version numbers and dates
3. Note breaking changes from previous versions
4. Test code examples when possible

## Version

Last updated: January 2026
