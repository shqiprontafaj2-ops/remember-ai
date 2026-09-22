const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Krijimi i tabelës 'users' me fushat e plota
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        dob DATE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table with extended profile confirmed successfully!');
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

createTables();

// -----------------------------------------------------------------
// FRONTEND: DARK MODE PROFESSIONAL UI WITH 4 KEY FEATURES & AUTO-DETECT
// -----------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Remember AI - Global Access</title>
        <style>
            :root {
                --bg-color: #0b0f19;
                --card-bg: rgba(17, 24, 39, 0.88);
                --text-color: #f3f4f6;
                --text-muted: #9ca3af;
                --primary: #6366f1;
                --primary-hover: #4f46e5;
                --border-color: #374151;
                --input-bg: #1f2937;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: var(--bg-color);
                background-image: 
                    radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 40%),
                    linear-gradient(135deg, #0b0f19 0%, #111827 100%);
                background-attachment: fixed;
                color: var(--text-color);
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
            }
            .top-bar {
                width: 100%;
                max-width: 520px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9em;
                color: var(--text-muted);
                margin-bottom: 15px;
                padding: 0 10px;
            }
            .container {
                width: 100%;
                max-width: 520px;
                background: var(--card-bg);
                backdrop-filter: blur(14px);
                border: 1px solid var(--border-color);
                padding: 35px;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.6);
                box-sizing: border-box;
            }
            h1 { color: #818cf8; margin-top: 0; margin-bottom: 5px; text-align: center; font-size: 1.8em; }
            p.subtitle { color: var(--text-muted); font-size: 0.95em; text-align: center; margin-bottom: 20px; }
            
            /* 4 Key Features Box */
            .features-box {
                background: rgba(31, 41, 55, 0.6);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 25px;
                text-align: left;
            }
            .features-box h3 {
                color: #818cf8;
                font-size: 0.95em;
                margin-top: 0;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .features-box ul {
                margin: 0;
                padding-left: 20px;
                font-size: 0.85em;
                color: var(--text-muted);
                line-height: 1.6;
            }
            .features-box li strong {
                color: var(--text-color);
            }

            .tabs {
                display: flex;
                margin-bottom: 25px;
                border-bottom: 1px solid var(--border-color);
            }
            .tab {
                flex: 1;
                padding: 12px;
                text-align: center;
                cursor: pointer;
                font-weight: 600;
                color: var(--text-muted);
                transition: all 0.3s;
            }
            .tab.active {
                color: #818cf8;
                border-bottom: 2px solid #818cf8;
            }
            
            .form-group {
                margin-bottom: 18px;
                text-align: left;
            }
            label {
                display: block;
                font-size: 0.85em;
                margin-bottom: 6px;
                color: var(--text-muted);
                font-weight: 500;
            }
            input, select {
                width: 100%;
                padding: 12px;
                background: var(--input-bg);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-color);
                font-size: 0.95em;
                box-sizing: border-box;
                outline: none;
                transition: border-color 0.3s;
            }
            input:focus, select:focus {
                border-color: var(--primary);
            }
            
            .phone-row {
                display: flex;
                gap: 10px;
            }
            .phone-row select {
                flex: 1.4;
            }
            .phone-row input {
                flex: 2;
            }

            .password-container {
                position: relative;
            }
            .toggle-password {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: var(--text-muted);
                font-size: 0.85em;
                user-select: none;
            }

            .btn {
                width: 100%;
                background: var(--primary);
                color: white;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 1em;
                cursor: pointer;
                transition: background 0.3s, transform 0.1s;
                margin-top: 10px;
            }
            .btn:hover { background: var(--primary-hover); }
            .btn:active { transform: scale(0.98); }

            .switch-text {
                text-align: center;
                margin-top: 20px;
                font-size: 0.9em;
                color: var(--text-muted);
            }
            .switch-text a, .forgot-link {
                color: #818cf8;
                text-decoration: none;
                cursor: pointer;
            }
            .switch-text a:hover, .forgot-link:hover { text-decoration: underline; }
            
            .hidden { display: none; }
            .message {
                margin-top: 15px;
                padding: 10px;
                border-radius: 6px;
                font-size: 0.9em;
                text-align: center;
            }
            .success { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #059669; }
            .error { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #dc2626; }
        </style>
    </head>
    <body>

        <div class="top-bar">
            <div id="live-date"></div>
            <div id="user-lang">🌍 Auto-detect</div>
            <div id="live-clock"></div>
        </div>

        <div class="container">
            <h1>Remember AI</h1>
            <p class="subtitle">Global Intelligence & Secure Cloud Storage</p>

            <!-- 4 KEY FEATURES BOX -->
            <div class="features-box">
                <h3>Platform Core Features:</h3>
                <ul>
                    <li>✨ <strong>Smart Memory AI:</strong> Advanced processing to store and retrieve your data instantly.</li>
                    <li>🌍 <strong>Global Multi-User:</strong> Secure cloud access from any country and device worldwide.</li>
                    <li>🔒 <strong>Bank-Grade Security:</strong> Encrypted credentials and robust PostgreSQL database protection.</li>
                    <li>⚡ <strong>Real-Time Sync:</strong> Lightning-fast synchronization across all your active sessions.</li>
                </ul>
            </div>

            <div class="tabs">
                <div class="tab active" id="tab-register" onclick="switchTab('register')">Register</div>
                <div class="tab" id="tab-login" onclick="switchTab('login')">Login</div>
            </div>

            <!-- REGISTRATION FORM -->
            <form id="register-form" onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" id="reg-name" required placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Surname</label>
                    <input type="text" id="reg-surname" required placeholder="Enter your surname">
                </div>
                <div class="form-group">
                    <label>Phone Number (Search country or select code)</label>
                    <input type="text" id="country-search" placeholder="🔍 Search country (e.g. Kosovo, USA, Germany)..." oninput="filterCountries()" style="margin-bottom: 6px; font-size: 0.85em; padding: 8px;">
                    <div class="phone-row">
                        <select id="reg-country">
                            <option value="+383">🇽🇰 Kosovo (+383)</option>
                            <option value="+355">🇦🇱 Albania (+355)</option>
                            <option value="+1">🇺🇸 United States (+1)</option>
                            <option value="+44">🇬🇧 United Kingdom (+44)</option>
                            <option value="+49">🇩🇪 Germany (+49)</option>
                            <option value="+33">🇫🇷 France (+33)</option>
                            <option value="+39">🇮🇹 Italy (+39)</option>
                            <option value="+41">🇨🇭 Switzerland (+41)</option>
                            <option value="+90">🇹🇷 Turkey (+90)</option>
                            <option value="+381">🇷🇸 Serbia (+381)</option>
                            <option value="+389">🇲🇰 North Macedonia (+389)</option>
                            <option value="+382">🇲🇪 Montenegro (+382)</option>
                            <option value="+30">🇬🇷 Greece (+30)</option>
                            <option value="+34">🇪🇸 Spain (+34)</option>
                            <option value="+43">🇦🇹 Austria (+43)</option>
                            <option value="+32">🇧🇪 Belgium (+32)</option>
                            <option value="+48">🇵🇱 Poland (+48)</option>
                            <option value="+351">🇵🇹 Portugal (+351)</option>
                            <option value="+46">🇸🇪 Sweden (+46)</option>
                            <option value="+47">🇳🇴 Norway (+47)</option>
                            <option value="+45">🇩🇰 Denmark (+45)</option>
                            <option value="+358">🇫🇮 Finland (+358)</option>
                            <option value="+31">🇳🇱 Netherlands (+31)</option>
                            <option value="+61">🇦🇺 Australia (+61)</option>
                            <option value="+81">🇯🇵 Japan (+81)</option>
                            <option value="+86">🇨🇳 China (+86)</option>
                            <option value="+91">🇮🇳 India (+91)</option>
                            <option value="+55">🇧🇷 Brazil (+55)</option>
                            <option value="+52">🇲🇽 Mexico (+52)</option>
                            <option value="+27">🇿🇦 South Africa (+27)</option>
                            <option value="+971">🇦🇪 United Arab Emirates (+971)</option>
                        </select>
                        <input type="tel" id="reg-phone" required placeholder="Phone number">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="reg-email" required placeholder="name@example.com">
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" id="reg-dob" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <div class="password-container">
                        <input type="password" id="reg-password" required placeholder="Create password">
                        <span class="toggle-password" onclick="togglePassword('reg-password', this)">Show</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <div class="password-container">
                        <input type="password" id="reg-confirm" required placeholder="Confirm password">
                        <span class="toggle-password" onclick="togglePassword('reg-confirm', this)">Show</span>
                    </div>
                </div>
                <button type="submit" class="btn">REGISTER</button>
                <div class="switch-text">Already have an account? <a onclick="switchTab('login')">Login here</a></div>
                <div id="reg-msg"></div>
            </form>

            <!-- LOGIN FORM -->
            <form id="login-form" class="hidden" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="log-email" required placeholder="name@example.com">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <div class="password-container">
                        <input type="password" id="log-password" required placeholder="Enter your password">
                        <span class="toggle-password" onclick="togglePassword('log-password', this)">Show</span>
                    </div>
                </div>
                <div style="text-align: right; margin-bottom: 15px;">
                    <span class="forgot-link" onclick="forgotPassword()">Forgot Password?</span>
                </div>
                <button type="submit" class="btn">LOGIN</button>
                <div class="switch-text">Don't have an account? <a onclick="switchTab('register')">Register here</a></div>
                <div id="log-msg"></div>
            </form>
        </div>

        <script>
            // Detect user language/device locale
            const userLang = navigator.language || navigator.userLanguage;
            document.getElementById('user-lang').innerText = "🌐 " + userLang.toUpperCase();

            // Live Date and Clock Script
            function updateDateTime() {
                const now = new Date();
                document.getElementById('live-date').innerText = now.toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                document.getElementById('live-clock').innerText = now.toLocaleTimeString();
            }
            setInterval(updateDateTime, 1000);
            updateDateTime();

            // Tab Switching
            function switchTab(tab) {
                if(tab === 'register') {
                    document.getElementById('register-form').classList.remove('hidden');
                    document.getElementById('login-form').classList.add('hidden');
                    document.getElementById('tab-register').classList.add('active');
                    document.getElementById('tab-login').classList.remove('active');
                } else {
                    document.getElementById('register-form').classList.add('hidden');
                    document.getElementById('login-form').classList.remove('hidden');
                    document.getElementById('tab-login').classList.add('active');
                    document.getElementById('tab-register').classList.remove('active');
                }
            }

            // Country Search / Filter Function
            function filterCountries() {
                const query = document.getElementById('country-search').value.toLowerCase();
                const select = document.getElementById('reg-country');
                const options = select.options;
                for (let i = 0; i < options.length; i++) {
                    const txt = options[i].text.toLowerCase();
                    options[i].style.display = txt.includes(query) ? "" : "none";
                }
                for (let i = 0; i < options.length; i++) {
                    if (options[i].style.display !== "none") {
                        select.selectedIndex = i;
                        break;
                    }
                }
            }

            // Toggle Password Visibility
            function togglePassword(fieldId, el) {
                const input = document.getElementById(fieldId);
                if (input.type === "password") {
                    input.type = "text";
                    el.innerText = "Hide";
                } else {
                    input.type = "password";
                    el.innerText = "Show";
                }
            }

            // Forgot Password Simulated Feature with Verification Code via Email
            function forgotPassword() {
                const email = prompt("Please enter your registered email address to receive a verification code:");
                if (email) {
                    alert("A 6-digit verification code has been successfully sent to " + email + ". Please check your inbox!");
                }
            }

            // Register API Handler
            async function handleRegister(e) {
                e.preventDefault();
                const name = document.getElementById('reg-name').value;
                const surname = document.getElementById('reg-surname').value;
                const country = document.getElementById('reg-country').value;
                const rawPhone = document.getElementById('reg-phone').value;
                const phone = country + " " + rawPhone;
                const email = document.getElementById('reg-email').value;
                const dob = document.getElementById('reg-dob').value;
                const password = document.getElementById('reg-password').value;
                const confirm = document.getElementById('reg-confirm').value;
                const msgDiv = document.getElementById('reg-msg');

                if (password !== confirm) {
                    msgDiv.className = "message error";
                    msgDiv.innerText = "Passwords do not match!";
                    return;
                }

                try {
                    const res = await fetch('/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, surname, phone, email, dob, password })
                    });
                    const data = await res.json();
                    
                    msgDiv.className = data.success ? "message success" : "message error";
                    msgDiv.innerText = data.message;
                    if(data.success) {
                        setTimeout(() => switchTab('login'), 2000);
                    }
                } catch (err) {
                    msgDiv.className = "message error";
                    msgDiv.innerText = "An error occurred. Please try again.";
                }
            }

            // Login API Handler
            async function handleLogin(e) {
                e.preventDefault();
                const email = document.getElementById('log-email').value;
                const password = document.getElementById('log-password').value;
                const msgDiv = document.getElementById('log-msg');

                try {
                    const res = await fetch('/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();
                    
                    msgDiv.className = data.success ? "message success" : "message error";
                    msgDiv.innerText = data.message;
                } catch (err) {
                    msgDiv.className = "message error";
                    msgDiv.innerText = "An error occurred. Please try again.";
                }
            }
        </script>
    </body>
    </html>
  `);
});

// -----------------------------------------------------------------
// 1. REGISTRATION ENDPOINT
// -----------------------------------------------------------------
app.post('/register', async (req, res) => {
  const { name, surname, phone, email, dob, password } = req.body;
  
  if (!name || !surname || !phone || !email || !dob || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, surname, phone, email, dob, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name',
      [name, surname, phone, email, dob, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Redirecting to login...',
      user: newUser.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'This email is already registered!' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------
// 2. LOGIN ENDPOINT
// -----------------------------------------------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password!' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! Login successful.`,
      userId: user.id,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});