/**
 * Server for fixture-fail - same as fixture-pass
 * The failure is in the build script, not the server
 */

import { createServer } from 'node:http';

const PORT = process.env.PORT || 3457;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});

server.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
});
