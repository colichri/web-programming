const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
    user: 'miacqskbeyafwb',
    host: '    ec2-34-242-199-141.eu-west-1.compute.amazonaws.com',
    database: 'd967mmgnsklhd0',
    password: 'd7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4',
    port: 5432,
});

router.route('/average')
    .get(async (req, res) => {
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
    });

module.exports = router;
