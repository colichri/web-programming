const express = require('express');
const app = express();
const { Pool } = require('pg');
const router = express.Router();

// Connect to PostgreSQL database
const pool = new Pool({
  user: 'miacqskbeyafwb',
  host: '    ec2-34-242-199-141.eu-west-1.compute.amazonaws.com',
  database: 'd967mmgnsklhd0',
  password: 'd7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4',
  port: 5432, // default port for PostgreSQL
});

// GET user by id
router.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    const { select } = req._options;

    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const values = [id];
      const result = await pool.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving user from database');
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password, address } = req.body;

    try {
      const query = 'UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4, address = $5 WHERE id = $6 RETURNING *';
      const values = [firstname, lastname, email, password, address, id];
      const result = await pool.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user in database');
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const values = [id];
      const result = await pool.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting user from database');
    }
  });

router.route('/')
  .get(async (req, res) => {
    try {
      const query = 'SELECT * FROM users';
      const result = await pool.query(query);
      res.send(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving users from database');
    }
  })
  .post(async (req, res) => {
    const { firstname, lastname, email, password, address } = req.body;

    try {
      const query = 'INSERT INTO users (firstname, lastname, email, password, address) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [firstname, lastname, email, password, address];
      const result = await pool.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding user to database');
    }
  });

module.exports = router;

