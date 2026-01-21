/**
 * Minimal HTTP server for Local Run Proof tests
 * Responds with 200 OK on the root path
 */

import { createServer } from 'node:http';

const PORT = process.env.PORT || 3456;

const server = createServer((req, res) => {
  console.log(`[server] ${req.method} ${req.url}`);

  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log('[server] ready');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] Received SIGTERM, shutting down...');
  server.close(() => {
    console.log('[server] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[server] Received SIGINT, shutting down...');
  server.close(() => {
    console.log('[server] Server closed');
    process.exit(0);
  });
});
