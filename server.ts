import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.resolve(__dirname, 'data', 'db.json');

app.use(express.json());

// Helper functions for JSON database
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { admin: { pin: '1804', password: 'serene@noida18' }, consultations: [], reviews: [], services: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { admin: { pin: '1804', password: 'serene@noida18' }, consultations: [], reviews: [], services: [] };
  }
}

function writeDb(data: any) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { pin, password } = req.body;
  const db = readDb();
  const validPin = db.admin?.pin || '1804';
  const validPassword = db.admin?.password || 'serene@noida18';

  if ((pin && pin === validPin) || (password && password === validPassword)) {
    return res.json({
      success: true,
      token: 'session_token_' + Date.now(),
      message: 'Admin access granted'
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid Admin PIN or Password' });
});

// Consultations / Bookings
app.get('/api/consultations', (_req, res) => {
  const db = readDb();
  res.json(db.consultations || []);
});

app.post('/api/consultations', (req, res) => {
  const db = readDb();
  const newConsultation = {
    id: req.body.id || `SRN-NOIDA-${Math.floor(100000 + Math.random() * 900000)}`,
    ...req.body,
    createdAt: req.body.createdAt || new Date().toISOString(),
    status: req.body.status || 'Confirmed'
  };

  db.consultations = [newConsultation, ...(db.consultations || [])];
  writeDb(db);
  res.status(201).json(newConsultation);
});

app.patch('/api/consultations/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.consultations || []).findIndex((c: any) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Consultation not found' });
  }

  db.consultations[index] = { ...db.consultations[index], ...req.body };
  writeDb(db);
  res.json(db.consultations[index]);
});

// Reviews Management
app.get('/api/reviews', (req, res) => {
  const db = readDb();
  const approvedOnly = req.query.approved_only === 'true';
  let reviews = db.reviews || [];

  if (approvedOnly) {
    reviews = reviews.filter((r: any) => r.approved !== false);
  }

  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const db = readDb();
  const newReview = {
    id: `rev-${Date.now()}`,
    approved: true, // by default approved when added via portal
    ...req.body
  };

  db.reviews = [newReview, ...(db.reviews || [])];
  writeDb(db);
  res.status(201).json(newReview);
});

app.patch('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.reviews || []).findIndex((r: any) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  db.reviews[index] = { ...db.reviews[index], ...req.body };
  writeDb(db);
  res.json(db.reviews[index]);
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.reviews = (db.reviews || []).filter((r: any) => r.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Review deleted' });
});

// Services & Dynamic Pricing
app.get('/api/services', (_req, res) => {
  const db = readDb();
  res.json(db.services || []);
});

app.patch('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.services || []).findIndex((s: any) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  db.services[index] = { ...db.services[index], ...req.body };
  writeDb(db);
  res.json(db.services[index]);
});

// In production, serve static assets from 'dist'
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Start Server when run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serene Dental Studio API running on http://localhost:${PORT}`);
  });
}

export default app;
