# {{BOT_NAME}} — Tools & Skills

## Built-in Skills

{{BUILTIN_SKILLS_LIST}}

## Custom Skills

{{CUSTOM_SKILLS_LIST}}

## Platform Integrations

{{PLATFORM_INTEGRATIONS}}

## MCP Servers

_Configure additional MCP servers in the bot's config for extended capabilities._

## Adding New Skills

1. Create a new `.ts` file in `src/skills/`
2. Export a skill object implementing the OpenClaw Skill interface
3. Register the skill in `config/skills.config.ts`
4. Restart the bot
