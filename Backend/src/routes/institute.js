const e = require('express');
const express = require('express');
const router = express.Router();

// GET method to add institutes
router.get('/add', (req, res) => {
    res.send('Add an institute');
});

module.exports = router;



