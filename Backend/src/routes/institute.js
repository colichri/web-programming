const e = require('express');
const express = require('express');
const router = express.Router();
const fs = require('fs');

// POST method to add institutes
const addNewInstitute = async (req, res) => {
    try{
        const importtest = fs.readFileSync('./user.json'); //Später durch die Datenbank ersetzen
        const data = JSON.parse(importtest);
        const newdata =
        {
            id: req.body.id,
            name: req.body.name,
            password: req.body.password,
            adress: req.body.adress,
        }
    }catch(e){
        console.log(e);
    }
};

// GET method to get institute by id
const getInstituteById = async (req, res) => {
    try {
        const importtest = fs.readFileSync('./institute.json'); //Später durch die Datenbank ersetzen
        const data = JSON.parse(importtest);
        const institute = data.find(institute => institute.id === req.params.id);
        if (!institute) {
            return res.status(404).send('Institute not found');
        }
        res.send(institute);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server error');
    }
};

//PUT method to update institute by id



router
    .route('/api/v1/addNewInstitute')
    .post(addNewInstitute);

router
    .route('/api/v1/institute/:id')
    .get(getInstituteById);

module.exports = router;








