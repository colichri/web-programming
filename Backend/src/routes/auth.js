const express = require('express');
const router = express.Router();
const { loginByUsernamePassword } = require('../controllers/auth');

// login user
router.post('/login', async (req, res, next) => {
  try {
    const { username = '', password = '' } = req.body;
    const { expiresInMins = 60 } = req.body;

    const payload = await loginByUsernamePassword({
      username,
      password,
      expiresInMins,
    });

    res.send(payload);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
