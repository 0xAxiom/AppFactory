const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3456; // Different from common ports
const RUNTIME_DIR = path.join(__dirname, '../.runtime');
const SESSIONS_FILE = path.join(RUNTIME_DIR, 'sessions.json');

app.use(cors());
app.use(express.json());

// Ensure runtime directory exists
if (!fs.existsSync(RUNTIME_DIR)) {
  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
}

class SessionManager {
  constructor() {
    this.currentSession = null;
    this.loadSessions();
  }

  loadSessions() {
    try {
      if (fs.existsSync(SESSIONS_FILE)) {
        const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
        const sessions = JSON.parse(data);
        // Clear any stale sessions on startup
        this.currentSession = null;
        this.saveSessions();
      }
    } catch (error) {
      console.log('No existing sessions file, starting fresh');
    }
  }

  saveSessions() {
    const sessionData = {
      currentSession: this.currentSession,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionData, null, 2));
  }

  async startSession(buildPath, mode = 'dev-client') {
    // Stop any existing session first
    this.stopCurrentSession();

    const sessionId = `session_${Date.now()}`;
    const fullBuildPath = path.resolve('../' + buildPath);

    // Validate build path
    if (!fs.existsSync(fullBuildPath)) {
      throw new Error(`Build path not found: ${buildPath}`);
    }

    const packageJsonPath = path.join(fullBuildPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json not found in build: ${buildPath}`);
    }

    // Check if build has expo
    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
      throw new Error(`Invalid package.json in build: ${buildPath}`);
    }

    if (!packageJson.dependencies?.expo && !packageJson.devDependencies?.expo) {
      throw new Error(`Expo not found in dependencies: ${buildPath}`);
    }

    // Determine expo command
    const expoCommand = mode === 'dev-client' ? 
      ['npx', 'expo', 'start', '--dev-client'] :
      ['npx', 'expo', 'start'];

    console.log(`Starting Expo in ${fullBuildPath} with command: ${expoCommand.join(' ')}`);

    // Start expo process
    const expoProcess = spawn(expoCommand[0], expoCommand.slice(1), {
      cwd: fullBuildPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const session = {
      id: sessionId,
      buildPath,
      mode,
      status: 'starting',
      urls: {},
      pid: expoProcess.pid,
      startedAt: new Date().toISOString(),
      logs: []
    };

    // Parse expo output for URLs
    expoProcess.stdout.on('data', (data) => {
      const output = data.toString();
      session.logs.push({ type: 'stdout', message: output, timestamp: new Date().toISOString() });
      
      // Parse URLs from expo output
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('Metro waiting on')) {
          session.status = 'running';
        }
        if (line.includes('exp://')) {
          const match = line.match(/(exp:\/\/[^\s]+)/);
          if (match) session.urls.lanUrl = match[1];
        }
        if (line.includes('http://') && line.includes('devtools')) {
          const match = line.match(/(http:\/\/[^\s]+)/);
          if (match) session.urls.devtools = match[1];
        }
        if (line.includes('http://') && (line.includes('8081') || line.includes('Metro'))) {
          const match = line.match(/(http:\/\/[^\s]+)/);
          if (match) session.urls.metro = match[1];
        }
      }
      
      this.saveSessions();
    });

    expoProcess.stderr.on('data', (data) => {
      const output = data.toString();
      session.logs.push({ type: 'stderr', message: output, timestamp: new Date().toISOString() });
      
      // Check for common errors
      if (output.includes('EADDRINUSE') || output.includes('port already in use')) {
        session.status = 'error';
        session.error = 'Port already in use. Try stopping other Expo instances.';
      }
      if (output.includes('command not found') || output.includes('npx: installed')) {
        session.status = 'error';
        session.error = 'Expo CLI not available. Make sure Expo is installed.';
      }
    });

    expoProcess.on('close', (code) => {
      if (session.status !== 'stopped') {
        session.status = code === 0 ? 'completed' : 'error';
        if (code !== 0 && !session.error) {
          session.error = `Expo process exited with code ${code}`;
        }
      }
      session.endedAt = new Date().toISOString();
      this.saveSessions();
    });

    expoProcess.on('error', (error) => {
      session.status = 'error';
      session.error = error.message;
      this.saveSessions();
    });

    this.currentSession = session;
    this.currentSession.process = expoProcess;
    this.saveSessions();

    return session;
  }

  stopCurrentSession() {
    if (this.currentSession && this.currentSession.process) {
      try {
        this.currentSession.status = 'stopped';
        this.currentSession.endedAt = new Date().toISOString();
        
        // Kill the process
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', this.currentSession.process.pid, '/f', '/t']);
        } else {
          this.currentSession.process.kill('SIGTERM');
        }
        
        this.currentSession.process = null;
        this.saveSessions();
        console.log('Stopped current session');
      } catch (error) {
        console.error('Error stopping session:', error);
      }
    }
    this.currentSession = null;
  }

  getCurrentSession() {
    if (this.currentSession && this.currentSession.process) {
      // Remove process reference for JSON serialization
      const { process, ...sessionData } = this.currentSession;
      return sessionData;
    }
    return null;
  }
}

const sessionManager = new SessionManager();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all sessions
app.get('/sessions', (req, res) => {
  const current = sessionManager.getCurrentSession();
  res.json({ 
    currentSession: current,
    totalSessions: current ? 1 : 0
  });
});

// Start a session
app.post('/sessions/start', async (req, res) => {
  try {
    const { buildPath, mode = 'dev-client' } = req.body;
    
    if (!buildPath) {
      return res.status(400).json({ error: 'buildPath is required' });
    }

    const session = await sessionManager.startSession(buildPath, mode);
    res.json({ success: true, session: sessionManager.getCurrentSession() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stop current session
app.post('/sessions/stop', (req, res) => {
  try {
    sessionManager.stopCurrentSession();
    res.json({ success: true, message: 'Session stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session by ID
app.get('/sessions/:id', (req, res) => {
  const current = sessionManager.getCurrentSession();
  if (current && current.id === req.params.id) {
    res.json(current);
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down preview server...');
  sessionManager.stopCurrentSession();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down preview server...');
  sessionManager.stopCurrentSession();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`App Factory Preview Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});