import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const databaseFile = process.env.DATABASE_FILE || './data/mystiq.sqlite'
const absolute = path.resolve(databaseFile)
fs.mkdirSync(path.dirname(absolute), { recursive: true })

export const db = new Database(absolute)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  telegram_id INTEGER PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT,
  anonymous_free_started_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS anonymous_predictions (
  id TEXT PRIMARY KEY,
  sender_telegram_id INTEGER NOT NULL,
  recipient_username TEXT NOT NULL,
  recipient_telegram_id INTEGER,
  personal_message TEXT,
  prediction_json TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  opened_at INTEGER,
  FOREIGN KEY(sender_telegram_id) REFERENCES users(telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_anon_token_hash ON anonymous_predictions(token_hash);
CREATE INDEX IF NOT EXISTS idx_anon_sender ON anonymous_predictions(sender_telegram_id);
`)

export function upsertUser(user: {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  language_code?: string
}) {
  const now = Date.now()
  const existing = db.prepare('SELECT telegram_id FROM users WHERE telegram_id = ?').get(user.id)

  if (existing) {
    db.prepare(`
      UPDATE users SET username = ?, first_name = ?, last_name = ?, language_code = ?, updated_at = ?
      WHERE telegram_id = ?
    `).run(user.username ?? null, user.first_name ?? null, user.last_name ?? null, user.language_code ?? null, now, user.id)
  } else {
    db.prepare(`
      INSERT INTO users (telegram_id, username, first_name, last_name, language_code, anonymous_free_started_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(user.id, user.username ?? null, user.first_name ?? null, user.last_name ?? null, user.language_code ?? null, now, now, now)
  }
}

export function getUser(telegramId: number) {
  return db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId) as any
}
