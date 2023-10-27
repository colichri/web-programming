const { verifyUserHandler } = require('../helpers');
const {
  dataInMemory: frozenData,
  getObjectSubset,
} = require('../utils/util');

const controller = {};

// get user by id
controller.getUserById = ({ id, select }) => {
  let { ...user } = verifyUserHandler(id);

  if (select) {
    user = getObjectSubset(user, select);
  }

  return user;
};

// add new user
controller.addNewUser = ({ ...data }) => {
  const {
    firstName = '',
    lastName = '',
    age = null,
    email = '',
    username = '',
    password = '',
    ip = '',
    address = {
      address: '',
      city: '',
      coordinates: { lat: null, lng: null },
      postalCode: '',
      state: '',
    }
  } = data;

  const newUser = {
    id: frozenData.users.length + 1,
    firstName,
    lastName,
    age,
    email,
    username,
    password,
    ip,
    address,
  };

  return newUser;
};

// update user by id
controller.updateUserById = ({ id, ...data }) => {
  const {
    firstName = '',
    lastName = '',
    age = null,
    email = '',
    username = '',
    password = '',
    ip = '',
    address = {
      address: '',
      city: '',
      coordinates: { lat: null, lng: null },
      postalCode: '',
      state: '',
    },
  } = data;

  const user = verifyUserHandler(id);

  const updatedUser = {
    id: +id, // converting id to number
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    age: age || user.age,
    email: email || user.email,
    username: username || user.username,
    password: password || user.password,
    ip: ip || user.ip,
    address: address || user.address,
  };

  return updatedUser;
};

// delete user by id
controller.deleteUserById = ({ id }) => {
  const { ...user } = verifyUserHandler(id);

  user.isDeleted = true;
  user.deletedOn = new Date().toISOString();

  return user;
};

module.exports = controller;
