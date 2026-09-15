const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestbib_borrow'
});

// 1. Emprunter un livre
app.post('/api/borrows', async (req, res) => {
  const { subscriber_id, book_isbn } = req.body;

  try {
    // Communication inter-service: Obtenir infos du livre
    const bookRes = await axios.get(`http://localhost:3002/api/books/${book_isbn}`);
    const book = bookRes.data;

    if (book.status === 'BORROWED') {
      return res.status(400).json({ error: "Ce livre est déjà emprunté." });
    }

    // Calcul de la date de retour prévue
    const borrowDate = new Date();
    const daysAllowed = book.pages_count < 300 ? 7 : 15;
    const expectedReturnDate = new Date(borrowDate);
    expectedReturnDate.setDate(expectedReturnDate.getDate() + daysAllowed);

    await db.query(
      'INSERT INTO borrow (subscriber_id, book_isbn, borrow_date, expected_return_date) VALUES (?, ?, ?, ?)',
      [subscriber_id, book_isbn, borrowDate, expectedReturnDate]
    );

    res.json({ message: "Emprunt enregistré", expectedReturnDate, daysAllowed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Retourner un livre et calculer les pénalités
app.post('/api/borrows/:id/return', async (req, res) => {
  const { wear_status } = req.body; // Status: 'OK', 'TORN_WEAR', 'DESTROYED'
  const borrowId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM borrow WHERE id = ?', [borrowId]);
    if (rows.length === 0) return res.status(404).json({ error: "Emprunt introuvable" });
    const borrow = rows[0];

    const bookRes = await axios.get(`http://localhost:3002/api/books/${borrow.book_isbn}`);
    const book = bookRes.data;

    const returnDate = new Date();
    const expectedReturn = new Date(borrow.expected_return_date);

    // 1. Calcul pénalité de retard : 0.01 * Prix * jours de retard
    let latenessPenalty = 0;
    if (returnDate > expectedReturn) {
      const diffTime = Math.abs(returnDate - expectedReturn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      latenessPenalty = diffDays * (0.01 * book.price);
    }

    // 2. Calcul pénalité d'usure
    let wearPenalty = 0;
    if (wear_status === 'TORN_WEAR') {
      wearPenalty = book.price * 0.75; // 75% du prix du livre
    } else if (wear_status === 'DESTROYED') {
      wearPenalty = book.price; // Remboursement intégral (100%)
    }

    const totalPenalty = latenessPenalty + wearPenalty;

    await db.query(
      `UPDATE borrow SET 
        effective_return_date = ?, 
        lateness_penalty = ?, 
        wear_penalty = ?, 
        total_penalty = ?, 
        wear_status = ? 
       WHERE id = ?`,
      [returnDate, latenessPenalty, wearPenalty, totalPenalty, wear_status, borrowId]
    );

    res.json({
      message: "Livre retourné avec succès",
      latenessPenalty,
      wearPenalty,
      totalPenalty
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Borrow-Service running on port ${PORT}`));
