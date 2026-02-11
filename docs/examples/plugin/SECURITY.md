# Security Documentation

## Overview

This document describes the security model of the example-plugin.

## Permissions

This plugin requires **no special permissions**:

| Permission        | Required | Reason                     |
| ----------------- | -------- | -------------------------- |
| File System Read  | No       | Plugin only generates text |
| File System Write | No       | No file modifications      |
| Network Access    | No       | No external connections    |
| Shell Execution   | No       | No shell commands          |

## Data Handling

### Input Data

- User-provided name argument
- No sensitive data processed

### Output Data

- Generated greeting text
- No data persisted

### Data Storage

- No data stored locally
- No data transmitted externally

## Security Considerations

### What This Plugin Does

- Generates greeting text based on user input
- No file system access
- No network requests
- No persistent storage

### What This Plugin Does NOT Do

- Access or modify files
- Make network requests
- Store any data
- Execute shell commands
- Access environment variables

## Audit Trail

All plugin actions are logged to Claude Code's standard output.

## Contact

For security concerns, please open an issue in the App Factory repository.
