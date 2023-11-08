// Define a grades array to store the grades
const { Pool } = require('pg');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');


// Define a GET endpoint to retrieve all grades from the database
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM grades');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Define a POST endpoint to add a new grade to the database
router.post('/',bodyParser.json(), async (req, res) => {
    try {
        // Get the grade from the request body
        const { grade } = req.body;

        // Insert the grade into the database
        await pool.query('INSERT INTO grades (grade) VALUES ($1)', [grade]);

        // Send a response with the updated grades array
        const result = await pool.query('SELECT * FROM grades');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Define a PUT endpoint to update a grade in the database
router.put('/:id',bodyParser.json(), async (req, res) => {
    try {
        // Get the ID and new grade from the request parameters and body
        const { id } = req.params;
        const { grade } = req.body;

        // Update the grade in the database
        await pool.query('UPDATE grades SET grade = $1 WHERE id = $2', [grade, id]);

        // Send a response with the updated grades array
        const result = await pool.query('SELECT * FROM grades');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});
// Define a DELETE endpoint to delete a grade from the database
router.delete('/:id',bodyParser.json(), async (req, res) => {
    try {
        // Get the ID of the grade to delete from the request parameters
        const { id } = req.params;

        // Delete the grade from the database
        await pool.query('DELETE FROM grades WHERE id = $1', [id]);

        // Send a response with the updated grades array
        const result = await pool.query('SELECT * FROM grades');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});
module.exports = router;
