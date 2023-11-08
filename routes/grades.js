const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const DATABASE_URL = "postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0";


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


// Calculate the average of all grades for a specific user
const calculateAverageGrade = async (userId) => {
    try {
        const client = await connectToClient();
        const query = 'SELECT AVG(grade) FROM grades WHERE userid = $1';
        const values = [userId];
        const result = await client.query(query, values);
        return result.rows[0].avg;
    } catch (error) {
        console.error('Error calculating average grade:', error);
        return null;
    }
};

// GET endpoint to retrieve all grades for a user from the database
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const client = await connectToClient();
        const query = 'SELECT * FROM grades WHERE userid = $1';
        const values = [userId];
        const result = await client.query(query, values);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error. Grades could not be retrieved.');
    }
});

// POST endpoint to add a new grade for a user to the database
router.post('/:userId', bodyParser.json(), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { grade: rawGrade = "", subjects: rawSubjects = "" } = req.body;
        
        // Check if rawGrade is in the format of 'x,y' and convert it to a valid number format
        const gradeValue = parseFloat(rawGrade.replace(',', '.'));

        const client = await connectToClient();
        const query = 'INSERT INTO grades (userid, grade, subjects) VALUES ($1, $2, $3)';
        const values = [userId, gradeValue, rawSubjects];
        await client.query(query, values);

        res.send('Grade entered successfully');
    } catch (error) {
        next(error);
    }
});


// DELETE endpoint to delete all grades for a user from the database
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const client = await connectToClient();
        const query = 'DELETE FROM grades WHERE userid = $1';
        const values = [userId];
        await client.query(query, values);
        res.send('Grades deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting grades from the database');
    }
});

// DELETE endpoint to delete a specific grade from the database
router.delete('/:gradesid', async (req, res) => {
    const { gradesid } = req.params;

    try {
        const client = await connectToClient();
        const query = 'DELETE FROM grades WHERE gradesid = $1';
        const values = [gradesid];
        await client.query(query, values);
        res.send('Grade deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting grade from the database');
    }
});

router.get('/average/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const average = await calculateAverageGrade(userId);
        res.json({ average });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
