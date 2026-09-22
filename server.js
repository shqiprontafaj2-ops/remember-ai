const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware për të lexuar JSON nga kërkesat
app.use(express.json());

// Konfigurimi i lidhjes me databazën (Neon PostgreSQL) duke përdorur DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Testimi i lidhjes me databazën gjatë nisjes
pool.connect()
  .then(() => console.log('Lidhur me sukses me databazën PostgreSQL në Neon!'))
  .catch(err => console.error('Gabim në lidhje me databazën:', err));

// -----------------------------------------------------------------
// RRUGA KRYESORE (Kjo e rregullon gabimin "Cannot GET /")
// -----------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Aplikacioni Remember AI po punon me sukses dhe është lidhur me databazën!');
});

// Rrugë shtesë për testim të databazës (opsionale)
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Nisja e serverit
app.listen(port, () => {
  console.log(`Serveri po luan në portin ${port}`);
});