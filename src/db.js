import Database from 'better-sqlite3';

const db = new Database('bluum.db');

db.exec(`CREATE TABLE IF NOT EXISTS world (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT
)`);

export function saveWorld(world) {
  const stmt = db.prepare(
    'INSERT INTO world (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data'
  );
  stmt.run(JSON.stringify(world));
}

export function loadWorld() {
  const row = db.prepare('SELECT data FROM world WHERE id = 1').get();
  return row ? JSON.parse(row.data) : null;
}
