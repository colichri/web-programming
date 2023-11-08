const express = require('express');
const app = express();
const { Client } = require('pg');
const router = express.Router();
const bodyParser = require('body-parser');
const DATABASE_URL="postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0";

// Establishing a connection
const connectToClient = async () => {
  try {
    console.log(DATABASE_URL);
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to userdatabase:', error);
  }
};

// GET user by id
router.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;

    try {
      const client = await connectToClient();
      const query = 'SELECT * FROM users WHERE userid = $1';
      const values = [id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving user from database');
    }
  })

  .put(bodyParser.json(), async (req, res) => {
    const { id } = req.params;
    const { email, username, password } = req.body;

    try {
      const client = await connectToClient();
      const query = 'UPDATE users SET email = $1, username = $2, password = $3 WHERE userid = $4 RETURNING *';
      const values = [email, username, password, id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user in the database');
    }
  })

  .delete(bodyParser.json(), async (req, res) => {
    const { id } = req.params;

    try {
      const client = await connectToClient();
      const query = 'DELETE FROM users WHERE userid = $1 RETURNING *';
      const values = [id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting user from the database');
    }
  });
  
module.exports = router;
