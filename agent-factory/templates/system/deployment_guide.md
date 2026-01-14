# Agent Deployment Guide

**How to deploy your AI agent to production.**

---

## Deployment Options

### Option 1: Factory Launchpad (Recommended)

The Factory Launchpad provides one-click deployment for agents.

#### Prerequisites
- Agent validated (`npm run validate` passes)
- Code pushed to GitHub
- Project metadata prepared

#### Steps
1. Push agent to GitHub
2. Wait for Factory Launchpad availability
3. Import your repository
4. Configure environment variables
5. Deploy

#### Environment Variables
Set these in the Launchpad dashboard:
- All variables from `.env.example`
- `PORT` (usually auto-configured)

---

### Option 2: Self-Hosted (Node.js)

Run the agent on any Node.js hosting platform.

#### Platforms
- **Railway** - Simple Node.js hosting
- **Render** - Free tier available
- **Fly.io** - Edge deployment
- **DigitalOcean App Platform** - Scalable
- **AWS/GCP/Azure** - Enterprise options

#### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set OPENAI_API_KEY=sk-...
```

#### Render Deployment

1. Create account at render.com
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables
6. Deploy

---

### Option 3: Docker

Build and deploy as a container.

#### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
```

#### Build and Run

```bash
# Build image
docker build -t {{agent-name}} .

# Run container
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=sk-... \
  {{agent-name}}
```

#### Docker Compose

```yaml
version: '3.8'
services:
  agent:
    build: .
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
```

---

### Option 4: Serverless (Advanced)

Deploy as serverless function (requires code modifications).

#### Vercel

Wrap HTTP server as serverless function:

```typescript
// api/process.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  // Process input...

  return res.status(200).json({ response: '...' });
}
```

#### AWS Lambda

Use AWS SAM or Serverless Framework to deploy.

---

## Environment Variables

### Required Variables

Set these in your deployment platform:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (usually auto-configured) |
| `NODE_ENV` | `production` for deployed environments |

### Agent-Specific Variables

From your `.env.example`:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Claude) |
| ... | Other agent-specific variables |

### Token Integration Variables (if enabled)

| Variable | Description |
|----------|-------------|
| `TOKEN_CONTRACT_ADDRESS` | Contract address (after launch) |

---

## Health Checks

Configure your platform to monitor the health endpoint:

```
GET /health
```

Expected response:
```json
{
  "status": "ok",
  "name": "{{agent-name}}",
  "version": "1.0.0",
  "uptime": 12345.67
}
```

### Health Check Settings
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Healthy threshold**: 2 consecutive successes
- **Unhealthy threshold**: 3 consecutive failures

---

## Scaling

### Horizontal Scaling

Most platforms support horizontal scaling:
- Railway: Adjust replica count
- Render: Enable auto-scaling
- Docker: Use orchestration (Kubernetes, Docker Swarm)

### Considerations
- Agent is stateless by default
- No shared state between instances
- Each instance needs environment variables

---

## Monitoring

### Structured Logs

The agent outputs JSON logs. Configure your platform to ingest these:

```json
{
  "timestamp": "2026-01-14T12:00:00.000Z",
  "level": "info",
  "message": "Request received",
  "context": {"method": "POST", "path": "/process"}
}
```

### Log Platforms
- **Railway**: Built-in log viewer
- **Render**: Built-in logs
- **DataDog**: Log aggregation
- **Papertrail**: Log management

### Alerting

Set up alerts for:
- High error rate (> 1% of requests)
- High latency (> 5s average)
- Health check failures
- Memory/CPU spikes

---

## Security Checklist

Before deploying to production:

- [ ] No secrets in code (use environment variables)
- [ ] Rate limiting configured (at platform level)
- [ ] CORS headers appropriate for use case
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak internal details
- [ ] HTTPS enforced (platform usually handles this)

---

## Troubleshooting

### "npm start fails"

```bash
# Check build completed
npm run build
ls dist/

# Verify entrypoint exists
node dist/index.js
```

### "Health check fails"

```bash
# Test locally
curl http://localhost:8080/health

# Check logs for startup errors
```

### "Environment variables not working"

```bash
# Verify variables are set
echo $OPENAI_API_KEY

# Check platform dashboard for typos
# Ensure no quotes around values
```

### "High latency"

- Check LLM API response times
- Enable request logging to identify slow endpoints
- Consider caching for repeated requests

---

## Cost Estimation

### Hosting Costs

| Platform | Free Tier | Paid |
|----------|-----------|------|
| Railway | $5/month credit | $0.000463/vCPU-minute |
| Render | 750 hours/month | $7/month (starter) |
| Fly.io | 3 shared VMs | $1.94/month (1GB) |

### LLM API Costs

| Provider | Model | Cost |
|----------|-------|------|
| OpenAI | GPT-4 | $30/1M input tokens |
| OpenAI | GPT-3.5 | $0.50/1M input tokens |
| Anthropic | Claude 3 | $15/1M input tokens |

Estimate monthly cost based on expected request volume.

---

## Checklist

Before deploying:

- [ ] `npm run validate` passes
- [ ] `npm run build` succeeds
- [ ] `npm start` runs without errors
- [ ] `/health` returns 200
- [ ] `/process` works with test input
- [ ] All environment variables documented
- [ ] No secrets in code
- [ ] README has deployment instructions

After deploying:

- [ ] Health check endpoint accessible
- [ ] Test request succeeds
- [ ] Logs are being collected
- [ ] Alerts configured (optional)

---

**Generated by Agent Factory v2.0**
