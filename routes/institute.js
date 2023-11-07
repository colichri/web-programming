const express = require('express');
const app = express();
const router = express.Router();
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const pool = new Pool({
    user: 'miacqskbeyafwb',
    host: '    ec2-34-242-199-141.eu-west-1.compute.amazonaws.com',
    database: 'd967mmgnsklhd0',
    password: 'd7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4',
    port: 5432,
});

// POST method to add institutes
router.post('/', async (req, res) => {
    try {
        const { name, password, address } = req.body;
        const query = 'INSERT INTO institutes (name, password, address) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, password, address];
        const result = await pool.query(query, values);
        res.send(result.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server error');
    }
});

// GET method to get institute by id
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM institutes WHERE id = $1';
        const values = [req.params.id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).send('Institute not found');
        }
        res.send(result.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server error');
    }
});

//PUT method to update institute by id
router.put('/', async (req, res) => {
    try {
        const { name, password, address } = req.body;
        const id = req.params.id;
        const client = await pool.connect();
        const result = await client.query('UPDATE institutes SET name=$1, password=$2, address=$3 WHERE id=$4 RETURNING *', [name, password, address, id]);
        const updatedInstitute = result.rows[0];
        res.json(updatedInstitute);
        client.release();
    } catch (e) {
        console.log(e);
        res.status(500).send('Server error');
    }
});

module.exports = router;








