const express = require('express');
const router = express.Router();
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const DATABASE_URL="postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0";

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
