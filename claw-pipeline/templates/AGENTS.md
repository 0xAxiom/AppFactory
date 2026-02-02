# {{BOT_NAME}} — Agent Registry

## Primary Agent

- **Name**: {{BOT_NAME}}
- **Role**: Primary conversational agent
- **Model**: {{MODEL_PROVIDER}}
- **Status**: Active

## Sub-Agents

### Scout

- **Role**: Research and information gathering
- **Triggers**: "research", "find", "look up", "search for"
- **Capabilities**: Web browsing, API queries, data lookup
- **Status**: {{SCOUT_STATUS}}

### Builder

- **Role**: Code generation and tool creation
- **Triggers**: "build", "create", "generate", "code"
- **Capabilities**: Code writing, file creation, skill building
- **Status**: {{BUILDER_STATUS}}

### Watcher

- **Role**: Monitoring and alerts
- **Triggers**: "watch", "monitor", "alert me", "notify"
- **Capabilities**: Price watching, event monitoring, scheduled checks
- **Status**: {{WATCHER_STATUS}}

## Delegation Rules

1. Route research tasks → Scout
2. Route creation tasks → Builder
3. Route monitoring tasks → Watcher
4. All other tasks → Primary Agent
5. Sub-agents report back to Primary Agent
