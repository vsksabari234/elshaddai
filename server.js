import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');

// In-memory fallback in case of read/write delays
let memoryReviews = [];

try {
  if (fs.existsSync(REVIEWS_FILE)) {
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    memoryReviews = JSON.parse(raw);
    if (!Array.isArray(memoryReviews)) memoryReviews = [];
  }
} catch (e) {
  console.warn('Could not read reviews file on startup:', e);
}

// API: Get custom reviews
app.get(['/api/feedback', '/api/reviews'], (req, res) => {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryReviews = parsed;
      }
    }
  } catch (e) {
    // Keep memoryReviews
  }
  res.json(memoryReviews);
});

// API: Post new review
app.post(['/api/feedback', '/api/reviews'], (req, res) => {
  try {
    const { clientName, projectType, location, quote, rating, clientRole } = req.body || {};

    if (!clientName || !projectType) {
      return res.status(400).json({ error: 'Name and Work Category are required' });
    }

    const newReview = {
      id: req.body.id || `custom-review-${Date.now()}`,
      clientName: String(clientName).trim(),
      clientRole: clientRole ? String(clientRole).trim() : 'Homeowner',
      projectType: String(projectType).trim(),
      location: location ? String(location).trim() : 'Bengaluru',
      quote: quote ? String(quote).trim() : `Excellent custom carpentry and solid precision joinery for ${projectType}. Very happy with the workmanship and finishing.`,
      date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating: Number(rating) || 5,
      verifiedProject: true,
      createdAt: new Date().toISOString(),
    };

    memoryReviews.unshift(newReview);

    try {
      const dir = path.dirname(REVIEWS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(memoryReviews, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('Could not persist review to disk, kept in memory:', writeErr);
    }

    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

const distPath = path.join(__dirname, 'dist');

// Serve static assets with caching headers
app.use(express.static(distPath, {
  maxAge: '1d',
}));

// SPA fallback for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server listening on http://0.0.0.0:${PORT}`);
});
