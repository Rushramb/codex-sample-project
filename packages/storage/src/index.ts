import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'inbox.sqlite');
const db = new Database(dbPath);

db.prepare(`CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  channel TEXT,
  data TEXT,
  category TEXT,
  createdAt TEXT
)` ).run();

export interface StoredMessage {
  id: string;
  channel: string;
  data: any;
  category: string;
  createdAt: string;
}

export function saveMessage(msg: StoredMessage) {
  db.prepare(`INSERT OR REPLACE INTO messages (id, channel, data, category, createdAt)
             VALUES (@id, @channel, @data, @category, @createdAt)`).run({
    ...msg,
    data: JSON.stringify(msg.data)
  });
}

export function getMessage(id: string): StoredMessage | undefined {
  const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  if (!row) return undefined;
  return { ...row, data: JSON.parse(row.data) } as StoredMessage;
}

export function listMessages(): StoredMessage[] {
  const rows = db.prepare('SELECT * FROM messages').all();
  return rows.map((r) => ({ ...r, data: JSON.parse(r.data) }));
}
