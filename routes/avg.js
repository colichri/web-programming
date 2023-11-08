const express = require('express');
const router = express.Router();
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');

router.route('/')
    .get(async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM grades');
            const grades = result.rows.map(row => row.grades);
            if (!grades || !Array.isArray(grades)) {
                return res.status(400).json({ error: 'Invalid input' });
            }
            const sum = grades.reduce((acc, curr) => acc + curr, 0);
            const avg = sum / grades.length;
            return res.json({ average: avg });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        } finally {
            client.release();
        }
    });

module.exports = router;
