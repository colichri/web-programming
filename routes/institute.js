const express = require('express');
const app = express();
const router = express.Router();
const { Client } = require('pg');
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
      console.error('Error connecting to institutedatabase:', error);
    }
  };
// GET instituteuser by id
  router.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;

    try {
      const client = await connectToClient();
      const query = 'SELECT * FROM institutesuser WHERE instituteid = $1';
      const values = [id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving user from database');
    }
  })

//PUT method to update institute by id
.put(bodyParser.json(), async (req, res) => {
    const { id } = req.params;
    const { email, username, password } = req.body;

    try {
      const client = await connectToClient();
      const query = 'UPDATE institutesuser SET email = $1, username = $2, password = $3 WHERE instituteid = $4 RETURNING *';
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
      const query = 'DELETE FROM institutesuser WHERE instituteid = $1 RETURNING *';
      const values = [id];
      const result = await client.query(query, values);
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting instituteusers from the database');
    }
  });




// Instituteuser has the rights to add new grades and so on


// POST endpoint for the institute user to add new grades for a normal user
router.post('/:userId/grades', bodyParser.json(), async (req, res, next) => {
  try {
      const { userId } = req.params;
      const { rawGrade, subject, weight } = req.body;

      // Check if rawGrade is in the format of 'x,y' and convert it to a valid number format
      const gradeValue = parseFloat(rawGrade.replace(',', '.'));

      const client = await connectToClient();
      const query = 'INSERT INTO grades (userid, grade, subjects, weight) VALUES ($1, $2, $3, $4)';
      const values = [userId, gradeValue, subject, weight];
      await client.query(query, values);

      res.send('Grade added successfully');
  } catch (error) {
      next(error);
  }
});

// PUT endpoint for the institute user to update grades for a normal user
router.put('/:userId/grades/:gradeId', bodyParser.json(), async (req, res, next) => {
  try {
      const { userId, gradeId } = req.params;
      const { rawGrade, subject, weight } = req.body;

      // Check if rawGrade is in the format of 'x,y' and convert it to a valid number format
      const gradeValue = parseFloat(rawGrade.replace(',', '.'));

      const client = await connectToClient();
      const query = 'UPDATE grades SET grade = $1, subjects = $2, weight = $3 WHERE userid = $4 AND gradesid = $5';
      const values = [gradeValue, subject, weight, userId, gradeId];
      await client.query(query, values);

      res.send('Grade updated successfully');
  } catch (error) {
      next(error);
  }
});

// DELETE endpoint for the institute user to delete grades for a normal user
router.delete('/:userId/grades/:gradeId', async (req, res, next) => {
  try {
      const { userId, gradeId } = req.params;

      const client = await connectToClient();
      const query = 'DELETE FROM grades WHERE userid = $1 AND gradesid = $2';
      const values = [userId, gradeId];
      await client.query(query, values);

      res.send('Grade deleted successfully');
  } catch (error) {
      next(error);
  }
});






module.exports = router;








