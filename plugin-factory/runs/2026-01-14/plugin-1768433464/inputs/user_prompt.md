# User Prompt

A plugin that automatically captures every architectural decision, tradeoff, and "why we did it this way" moment from your Claude Code sessions, then makes them queryable forever.

It uses a PostToolUse hook to detect when you make significant code decisions (new files, major refactors, dependency choices) and prompts you to add a one-line "why." Then an MCP server indexes everything so any teammate (or future you) can ask "why do we use Zustand instead of Redux?" and get the actual reasoning from 6 months ago, with links to the commit.

No more "who wrote this and why?" archaeology. Your codebase finally has a memory.
