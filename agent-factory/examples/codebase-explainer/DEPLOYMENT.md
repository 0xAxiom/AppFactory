# Deployment Guide: Codebase Explainer Agent

## Local Development

```bash
npm install
cp .env.example .env
# Add OPENAI_API_KEY to .env
npm run dev
```

---

## Production Build

```bash
npm run build
npm start
```

---

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start server
CMD ["node", "dist/index.js"]
```

### Build and Run

```bash
# Build image
docker build -t codebase-explainer .

# Run container
docker run -d \
  -p 8080:8080 \
  -e OPENAI_API_KEY=sk-... \
  -e ALLOWED_ROOTS=/data \
  -v /path/to/codebases:/data:ro \
  --name codebase-explainer \
  codebase-explainer
```

---

## Docker Compose

```yaml
version: '3.8'

services:
  codebase-explainer:
    build: .
    ports:
      - '8080:8080'
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ALLOWED_ROOTS=/data
      - LOG_LEVEL=info
    volumes:
      - ./codebases:/data:ro
    healthcheck:
      test: ['CMD', 'wget', '-q', '--spider', 'http://localhost:8080/health']
      interval: 30s
      timeout: 3s
      retries: 3
    restart: unless-stopped
```

---

## Cloud Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

### Render

1. Connect GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `ALLOWED_ROOTS` (optional)

### Fly.io

```bash
# Install Fly CLI and login
fly launch

# Set secrets
fly secrets set OPENAI_API_KEY=sk-...

# Deploy
fly deploy
```

---

## Environment Configuration

### Required

| Variable         | Description              |
| ---------------- | ------------------------ |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 |

### Optional

| Variable              | Default | Description                         |
| --------------------- | ------- | ----------------------------------- |
| `PORT`                | 8080    | HTTP server port                    |
| `MAX_TOOL_ITERATIONS` | 10      | Max tool calls per request          |
| `MAX_FILE_SIZE_KB`    | 500     | Max file size to read               |
| `LOG_LEVEL`           | info    | Logging level                       |
| `ALLOWED_ROOTS`       | (all)   | Comma-separated allowed directories |

---

## Security Considerations

### Production Checklist

- [ ] `ALLOWED_ROOTS` is set to restrict access
- [ ] API key is stored securely (not in code)
- [ ] HTTPS is enabled (via reverse proxy)
- [ ] Rate limiting is configured (via reverse proxy)
- [ ] Logs don't contain sensitive data

### Recommended Architecture

```
Internet
    │
    ▼
┌─────────────┐
│   Nginx     │  (HTTPS, rate limiting)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Agent     │  (port 8080)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Codebase   │  (read-only mount)
│   Volume    │
└─────────────┘
```

---

## Monitoring

### Health Endpoint

```bash
# Liveness probe
curl http://localhost:8080/health

# Response
{"status":"ok","name":"codebase-explainer","version":"1.0.0","uptime":123.45}
```

### Logs

JSON-formatted logs for easy parsing:

```bash
# View all logs
docker logs codebase-explainer

# Filter errors
docker logs codebase-explainer 2>&1 | jq 'select(.level == "error")'

# Watch live
docker logs -f codebase-explainer
```

### Metrics to Monitor

- Request latency (from logs)
- Error rate (from logs)
- Tool call count (from response metadata)
- Container CPU/memory

---

## Scaling

### Horizontal Scaling

The agent is stateless and can be scaled horizontally:

```yaml
# docker-compose.yml
services:
  codebase-explainer:
    deploy:
      replicas: 3
```

### Load Balancing

Use a load balancer (nginx, HAProxy, cloud LB) to distribute traffic.

### Caching

Consider caching for:

- Frequently asked questions about the same codebase
- Directory listings (short TTL)

---

## Troubleshooting

### Container won't start

Check API key:

```bash
docker logs codebase-explainer
# Look for "OPENAI_API_KEY environment variable is required"
```

### Requests timeout

- Increase `MAX_TOOL_ITERATIONS`
- Use more specific questions
- Check OpenAI API status

### Permission denied on files

Mount volume as read-only:

```bash
-v /path:/data:ro
```

Ensure container user can read files.
