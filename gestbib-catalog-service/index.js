const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestbib_catalog'
});

// Tâche automatisée (Cron Job) exécutée tous les jours à minuit du 1er au 15 Décembre
// Retire les livres non empruntés depuis > 2 ans
cron.schedule('0 0 1-15 12 *', async () => {
  console.log("Exécution du retrait automatique des livres obsolètes...");
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  await db.query(
    `UPDATE book SET status = 'REMOVED' 
     WHERE (last_borrowed_at < ? OR last_borrowed_at IS NULL) AND status != 'REMOVED'`,
    [twoYearsAgo]
  );
});

// Ajouter un livre
app.post('/api/books', async (req, res) => {
  const { isbn, title, genre, price, pages_count, publisher_ids } = req.body;
  try {
    await db.query(
      'INSERT INTO book (isbn, title, genre, price, pages_count) VALUES (?, ?, ?, ?, ?)',
      [isbn, title, genre, price, pages_count]
    );
    if (publisher_ids && publisher_ids.length > 0) {
      for (let pubId of publisher_ids) {
        await db.query('INSERT INTO book_publisher VALUES (?, ?)', [isbn, pubId]);
      }
    }
    res.json({ message: "Livre ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un livre par ISBN
app.get('/api/books/:isbn', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM book WHERE isbn = ?', [req.params.isbn]);
  if (rows.length === 0) return res.status(404).json({ error: "Livre non trouvé" });
  res.json(rows[0]);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Catalog-Service running on port ${PORT}`));
