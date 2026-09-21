const { Pool } = require('pg');
require('dotenv').config();

// Krijimi i pool-it të lidhjes me Neon PostgreSQL duke përfshirë SSL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Testimi i lidhjes
pool.connect()
    .then(client => {
        console.log('Lidhja me databazën në Neon u realizua me sukses!');
        client.release();
    })
    .catch(err => {
        console.error('Gabim gjatë lidhjes me databazën:', err.message);
    });

module.exports = pool;