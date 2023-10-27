const e = require('express');
const express = require('express');
const router = express.Router();

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

router
  .route('/api/v1/addNewInstitute')
  .post(addNewInstitute);

module.exports = router;





