const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestbib_user'
});

// 1. Ajouter un abonné
app.post('/api/subscribers', async (req, res) => {
  const { lastname, firstname, email, age, gender, phone } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO subscriber (lastname, firstname, email, age, gender, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [lastname, firstname, email, age, gender, phone]
    );
    res.json({ id: result.insertId, lastname, firstname, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Faire un abonnement
app.post('/api/subscriptions', async (req, res) => {
  const { subscriber_id, base_price, current_date } = req.body;
  const today = current_date ? new Date(current_date) : new Date();

  // Règle 1: Abonnement possible uniquement du 15 au 30 Décembre
  const month = today.getMonth(); // 0-based, 11 = Décembre
  const day = today.getDate();
  if (month !== 11 || day < 15 || day > 30) {
    return res.status(400).json({ 
      error: "Les abonnements sont ouverts uniquement du 15 au 30 Décembre." 
    });
  }

  const currentYear = today.getFullYear();

  try {
    // Vérification de la fidélité : 3 années consécutives précédentes
    const [history] = await db.query(
      `SELECT year FROM subscription 
       WHERE subscriber_id = ? AND year IN (?, ?, ?)`,
      [subscriber_id, currentYear - 1, currentYear - 2, currentYear - 3]
    );

    let isFaithful = history.length === 3;
    let finalPrice = base_price;

    // Règle 2: Remise fidélité = 3/4 du prix (25% de réduction)
    if (isFaithful) {
      finalPrice = base_price * 0.75;
    }

    await db.query(
      'INSERT INTO subscription (subscriber_id, year, amount, is_faithful_discount, created_at) VALUES (?, ?, ?, ?, ?)',
      [subscriber_id, currentYear, finalPrice, isFaithful, today]
    );

    res.json({ message: "Abonnement validé", price: finalPrice, isFaithfulDiscount: isFaithful });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`User-Service running on port ${PORT}`));
