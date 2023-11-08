// Define a grades array to store the grades
const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const app = express();
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
      console.error('Error connecting to gradedatabase:', error);
    }
  };

// Define a GET endpoint to retrieve all grades from the database
router.get('/:userId/', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = 'SELECT * FROM grades WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error, your grades couldnt be read out');
    }
    })

// Define a POST endpoint to add a new grade to the database

    .post(bodyParser.json(), async (req, res, next) => {
    try {
      const { grade = "", fach = "" } = req.body;
      const { userid } = req.params; // Assuming userid is present in request parameters
  
      await client.query(
        "INSERT INTO grades (userid, grade, fach) VALUES ($1, $2, $3)",
        [userid, grade, fach]
      );
  
      // Return a success message
      res.send("Grade entered successfully");
    } catch (error) {
      next(error);
    }
    })

// Define a PUT endpoint to update a grade in the database

    .put(bodyParser.json(), async (req, res) => {
    const { id } = req.params;
    const { grade = "", fach = "" } = req.body;

    try {
      const client = await connectToClient();
      const query = 'UPDATE grades SET grade = $1, fach = $2 WHERE userid = $3 RETURNING *';
      const values = [grade, fach, id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user grades in the database');
    }
    })

// Define a DELETE endpoint to delete a all grades from a user from the database

.delete(bodyParser.json(), async (req, res) => {
    const { id } = req.params;

    try {
      const client = await connectToClient();
      const query = 'DELETE FROM grades WHERE userid = $1 RETURNING *';
      const values = [id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting user from the database');
    }
  })

  .delete("/:gradeid", bodyParser.json(), async (req, res) => {
    const { gradeid } = req.params;

    try {
      const client = await connectToClient();
      const query = 'DELETE FROM grades WHERE gradeid = $1 RETURNING *';
      const values = [gradeid];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting specific grade from the database');
    }
});


module.exports = router;
