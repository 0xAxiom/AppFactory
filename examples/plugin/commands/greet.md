---
name: greet
description: Send a friendly greeting to someone
arguments:
  - name: name
    description: The name of the person to greet
    required: false
    default: 'friend'
---

# Greet Command

Generate a friendly, personalized greeting for the specified person.

## Instructions

1. If a name is provided, use it in the greeting
2. If no name is provided, use "friend" as the default
3. Be warm, friendly, and enthusiastic
4. Keep the greeting concise (1-2 sentences)

## Example Outputs

For `/greet Alice`:

> Hello, Alice! Wonderful to see you here today.

For `/greet`:

> Hey there, friend! Great to have you here.

## Response Format

Respond with just the greeting, no additional explanation or formatting needed.
