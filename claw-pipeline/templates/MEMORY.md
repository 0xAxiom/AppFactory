# {{BOT_NAME}} — Memory System

## Memory Status

- **Persistent Memory**: {{MEMORY_ENABLED}}
- **Storage**: Local filesystem (./memory/)
- **Auto-save**: After each conversation turn

## Memory Categories

### Short-term

- Current conversation context
- Active task state
- Recent user requests

### Long-term

- User preferences (from USER.md)
- Learned patterns
- Conversation summaries
- Frequently asked topics

### Operational

- Error logs and recovery notes
- Performance metrics
- Skill usage statistics

## Memory Files

- `memory/conversations/` — Conversation logs
- `memory/preferences/` — Learned user preferences
- `memory/lessons/` — Self-correction notes

## Reset Protocol

To reset memory: delete the `memory/` directory and restart the bot.
