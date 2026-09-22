const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Konfigurimi për të shërbyer skedarët statikë
app.use(express.static(__dirname));

// Rruget për secilën faqe HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(__dirname + '/forgot-password.html');
});

app.get('/reset-password', (req, res) => {
  res.sendFile(__dirname + '/reset-password.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// Lidhja me Neon DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Konfigurimi i Nodemailer për Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// 1. REGJISTRIMI (SIGNUP)
app.post('/api/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, country, phone, dob, password } = req.body;
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, email, country, phone, dob, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [first_name, last_name, email, country, phone, dob, hashedPassword]
    );

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. FORGOT PASSWORD
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found in our records!' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_code = $1, reset_expires = $2 WHERE email = $3',
      [resetCode, expiresAt, email]
    );

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset Code - Remember AI',
      text: `Kodi yt për rivendosjen e fjalëkalimit është: ${resetCode}. Ky kod skadon pas 15 minutash.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Reset code sent to email successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});