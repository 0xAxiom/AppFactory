# Deployment Guide

This document provides deployment instructions for each pipeline's outputs.

## Table of Contents

- [Mobile Apps (app-factory)](#mobile-apps-app-factory)
- [dApps/Websites (dapp-factory)](#dappswebsites-dapp-factory)
- [AI Agents (agent-factory)](#ai-agents-agent-factory)
- [Claude Plugins (plugin-factory)](#claude-plugins-plugin-factory)
- [Base Mini Apps (miniapp-pipeline)](#base-mini-apps-miniapp-pipeline)

---

## Mobile Apps (app-factory)

### Output Location

`app-factory/builds/<app-name>/`

### Local Testing

```bash
cd app-factory/builds/<app-name>
npm install
npx expo start
```

### App Store Deployment

#### iOS (App Store)

1. **Prerequisites**:
   - Apple Developer Account ($99/year)
   - Xcode installed
   - App Store Connect setup

2. **Build for iOS**:

   ```bash
   npx expo prebuild --platform ios
   cd ios
   pod install
   open <app-name>.xcworkspace
   ```

3. **Archive and Upload**:
   - In Xcode: Product > Archive
   - Upload to App Store Connect
   - Complete App Store listing

#### Android (Google Play)

1. **Prerequisites**:
   - Google Play Developer Account ($25 one-time)
   - Android Studio installed

2. **Build for Android**:

   ```bash
   npx expo prebuild --platform android
   cd android
   ./gradlew assembleRelease
   ```

3. **Upload to Play Console**:
   - Create app in Google Play Console
   - Upload AAB file from `android/app/build/outputs/bundle/release/`
   - Complete store listing

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform all
eas submit --platform all
```

---

## dApps/Websites (dapp-factory)

### Output Location

`dapp-factory/dapp-builds/<app-name>/`

### Local Testing

```bash
cd dapp-factory/dapp-builds/<app-name>
npm install
npm run dev
# Open http://localhost:3000
```

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   cd dapp-factory/dapp-builds/<app-name>
   vercel
   ```

3. **Production Deployment**:
   ```bash
   vercel --prod
   ```

### Netlify Deployment

1. **Build the app**:

   ```bash
   npm run build
   ```

2. **Deploy**:
   ```bash
   netlify deploy --dir=.next
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t my-dapp .
docker run -p 3000:3000 my-dapp
```

---

## AI Agents (agent-factory)

### Output Location

`agent-factory/outputs/<agent-name>/`

### Local Testing

```bash
cd agent-factory/outputs/<agent-name>
npm install
npm run dev
# Test: curl http://localhost:8080/health
```

### Production Configuration

1. **Environment Variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Build for Production**:
   ```bash
   npm run build
   ```

### Cloud Deployment Options

#### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

#### Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

#### AWS Lambda (with Serverless)

```yaml
# serverless.yml
service: my-agent
provider:
  name: aws
  runtime: nodejs20.x
functions:
  api:
    handler: dist/lambda.handler
    events:
      - http:
          path: /process
          method: post
      - http:
          path: /health
          method: get
```

---

## Claude Plugins (plugin-factory)

### Output Location

`plugin-factory/builds/<plugin-name>/`

### Claude Code Plugins

1. **Copy to Your Project**:

   ```bash
   cp -r plugin-factory/builds/<plugin-name> /path/to/your/project/
   ```

2. **Verify Structure**:

   ```
   your-project/
   ├── .claude-plugin/
   │   └── plugin.json
   ├── commands/
   ├── agents/
   ├── skills/
   └── hooks/
   ```

3. **Restart Claude Code** to activate

### MCP Servers

1. **Build the Server**:

   ```bash
   cd plugin-factory/builds/<plugin-name>
   npm install
   npm run build
   ```

2. **Configure Claude Desktop**:

   Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "<plugin-name>": {
         "command": "node",
         "args": ["/path/to/plugin-factory/builds/<plugin-name>/dist/server/index.js"]
       }
     }
   }
   ```

3. **Restart Claude Desktop**

### MCPB Packaging

```bash
cd plugin-factory/builds/<plugin-name>
npm run bundle
# Outputs: dist/<plugin-name>.mcpb
```

---

## Base Mini Apps (miniapp-pipeline)

### Output Location

`miniapp-pipeline/builds/miniapps/<app-name>/app/`

### Local Testing

```bash
cd miniapp-pipeline/builds/miniapps/<app-name>/app
npm install
npm run dev
# Open http://localhost:3000
```

### Vercel Deployment

1. **Deploy to Vercel**:

   ```bash
   vercel
   ```

2. **Note Production URL**: `https://your-app.vercel.app`

### Account Association

1. **Generate Keypair** (if not done):

   ```bash
   npx @farcaster/auth-cli generate
   ```

2. **Update Manifest**:
   - Edit `minikit.config.ts` with your FID
   - Update `.well-known/farcaster.json` with signature

3. **Verify Association**:
   ```bash
   curl https://your-app.vercel.app/.well-known/farcaster.json
   ```

### Base App Publication

1. **Open Base App**:
   - Navigate to Mini Apps section
   - Select "Add Mini App"

2. **Enter URL**:
   - Enter your Vercel production URL
   - Verify manifest loads correctly

3. **Submit for Review**:
   - Complete app metadata
   - Submit for Base review

### Checklist

- [ ] Vercel deployment successful
- [ ] Account association verified
- [ ] Manifest route returns valid JSON
- [ ] Icon and splash images uploaded
- [ ] Screenshots captured
- [ ] App tested in Base simulator

---

## General Deployment Tips

### Environment Variables

- Never commit `.env` files
- Use `.env.example` as a template
- Set environment variables in deployment platform

### Domain Configuration

1. **Custom Domain**:
   - Add domain in deployment platform
   - Update DNS records
   - Enable HTTPS

2. **Environment-Specific URLs**:

   ```bash
   # Production
   NEXT_PUBLIC_API_URL=https://api.example.com

   # Staging
   NEXT_PUBLIC_API_URL=https://staging-api.example.com
   ```

### Monitoring

- Set up error tracking (Sentry, LogRocket)
- Configure uptime monitoring
- Enable application logging

### Security Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] No secrets in client-side code
