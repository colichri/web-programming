const express = require('express');
const router = express.Router();
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');

// Create a new connection pool
const pool = new Pool({
  user: 'miacqskbeyafwb',
  host: '    ec2-34-242-199-141.eu-west-1.compute.amazonaws.com',
  database: 'd967mmgnsklhd0',
  password: 'd7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4',
  port: 5432, // or your PostgreSQL port
});

//Testing the connection
router.get('/', (req, res) => {
  res.send('Get method klappt als routing');
});


// login user
router.route('/')
  .post(bodyParser.json(),async (req, res, next) => {
    try {
      const { email = '', password = '' } = req.body;
      const { expiresInMins = 60 } = req.body;

      // Query the database for the user's login information
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

      // If the user is not found, return an error
      if (rows.length === 0) {
        return res.status(401).send('Invalid email or password');
      }

      // Otherwise, create a payload with the user's information
      const payload = {
        id: rows[0].id,
        email: rows[0].email,
        expiresIn: new Date(Date.now() + expiresInMins * 60000),
      };

      // Return the payload
      res.send(payload);
    } catch (error) {
      next(error);
    }
  });

  // register user
  router.route('/register')
    .post(bodyParser.json(),async (req, res, next) => {
      try {
        const { email = '',username = '', password = '' } = req.body;

        // Check if the user already exists
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // If the user already exists, return an error
        if (rows.length > 0) {
          return res.status(409).send('User already exists');
        }

        // Otherwise, insert the new user into the database
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);

        // Return a success message
        res.send('User registered successfully');
      } catch (error) {
        next(error);
      }
    });



module.exports = router;

