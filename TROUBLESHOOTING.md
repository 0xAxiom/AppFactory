# Troubleshooting Guide

Common issues and solutions for App Factory.

## 🚀 Installation Issues

### Node.js Version Issues

**Problem**: `Error: Node.js version 16.x.x is not supported`

**Solution**:

```bash
# Check your Node.js version
node --version

# Install Node.js 18+ using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### Permission Errors

**Problem**: `EACCES: permission denied` during npm install

**Solution**:

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Bootstrap Failures

**Problem**: `npm run bootstrap` fails

**Solution**:

```bash
# Clean and reinstall
npm run clean
npm ci
npm run bootstrap:subprojects

# If still failing, try individual components
cd CLI && npm ci
cd ../dapp-factory && npm ci
cd ../plugin-factory/examples/mcp-server && npm ci
```

## 🔧 Build Issues

### TypeScript Compilation Errors

**Problem**: TypeScript compilation fails

**Solution**:

```bash
# Check TypeScript version
npx tsc --version

# Rebuild type definitions
npm run clean
npm ci
npm run type-check

# For specific modules
cd CLI && npx tsc --noEmit
cd dapp-factory && npx tsc --noEmit
```

### ESLint Configuration Issues

**Problem**: ESLint fails with configuration errors

**Solution**:

```bash
# Reset ESLint cache
npx eslint --cache-location .eslintcache --fix .

# Update ESLint config
npm run lint:fix

# Check for conflicting configurations
find . -name ".eslintrc*" -not -path "./node_modules/*"
```

## 📱 App Factory (Mobile) Issues

### Expo CLI Issues

**Problem**: `expo: command not found`

**Solution**:

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Or use npx
npx expo --version
```

### Metro Bundler Issues

**Problem**: Metro bundler fails to start

**Solution**:

```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache manually
rm -rf .expo
rm -rf node_modules
npm ci
```

### iOS Simulator Issues

**Problem**: iOS app won't load in simulator

**Solution**:

```bash
# Reset iOS simulator
xcrun simctl erase all

# Check Xcode installation
xcode-select --print-path

# Install iOS simulator
xcodebuild -downloadPlatform iOS
```

## 🌐 dApp Factory (Web3) Issues

### Web3 Connection Issues

**Problem**: Cannot connect to blockchain

**Solution**:

```bash
# Check network configuration
export RPC_URL="https://mainnet.infura.io/v3/YOUR_KEY"

# Verify wallet connection
# - Ensure MetaMask is installed
# - Check network settings
# - Verify account permissions
```

### Contract Deployment Failures

**Problem**: Smart contract deployment fails

**Solution**:

```bash
# Check gas prices
export GAS_PRICE="20000000000"  # 20 gwei

# Verify private key
export PRIVATE_KEY="your_private_key"

# Check contract compilation
npx hardhat compile
```

### Solidity Compilation Issues

**Problem**: Solidity contracts won't compile

**Solution**:

```bash
# Update Solidity compiler
npm install @openzeppelin/contracts@latest

# Check compiler version in hardhat.config.js
# Ensure solidity version matches contract pragma
```

## 🤖 Agent Factory Issues

### Rig Framework Issues

**Problem**: Agent creation fails with Rig errors

**Solution**:

```bash
# Update Rig framework
npm update @rig-ai/core

# Check agent configuration
# Verify tools are properly configured
# Ensure model access is available
```

### Tool Integration Issues

**Problem**: Custom tools don't work in agents

**Solution**:

```bash
# Verify tool schema
# Check tool registration
# Ensure proper error handling

# Test tools individually
node scripts/test-tool.js your-tool
```

## 🔌 Plugin Factory Issues

### Claude Desktop Integration

**Problem**: Plugin doesn't appear in Claude Desktop

**Solution**:

1. Check Claude Desktop version (requires latest)
2. Verify plugin manifest in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "your-plugin": {
      "command": "node",
      "args": ["path/to/your/plugin/index.js"]
    }
  }
}
```

3. Restart Claude Desktop
4. Check Claude logs for errors

### MCP Server Issues

**Problem**: MCP server won't start

**Solution**:

```bash
# Test server directly
node your-plugin/index.js

# Check for port conflicts
lsof -i :3000

# Verify dependencies
cd plugin-factory/examples/mcp-server
npm ci
npm test
```

## 🌐 Website Pipeline Issues

### Build Failures

**Problem**: Website build fails

**Solution**:

```bash
# Clear build cache
rm -rf .next
rm -rf dist

# Reinstall dependencies
npm ci

# Check for syntax errors
npm run lint
```

### Deployment Issues

**Problem**: Website won't deploy

**Solution**:

```bash
# Verify build output
npm run build
ls -la dist/

# Check deployment configuration
# Ensure proper environment variables
# Verify hosting platform settings
```

## 🦾 Claw Pipeline Issues

### OpenClaw Integration

**Problem**: Clawbot won't connect

**Solution**:

1. Verify OpenClaw installation
2. Check configuration files
3. Ensure proper permissions
4. Test connection manually

### Agent Communication Issues

**Problem**: Agents can't communicate

**Solution**:

```bash
# Check network configuration
# Verify API endpoints
# Test authentication tokens
# Check firewall settings
```

## 📊 Performance Issues

### Slow Build Times

**Problem**: Builds take too long

**Solution**:

```bash
# Enable build caching
export NODE_OPTIONS="--max-old-space-size=4096"

# Use parallel builds
npm run build -- --parallel

# Clean unnecessary files
npm run clean
```

### Memory Issues

**Problem**: Out of memory errors

**Solution**:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Use streaming for large operations
# Implement pagination for data processing
# Optimize bundle sizes
```

## 🐛 Testing Issues

### Test Failures

**Problem**: Tests fail unexpectedly

**Solution**:

```bash
# Run tests in isolation
npm run test:unit -- --reporter=verbose

# Clear test cache
rm -rf coverage/
npm test -- --clearCache

# Check for async issues
# Verify test timeouts
# Ensure proper mocking
```

### E2E Test Issues

**Problem**: End-to-end tests fail

**Solution**:

```bash
# Check browser configuration
npx playwright install

# Verify test environment
# Check for timing issues
# Ensure proper test data setup
```

## 🔍 Debugging Tips

### Enable Debug Logging

```bash
# For CLI operations
DEBUG=appfactory:* npm run cli

# For specific modules
DEBUG=appfactory:dapp npm run build:dapp
```

### Check System Requirements

```bash
# Verify Node.js and npm
node --version && npm --version

# Check available memory
node -e "console.log(process.memoryUsage())"

# Verify disk space
df -h
```

### Common File Locations

- **Logs**: `~/.appfactory/logs/`
- **Cache**: `~/.appfactory/cache/`
- **Config**: `~/.appfactory/config/`
- **Temp files**: `/tmp/appfactory/`

## 📞 Getting Additional Help

### Before Seeking Help

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Review documentation
4. Try the latest version

### Reporting Issues

When reporting issues, include:

- Operating system and version
- Node.js and npm versions
- Full error messages
- Steps to reproduce
- Expected vs actual behavior

### Useful Commands for Issue Reports

```bash
# Generate system info
npx envinfo --system --binaries --npmPackages

# Check AppFactory version
npm list appfactory

# Export debug information
DEBUG=* npm run your-command 2>&1 | tee debug.log
```

### Community Resources

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Discord/Slack**: For real-time help
- **Documentation**: For detailed guides

---

**Last Updated**: March 2026  
**For**: App Factory v12.x
