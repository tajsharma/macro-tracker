import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dir, '../data/macros.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS meals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT    NOT NULL,
    type        TEXT    NOT NULL,
    description TEXT    NOT NULL,
    calories    REAL    NOT NULL DEFAULT 0,
    protein     REAL    NOT NULL DEFAULT 0,
    carbs       REAL    NOT NULL DEFAULT 0,
    fat         REAL    NOT NULL DEFAULT 0,
    items       TEXT    NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export default db;
