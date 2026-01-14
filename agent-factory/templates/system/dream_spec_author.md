# Dream Spec Author - Agent Factory

**Purpose:** Guide Claude to write comprehensive agent specifications before generating code.

---

## When to Use

After Intent Normalization, Claude writes a Dream Spec that captures:
- Complete agent vision
- All capabilities and endpoints
- Input/output contracts
- Safety rules and constraints
- Success criteria

---

## Required Sections

### 1. Agent Vision

Write one paragraph that captures:
- What the agent does
- Who it's for
- The problem it solves
- Core value proposition

**Example:**
> "YouTube Summarizer is a REST API agent that transforms long-form video content into concise, actionable summaries. It accepts video URLs, extracts transcripts via the YouTube API, and uses LLM inference to generate structured summaries with key points, timestamps, and takeaways. Designed for developers building content aggregation tools, research assistants, or productivity apps."

### 2. Core Capabilities

Bulleted list of must-have functionality. Be specific.

**Format:**
```markdown
- **Capability**: What it does, how it works
```

**Example:**
```markdown
- **URL Processing**: Accepts YouTube video URLs, validates format, extracts video ID
- **Transcript Extraction**: Retrieves video transcript via YouTube Data API
- **Summary Generation**: Uses LLM to create structured summary with configurable length
- **Key Points Extraction**: Identifies and lists main takeaways with timestamps
- **Error Recovery**: Handles missing transcripts, rate limits, invalid URLs gracefully
```

### 3. Input/Output Contract

Define exactly what the agent accepts and returns.

**Format:**
```markdown
#### Input
```json
{
  "input": "string (required) - The user request or URL",
  "context": {
    "maxLength": "number (optional) - Max summary length",
    "format": "string (optional) - Output format"
  }
}
```

#### Output
```json
{
  "response": "string - The generated summary",
  "metadata": {
    "videoId": "string - YouTube video ID",
    "duration": "number - Processing time in ms",
    "wordCount": "number - Summary word count"
  }
}
```
```

### 4. Tool Definitions

If the agent uses tools/functions, define them with Zod-style schemas.

**Format:**
```markdown
#### Tool: extract_transcript
- **Purpose**: Fetch video transcript from YouTube
- **Parameters**:
  - `videoId`: string (required) - YouTube video ID
  - `language`: string (optional) - Preferred language code
- **Returns**: string - Full transcript text
- **Errors**: TRANSCRIPT_NOT_FOUND, RATE_LIMITED, INVALID_VIDEO

#### Tool: generate_summary
- **Purpose**: Create summary from transcript
- **Parameters**:
  - `transcript`: string (required) - Full transcript
  - `maxLength`: number (optional) - Target word count
  - `format`: enum['bullets', 'paragraph', 'structured']
- **Returns**: object - Summary with key points
```

### 5. Error Handling

Define how the agent handles failures.

**Categories:**
- **Validation Errors** (400): Invalid input, missing fields
- **Processing Errors** (500): LLM failures, API timeouts
- **External Errors** (502): Third-party API failures

**Example:**
```markdown
| Error Code | HTTP | Message | Recovery |
|------------|------|---------|----------|
| VALIDATION_ERROR | 400 | Missing input field | Return clear message |
| INVALID_URL | 400 | Not a valid YouTube URL | Suggest correct format |
| TRANSCRIPT_NOT_FOUND | 404 | Video has no transcript | Suggest alternatives |
| RATE_LIMITED | 429 | Too many requests | Return retry-after header |
| LLM_FAILURE | 500 | Summary generation failed | Retry with backoff |
| EXTERNAL_API_ERROR | 502 | YouTube API unavailable | Return cached or error |
```

### 6. Safety Rules

Define what the agent must never do.

**Example:**
```markdown
#### Never Do
- Never reveal API keys or secrets in responses
- Never generate harmful, illegal, or offensive content
- Never store user data beyond request lifecycle
- Never make requests to non-allowlisted domains
- Never execute arbitrary code from user input

#### Rate Limits
- Max 100 requests per minute per IP
- Max 10,000 tokens per request
- Max 5 concurrent requests

#### Input Sanitization
- Strip HTML/scripts from all string inputs
- Validate URLs against allowlist patterns
- Reject payloads over 1MB
```

### 7. Environment Variables

List all required and optional configuration.

**Format:**
```markdown
#### Required
| Variable | Description | Example |
|----------|-------------|---------|
| OPENAI_API_KEY | OpenAI API key for inference | sk-... |
| YOUTUBE_API_KEY | YouTube Data API key | AIza... |

#### Optional
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| DEBUG | Enable debug logging | false |
| MAX_TOKENS | Max tokens per request | 4000 |
```

### 8. Token Integration

Yes or No, and what it enables.

**If No:**
```markdown
#### Token Integration: No
Standard HTTP agent without blockchain features.
```

**If Yes:**
```markdown
#### Token Integration: Yes

**Features Enabled:**
- Token-gated premium endpoints
- Usage-based token rewards
- Balance checking for access control

**Environment Variables:**
- TOKEN_CONTRACT_ADDRESS: Contract address (after launch)

**Endpoints Added:**
- GET /token/balance?address=X - Check token balance
- POST /token/verify - Verify token access
```

### 9. Deployment Strategy

How the agent will be deployed and run.

**Example:**
```markdown
#### Local Development
```bash
npm install
npm run dev
# Server starts on http://localhost:8080
```

#### Production Deployment
- **Platform**: Docker container or Node.js hosting
- **Port**: 8080 (configurable via PORT env)
- **Health Check**: GET /health returns 200
- **Graceful Shutdown**: Handles SIGTERM/SIGINT

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8080
CMD ["node", "dist/index.js"]
```
```

### 10. Success Criteria

Define what "done" looks like.

**Format:**
- Functional criteria (what works)
- Quality criteria (how well it works)
- Technical criteria (build/run requirements)

**Example:**
```markdown
#### Functional
- [ ] POST /process accepts video URL and returns summary
- [ ] GET /health returns status with uptime
- [ ] Error responses include code and message
- [ ] Invalid inputs return 400 with details

#### Quality
- [ ] Response time < 5s for average video
- [ ] Structured JSON logging on all requests
- [ ] Graceful handling of YouTube API failures
- [ ] Clear error messages for users

#### Technical
- [ ] `npm install` completes without errors
- [ ] `npm run build` compiles TypeScript
- [ ] `npm run dev` starts server on port 8080
- [ ] `npm run validate` passes Factory Ready check
```

---

## Output Location

```
runs/YYYY-MM-DD/agent-<timestamp>/
└── inputs/
    └── dream_spec.md
```

---

## Quality Bar

A good Dream Spec:
- Is specific enough to build from
- Includes concrete examples
- Defines clear boundaries and contracts
- Anticipates error cases
- Matches the normalized intent

A bad Dream Spec:
- Uses vague language ("handles errors well")
- Leaves endpoints undefined
- Skips security considerations
- Doesn't match the intent

---

## Template

```markdown
# Dream Spec: {{AGENT_NAME}}

## 1. Agent Vision

[One paragraph describing the agent]

## 2. Core Capabilities

- **Capability 1**: Description
- **Capability 2**: Description
- **Capability 3**: Description

## 3. Input/Output Contract

#### Input
```json
{
  "input": "string - description",
  "context": {}
}
```

#### Output
```json
{
  "response": "string - description",
  "metadata": {}
}
```

## 4. Tool Definitions

#### Tool: tool_name
- **Purpose**: What it does
- **Parameters**: List params
- **Returns**: Return type
- **Errors**: Possible errors

## 5. Error Handling

| Error Code | HTTP | Message | Recovery |
|------------|------|---------|----------|
| | | | |

## 6. Safety Rules

#### Never Do
- Rule 1
- Rule 2

#### Rate Limits
- Limit 1
- Limit 2

## 7. Environment Variables

#### Required
| Variable | Description |
|----------|-------------|
| | |

#### Optional
| Variable | Description | Default |
|----------|-------------|---------|
| | | |

## 8. Token Integration

[Yes/No and details]

## 9. Deployment Strategy

[Local, Docker, cloud instructions]

## 10. Success Criteria

#### Functional
- [ ] Criterion 1
- [ ] Criterion 2

#### Quality
- [ ] Criterion 1
- [ ] Criterion 2

#### Technical
- [ ] npm install works
- [ ] npm run build works
- [ ] npm run dev works
- [ ] npm run validate passes
```

---

**Use this guide to write comprehensive specs before any code is generated.**
