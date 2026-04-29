import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_SETTINGS = {
  provider: 'gemini',
  geminiKey: '',
  anthropicProxyUrl: '',
  mode: 'maintain',
  goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
};

// ── Meals ────────────────────────────────────────────────────

app.get('/api/meals', (_req, res) => {
  const rows = db.prepare('SELECT * FROM meals ORDER BY id ASC').all();
  res.json(rows.map((r) => ({ ...r, items: JSON.parse(r.items) })));
});

app.post('/api/meals', (req, res) => {
  const { date, type, description, calories, protein, carbs, fat, items } = req.body;
  const stmt = db.prepare(`
    INSERT INTO meals (date, type, description, calories, protein, carbs, fat, items)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(date, type, description, calories ?? 0, protein ?? 0, carbs ?? 0, fat ?? 0, JSON.stringify(items ?? []));
  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(result.lastInsertRowid);
  res.json({ ...meal, items: JSON.parse(meal.items) });
});

app.delete('/api/meals/:id', (req, res) => {
  db.prepare('DELETE FROM meals WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── Settings ─────────────────────────────────────────────────

app.get('/api/settings', (_req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'config'").get();
  res.json(row ? { ...DEFAULT_SETTINGS, ...JSON.parse(row.value) } : DEFAULT_SETTINGS);
});

app.put('/api/settings', (req, res) => {
  db.prepare("INSERT INTO settings (key, value) VALUES ('config', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .run(JSON.stringify(req.body));
  res.json({ ok: true });
});

// ── Anthropic proxy ──────────────────────────────────────────

app.post('/v1/messages', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env' });
  }
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
