// server.js
// Point d'entrée de l'application
// On configure Express, on connecte la base, on branche les routes

const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Charge les variables d'environnement depuis .env
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// ── Middlewares de sécurité ──────────────────────────────────────
// helmet : ajoute des headers HTTP de sécurité automatiquement
app.use(helmet());

// mongoSanitize : nettoie les données pour éviter les injections NoSQL
app.use(mongoSanitize());

// rateLimit : limite à 100 requêtes par IP toutes les 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes, réessaie plus tard.' }
});
app.use(limiter);

// ── Middleware pour lire le JSON dans le body des requêtes ───────
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────
// On importera les routes au fur et à mesure que l'équipe les développe
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));

// ── Démarrage du serveur ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur : http://localhost:${PORT}`);
});
