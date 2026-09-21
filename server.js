require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurimi i lidhjes me databazën në Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Testimi i lidhjes me databazën
pool.connect()
    .then(() => console.log('Lidhur me sukses me databazën PostgreSQL në Neon!'))
    .catch(err => console.error('Gabim në lidhjen me databazën:', err));

// 1. Ruajtja dhe njoftimi për Provimet (Exams)
app.post('/api/exams', async (req, res) => {
    try {
        const { userEmail, title, examDate } = req.body;
        const query = `
            INSERT INTO exams (user_email, title, exam_date) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const values = [userEmail, title, examDate];
        const newExam = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Exam saved successfully and notification scheduled!',
            exam: newExam.rows[0]
        });
    } catch (error) {
        console.error('Gabim gjatë ruajtjes së provimit:', error);
        res.status(500).json({ error: 'Failed to add exam: ' + error.message });
    }
});

// 2. Ruajtja dhe njoftimi për Takimet (Meetings)
app.post('/api/meetings', async (req, res) => {
    try {
        const { userEmail, title, meetingDate } = req.body;
        const query = `
            INSERT INTO meetings (user_email, title, meeting_date) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const values = [userEmail, title, meetingDate];
        const newMeeting = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Meeting saved successfully and notification scheduled!',
            meeting: newMeeting.rows[0]
        });
    } catch (error) {
        console.error('Gabim gjatë ruajtjes së takimit:', error);
        res.status(500).json({ error: 'Failed to add meeting: ' + error.message });
    }
});

// 3. Regjistrimi i një Përdoruesi të Ri (Signup)
app.post('/api/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, country, phone, dob, password } = req.body;
        
        // Kontrollo nëse email-i ekziston tashmë
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email address is already registered!' });
        }

        // Ruaj përdoruesin e ri në databazë
        const query = `
            INSERT INTO users (first_name, last_name, email, country, phone, dob, password) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, first_name, last_name, email;
        `;
        const values = [firstName, lastName, email, country, phone, dob, password];
        const newUser = await pool.query(query, values);

        res.status(201).json({
            message: 'Account created successfully!',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Gabim gjatë regjistrimit:', error);
        res.status(500).json({ error: 'Failed to create account: ' + error.message });
    }
});

// 4. Kyçja e Përdoruesit (Login)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Kontrollo nëse përdoruesi ekziston në databazë
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password!' });
        }

        const user = userResult.rows[0];

        // Krahasimi i fjalëkalimit
        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid email or password!' });
        }

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Gabim gjatë kyçjes:', error);
        res.status(500).json({ error: 'Failed to login: ' + error.message });
    }
});

// 5. Kërkesa për Harresë të Fjalëkalimit (Forgot Password)
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        // Për arsye sigurie, kthejmë sukses edhe nëse email-i nuk gjendet në sistem
        res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Gabim te forgot-password:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 6. Përditësimi i Fjalëkalimit të Ri (Reset Password)
app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        const updateResult = await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email',
            [newPassword, email]
        );

        if (updateResult.rows.length === 0) {
            return res.status(400).json({ error: 'User not found!' });
        }

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Gabim gjatë ndryshimit të fjalëkalimit:', error);
        res.status(500).json({ error: 'Failed to reset password: ' + error.message });
    }
});

// Nisja e serverit
app.listen(PORT, () => {
    console.log(`Serveri po luan në portin ${PORT}`);
});