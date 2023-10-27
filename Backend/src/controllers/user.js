const { verifyUserHandler } = require('../helpers');
const {
  dataInMemory: frozenData,
  getMultiObjectSubset,
  getObjectSubset,
  getNestedValue,
  limitArray,
} = require('../utils/util');

const controller = {};

// get all users
controller.getAllUsers = ({ limit, skip, select }) => {
  let [...users] = frozenData.users;
  const total = users.length;

  if (skip > 0) {
    users = users.slice(skip);
  }

  users = limitArray(users, limit);

  if (select) {
    users = getMultiObjectSubset(users, select);
  }

  const result = { users, total, skip, limit: users.length };

  return result;
};

// search users
controller.searchUsers = ({ limit, skip, select, q: searchQuery }) => {
  let [...users] = frozenData.users.filter(u => {
    return (
      u.firstName.toLowerCase().includes(searchQuery) ||
      u.lastName.toLowerCase().includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery) ||
      u.username.toLowerCase().includes(searchQuery)
    );
  });
  const total = users.length;

  if (skip > 0) {
    users = users.slice(skip);
  }

  users = limitArray(users, limit);

  if (select) {
    users = getMultiObjectSubset(users, select);
  }

  const result = { users, total, skip, limit: users.length };

  return result;
};

// filter users
controller.filterUsers = ({ limit, skip, select, key, value }) => {
  let [...users] = frozenData.users.filter(u => {
    const val = getNestedValue(u, key);
    return val && val.toString() === value;
  });

  const total = users.length;

  if (skip > 0) {
    users = users.slice(skip);
  }

  users = limitArray(users, limit);

  if (select) {
    users = getMultiObjectSubset(users, select);
  }

  const result = { users, total, skip, limit: users.length };

  return result;
};

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
    domain,
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
