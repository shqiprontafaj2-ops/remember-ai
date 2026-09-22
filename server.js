const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Nëse ke skedarë frontend në public, ose hiqe nëse i ke jashtë

// Lidhja me Neon DB duke përdorur DATABASE_URL nga .env ose Render
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
    
    // Kontrollo nëse email-i ekziston tashmë
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }

    // Enkriptimi i fjalëkalimit
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ruajtja në bazën e të dhënave duke përdorur kolonat e sakta
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

// 2. FORGOT PASSWORD (Krijimi dhe dërgimi i kodit)
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found in our records!' });
    }

    // Gjenero një kod 6-shifror
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Skadon pas 15 minutash

    // Ruaj kodin dhe skadencën në bazën e të dhënave
    await pool.query(
      'UPDATE users SET reset_code = $1, reset_expires = $2 WHERE email = $3',
      [resetCode, expiresAt, email]
    );

    // Dërgo email-in përmes Gmail SMTP
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
    res.status(500).json({ success: false, message: 'Failed to send email. Please check server email credentials configuration.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});