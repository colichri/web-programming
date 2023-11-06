const { Pool } = require('pg');

const pool = new Pool({
    user: 'your_user',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

async function calculateAverage(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM numbers');
        const numbers = result.rows.map(row => row.number);
        if (!numbers || !Array.isArray(numbers)) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const sum = numbers.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / numbers.length;
        return res.json({ average: avg });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
}

module.exports = { calculateAverage };
