import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data.json');

// Helpers to load/save JSON DB
function readDB() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ dramas: [] }, null, 2));
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { dramas: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Get all dramas (list details only)
app.get('/api/dramas', (req, res) => {
  const { dramas } = readDB();
  // Sort by uploadDate desc if present
  const sorted = [...dramas].sort((a, b) => (new Date(b.uploadDate || 0)) - (new Date(a.uploadDate || 0)));
  res.json(sorted.map(({ episodes, ...d }) => d));
});

// Create a drama
app.post('/api/dramas', (req, res) => {
  const { title, description, thumbnail, lang } = req.body || {};
  if (!title || !description || !thumbnail) {
    return res.status(400).json({ error: 'title, description, thumbnail are required' });
  }
  const db = readDB();
  const drama = {
    id: genId(),
    title,
    description,
    thumbnail,
    lang: lang || 'uz',
    uploadDate: new Date().toISOString(),
    episodes: [],
    likes: 0,
    likedBy: [],
    comments: [],
  };
  db.dramas.push(drama);
  writeDB(db);
  const { episodes, ...details } = drama;
  res.status(201).json(details);
});

// Get single drama details
app.get('/api/dramas/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const { episodes, comments, ...details } = drama;
  res.json(details);
});

// Get episodes for a drama
app.get('/api/dramas/:id/episodes', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const eps = [...(drama.episodes || [])].sort((a, b) => {
    const aKey = `${a.season || ''}-${a.episode || ''}`;
    const bKey = `${b.season || ''}-${b.episode || ''}`;
    return aKey.localeCompare(bKey);
  });
  res.json(eps);
});

// Create an episode for a drama
app.post('/api/dramas/:id/episodes', (req, res) => {
  const { id } = req.params;
  const { season, episode, videoId } = req.body || {};
  if (!episode || !videoId) {
    return res.status(400).json({ error: 'episode and videoId are required' });
  }
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const ep = {
    id: genId(),
    season: season || '1',
    episode: String(episode),
    videoId,
    uploadDate: new Date().toISOString(),
  };
  drama.episodes = drama.episodes || [];
  drama.episodes.push(ep);
  writeDB(db);
  res.status(201).json(ep);
});

// Update drama details
app.put('/api/dramas/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, thumbnail, lang } = req.body || {};
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  if (title !== undefined) drama.title = title;
  if (description !== undefined) drama.description = description;
  if (thumbnail !== undefined) drama.thumbnail = thumbnail;
  if (lang !== undefined) drama.lang = lang;
  writeDB(db);
  const { episodes, comments, likedBy, ...details } = drama;
  res.json(details);
});

// Delete a drama
app.delete('/api/dramas/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.dramas.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Drama not found' });
  const removed = db.dramas.splice(idx, 1)[0];
  writeDB(db);
  res.json({ ok: true, id: removed.id });
});

// Update an episode
app.put('/api/dramas/:id/episodes/:epId', (req, res) => {
  const { id, epId } = req.params;
  const { season, episode, videoId } = req.body || {};
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const ep = (drama.episodes || []).find(e => e.id === epId);
  if (!ep) return res.status(404).json({ error: 'Episode not found' });
  if (season !== undefined) ep.season = season;
  if (episode !== undefined) ep.episode = String(episode);
  if (videoId !== undefined) ep.videoId = videoId;
  writeDB(db);
  res.json(ep);
});

// Delete an episode
app.delete('/api/dramas/:id/episodes/:epId', (req, res) => {
  const { id, epId } = req.params;
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const idx = (drama.episodes || []).findIndex(e => e.id === epId);
  if (idx === -1) return res.status(404).json({ error: 'Episode not found' });
  drama.episodes.splice(idx, 1);
  writeDB(db);
  res.json({ ok: true, id: epId });
});

// Simple search across title/description
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase().trim();
  if (!q) return res.json([]);
  const { dramas } = readDB();
  const results = dramas.filter(d =>
    d.title.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q)
  ).map(({ episodes, ...d }) => d);
  res.json(results);
});

// Likes
app.get('/api/dramas/:id/likes', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const likes = Array.isArray(drama.likedBy) ? drama.likedBy.length : (drama.likes || 0);
  // Normalize stored likes
  drama.likes = likes;
  writeDB(db);
  res.json({ likes });
});

app.post('/api/dramas/:id/like', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  drama.likedBy = drama.likedBy || [];
  if (drama.likedBy.includes(userId)) {
    return res.status(409).json({ error: 'Already liked' });
  }
  drama.likedBy.push(userId);
  drama.likes = drama.likedBy.length;
  writeDB(db);
  res.json({ likes: drama.likes });
});

// Comments
app.get('/api/dramas/:id/comments', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const comments = [...(drama.comments || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(comments);
});

app.post('/api/dramas/:id/comments', (req, res) => {
  const { id } = req.params;
  const { user, text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });
  const db = readDB();
  const drama = db.dramas.find(d => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found' });
  const comment = {
    id: genId(),
    user: user || 'Anon',
    text,
    createdAt: new Date().toISOString()
  };
  drama.comments = drama.comments || [];
  drama.comments.push(comment);
  writeDB(db);
  res.status(201).json(comment);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SeoulFlix API running on http://localhost:${PORT}`);
});
