import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';
import { initWorld, simulateGeneration, getDelta, getWorld } from './src/serverWorld.js';
import { saveWorld, loadWorld } from './src/db.js';

const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(__dirname));

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'init', data: getDelta() }));
  ws.on('close', () => clients.delete(ws));
});

const saved = loadWorld();
initWorld(saved);

setInterval(() => {
  const delta = simulateGeneration();
  const msg = JSON.stringify({ type: 'delta', data: delta });
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  }
}, 1000);

setInterval(() => {
  saveWorld(getWorld());
}, 30000);
