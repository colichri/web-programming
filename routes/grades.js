const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Your PostgreSQL database connection string
const DATABASE_URL = "your_postgres_database_url_here";

// Establishing a connection
const connectToClient = async () => {
  try {
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

// GET endpoint to retrieve all grades for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await connectToClient();

    const query = 'SELECT * FROM grades WHERE userid = $1';
    const values = [userId];
    const result = await client.query(query, values);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving grades for the user');
  }
});

// POST endpoint to add a new grade for a user
router.post('/:userId', bodyParser.json(), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { grade = "", subject = "" } = req.body;
    const client = await connectToClient();

    // Check for duplicate grade before insertion
    const checkQuery = 'SELECT * FROM grades WHERE userid = $1 AND grade = $2 AND subject = $3';
    const checkValues = [userId, grade, subject];
    const checkResult = await client.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      return res.send("Duplicate grade. It already exists for this user.");
    }

    const insertQuery = 'INSERT INTO grades (userid, grade, subject) VALUES ($1, $2, $3)';
    const insertValues = [userId, grade, subject];
    await client.query(insertQuery, insertValues);

    res.send("Grade entered successfully");
  } catch (error) {
    next(error);
  }
});

// DELETE endpoint to delete a specific grade for a user
router.delete('/:gradeId', async (req, res) => {
  try {
    const { gradeId } = req.params;
    const client = await connectToClient();

    const query = 'DELETE FROM grades WHERE gradeid = $1';
    const values = [gradeId];
    await client.query(query, values);

    res.send("Grade deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting the grade');
  }
});

// DELETE endpoint to delete all grades for a user
router.delete('/all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await connectToClient();

    const query = 'DELETE FROM grades WHERE userid = $1';
    const values = [userId];
    await client.query(query, values);

    res.send("All grades for the user deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting all grades for the user');
  }
});

module.exports = router;
