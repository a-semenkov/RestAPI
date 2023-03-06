const data = {
  users: require('../model/users.json'),
};

const getUsers = (req, res) => res.status(200).json(data.users);

const getUserById = (req, res) => {
  res
    .status(200)
    .json(data.users.filter((user) => user.id === Number(req.params.id)));
};

const createNewUser = (req, res) => {
  const newUser = {
    id: data.users[data.users.length - 1].id + 1,
    name: req.body.name,
    mail: req.body.mail,
  };
  data.users = [...data.users, newUser];

  res.status(201).json(data.users);
};

const editUser = (req, res) => {
  const user = data.users.find(({ id }) => id === Number(req.body.id));
  if (!user) return res.status(404).send('user not found');

  if (user.name) user.name = req.body.name;
  if (user.mail) user.mail = req.body.mail;

  const filteredUsers = data.users.filter(
    ({ id }) => id !== Number(req.body.id)
  );
  data.users = [...filteredUsers, user].sort((a, b) => a.id - b.id);
  res.status(200).send(user);
};

const deleteUser = (req, res) => {
  const user = data.users.find(({ id }) => id === Number(req.body.id));
  if (!user) return res.status(404).send('user not found');

  const filteredUsers = data.users.filter(
    ({ id }) => id !== Number(req.body.id)
  );
  data.users = [...filteredUsers];
  res.status(200).json(data.users);
};

module.exports = { getUsers, getUserById, createNewUser, editUser, deleteUser };
