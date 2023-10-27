const e = require('express');
const express = require('express');
const router = express.Router();

module.exports = router;

// get user by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { select } = req._options;

  res.send(getUserById({ id, select }));
});

// add new user POST
const addNewUser = async (req, res) => {
  try{
  const importtest = fs.readFileSync('./user.json'); //Später durch die Datenbank ersetzen
  const data = JSON.parse(importtest);
  const newdata =
  {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    adress: req.body.adress,
  }
  }catch(e){
    console.log(e);
  }
};

router
  .route('/api/v1/addNewUser')
  .post(addNewUser);

// update user by id (PUT)
const updateUser = async (req, res) => {
  try {
    const importtest = fs.readFileSync('./user.json'); //Später durch die Datenbank ersetzen
    const data = JSON.parse(importtest);
    const userdata = data.find(player => player.id === Number(req.params.id));
    if (!playerStats) {
      const err = new Error('Player stats not found');
      err.status = 404;
      throw err;
    }
    const newStatsData = {
      wins: req.body.wins,
      losses: req.body.losses,
      points_scored: req.body.points_scored,
    };
    const newStats = stats.map(player => {
      if (player.id === Number(req.params.id)) {
        return newStatsData;
      } else {
        return player;
      }
    });
    fs.writeFileSync(statsFilePath, JSON.stringify(newStats));
    res.status(200).json(newStatsData);
  } catch (e) {
    console.error(e);
  }
};

// delete user by id
router.delete('/:id', (req, res) => {
  res.send(deleteUserById({ ...req.params }));
});

module.exports = router;

