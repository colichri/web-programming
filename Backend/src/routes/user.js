const {
  getUserById,
  addNewUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/user');

// get user by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { select } = req._options;

  res.send(getUserById({ id, select }));
});

// add new user
router.post('/add', (req, res) => {
  res.send(addNewUser({ ...req.body }));
});

// update user by id (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;

  res.send(updateUserById({ id, ...req.body }));
});

// update user by id (PATCH)
router.patch('/:id', (req, res) => {
  const { id } = req.params;

  res.send(updateUserById({ id, ...req.body }));
});

// delete user by id
router.delete('/:id', (req, res) => {
  res.send(deleteUserById({ ...req.params }));
});

module.exports = router;
