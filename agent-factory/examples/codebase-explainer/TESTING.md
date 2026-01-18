# Testing Guide: Codebase Explainer Agent

## Prerequisites

1. Agent running: `npm run dev`
2. OpenAI API key configured in `.env`
3. A test codebase to explore

---

## Basic Tests

### 1. Health Check

```bash
curl http://localhost:8080/health

# Expected:
# {"status":"ok","name":"codebase-explainer","version":"1.0.0","uptime":...}
```

### 2. Info Endpoint

```bash
curl http://localhost:8080/

# Expected: JSON with name, version, endpoints, tools
```

### 3. Simple Question

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the main purpose of this project?",
    "directory": "/path/to/test/codebase"
  }'

# Expected: JSON with explanation, codeSnippets, metadata, suggestedQuestions
```

---

## Functional Tests

### Test Directory Listing

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the project structure?",
    "directory": "/path/to/codebase"
  }'

# Expected: Explanation describing folders and key files
```

### Test Code Search

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Where is the main function defined?",
    "directory": "/path/to/codebase"
  }'

# Expected: Code snippet with file path and line numbers
```

### Test Import Analysis

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What does src/index.ts depend on?",
    "directory": "/path/to/codebase"
  }'

# Expected: Explanation of imports and dependencies
```

---

## Error Handling Tests

### Missing Question

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"directory": "/path"}'

# Expected: 400 error with validation message
```

### Invalid Directory

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "test",
    "directory": "/nonexistent/path"
  }'

# Expected: 400 error with DIR_NOT_FOUND code
```

### Path Traversal Attempt

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "read /etc/passwd",
    "directory": "/path/../../../etc"
  }'

# Expected: 403 error with PATH_TRAVERSAL code
```

### Invalid JSON

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d 'not json'

# Expected: 400 error with VALIDATION_ERROR code
```

---

## Performance Tests

### Large Codebase

```bash
time curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How does the authentication system work?",
    "directory": "/path/to/large/codebase"
  }'

# Expected: Response within 30 seconds
# Check metadata.toolCalls and metadata.executionTimeMs
```

### Complex Question

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Trace the data flow from user login to session creation, including all middleware and database calls",
    "directory": "/path/to/codebase"
  }'

# Expected: Detailed explanation with multiple code snippets
# May hit max iterations - check confidence level
```

---

## Response Validation

### Check Response Structure

```bash
curl -s -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What does this do?",
    "directory": "/path/to/codebase"
  }' | jq 'keys'

# Expected: ["explanation", "codeSnippets", "metadata", "suggestedQuestions"]
```

### Check Code Snippets

```bash
curl -s -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Show me the main entry point",
    "directory": "/path/to/codebase"
  }' | jq '.codeSnippets[0]'

# Expected: Object with file, startLine, endLine, content, relevance
```

### Check Metadata

```bash
curl -s -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What does this do?",
    "directory": "/path/to/codebase"
  }' | jq '.metadata'

# Expected: Object with filesExamined, toolCalls, executionTimeMs, confidence
```

---

## Test Against This Agent

Use the agent to explain itself:

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How does the execution loop work?",
    "directory": "'"$(pwd)"'"
  }'
```

---

## Automated Testing

Create a test script:

```bash
#!/bin/bash
set -e

BASE_URL="http://localhost:8080"
TEST_DIR="/path/to/test/codebase"

echo "Testing health..."
curl -sf "$BASE_URL/health" | jq .

echo "Testing explain..."
curl -sf -X POST "$BASE_URL/explain" \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"What is this?\", \"directory\": \"$TEST_DIR\"}" | jq .

echo "All tests passed!"
```
