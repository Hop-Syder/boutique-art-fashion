/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Upload Server — Express + Multer + sharp pour ART FASHION VPS LWS
 * Endpoints:
 *   POST /api/upload      → upload image, retourne l'URL publique
 *   GET  /api/data        → lire db.json (persistance cross-browser)
 *   POST /api/data        → écrire db.json
 *   GET  /api/health      → healthcheck
 * @created 2026-08-21
 * @updated 2026-08-21
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

const express = require('express');
const multer  = require('multer');
const sharp   = require('sharp');
const path    = require('path');
const fs      = require('fs');
const cors    = require('cors');
const crypto  = require('crypto');

// ── Configuration ────────────────────────────────────────────────────────────
const PORT        = process.env.PORT        || 3002;
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
const DB_PATH     = process.env.DB_PATH     || path.join(__dirname, 'db.json');
const MAX_SIZE_MB  = 8; // taille max acceptée avant compression

// Créer le dossier uploads si absent
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initialiser db.json si absent
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ version: '1.0.0', createdAt: new Date().toISOString() }, null, 2));
}

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*', // En prod, remplacer par votre domaine
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));

// ── Multer (buffer en mémoire, traitement sharp ensuite) ──────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Formats acceptés : JPEG, PNG, WEBP, GIF'));
    }
  },
});

// ── Healthcheck ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    uploadsDir: UPLOADS_DIR,
    dbPath: DB_PATH,
    timestamp: new Date().toISOString(),
  });
});

// ── Upload Image ──────────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' });
    }

    // Nom unique basé sur hash + timestamp
    const hash     = crypto.createHash('sha1').update(req.file.buffer).digest('hex').slice(0, 12);
    const filename = `${Date.now()}-${hash}.webp`;
    const destPath = path.join(UPLOADS_DIR, filename);

    // Conversion + compression WebP via sharp
    await sharp(req.file.buffer)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(destPath);

    const publicUrl = `/uploads/${filename}`;
    console.log(`[UPLOAD] ✅ ${filename} (${(req.file.size / 1024).toFixed(1)} Ko original)`);

    return res.json({ url: publicUrl, filename });
  } catch (err) {
    console.error('[UPLOAD] ❌ Erreur:', err.message);
    return res.status(500).json({ error: 'Erreur lors du traitement de l\'image.', detail: err.message });
  }
});

// ── Persistance données GET ───────────────────────────────────────────────────
app.get('/api/data', (_req, res) => {
  try {
    const raw  = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    return res.json(data);
  } catch {
    return res.json({});
  }
});

// ── Persistance données POST ──────────────────────────────────────────────────
app.post('/api/data', (req, res) => {
  try {
    const payload = { ...req.body, savedAt: new Date().toISOString() };
    fs.writeFileSync(DB_PATH, JSON.stringify(payload, null, 2), 'utf8');
    return res.json({ ok: true });
  } catch (err) {
    console.error('[DATA] ❌ Erreur écriture db.json:', err.message);
    return res.status(500).json({ error: 'Impossible d\'écrire en base.' });
  }
});

// ── Suppression image (optionnel, depuis admin) ───────────────────────────────
app.delete('/api/upload/:filename', (req, res) => {
  try {
    const safe = path.basename(req.params.filename); // sécurité path traversal
    const file = path.join(UPLOADS_DIR, safe);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`[DELETE] 🗑️  ${safe} supprimé`);
      return res.json({ ok: true });
    }
    return res.status(404).json({ error: 'Fichier introuvable.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Erreur Multer (taille dépassée) ───────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `Fichier trop volumineux. Maximum : ${MAX_SIZE_MB} Mo.` });
  }
  console.error('[SERVER] ❌', err.message);
  return res.status(500).json({ error: err.message });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ART FASHION Upload Server prêt sur :${PORT}`);
  console.log(`   📁 Uploads : ${UPLOADS_DIR}`);
  console.log(`   💾 Base    : ${DB_PATH}`);
});
