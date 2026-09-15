const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'gestbib_secret_key_2026';

// Connexion à la base de données MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestbib_auth'
});

// 1. SIGN UP (Inscription)
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, role, subscriber_id } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
  }

  try {
    // Vérifier si l'email existe déjà
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (email, password, role, subscriber_id) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, role || 'USER', subscriber_id || null]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. SIGN IN (Connexion)
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Veuillez fournir l'email et le mot de passe." });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    const user = rows[0];

    // Comparaison du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Génération du Token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, subscriberId: user.subscriber_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        subscriberId: user.subscriber_id
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. VERIFY TOKEN (Route de vérification inter-service)
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, error: "Token manquant" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Token invalide ou expiré" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth-Service running on port ${PORT}`));
