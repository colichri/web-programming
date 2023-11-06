const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // or your PostgreSQL port
});

// login user
router.route('/login')
  .post(async (req, res, next) => {
    try {
      const { username = '', password = '' } = req.body;
      const { expiresInMins = 60 } = req.body;

      // Query the database for the user's login information
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

      // If the user is not found, return an error
      if (rows.length === 0) {
        return res.status(401).send('Invalid username or password');
      }

      // Otherwise, create a payload with the user's information
      const payload = {
        id: rows[0].id,
        username: rows[0].username,
        expiresIn: new Date(Date.now() + expiresInMins * 60000),
      };

      // Return the payload
      res.send(payload);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;

