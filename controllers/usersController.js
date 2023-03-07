const data = {
  users: require('../model/users.json'),
};

// TODO: при работе с БД ID должен быть простым инкрементируемым, чтобы именть возможность получать пользователя по ссылке

const getUsers = (req, res) =>
  res.status(200).json({ status: 200, ok: true, payload: data.users });

const getUserById = (req, res) => {
  res.status(200).json({
    status: 200,
    ok: true,
    payload: data.users.filter((user) => user.id === Number(req.params.id)),
  });
};

// если нужна возможность создавать нового пользователя админу

// const createNewUser = (req, res) => {
//   const newUser = {
//     id: uuid(),
//     username: req.body.firstname,
//     password: req.body.lastname,
//   };

//   if (!newUser.username || !newUser.password) {
//     return res
//       .status(400)
//       .json({
//         status: 400,
//         ok: false,
//         message: 'username and password are required.',
//       });
//   }

//   const isUserExists = data.users.find((entry) => entry.user === username);
//   if (isUserExists)
//     return res
//       .status(409)
//       .json({ status: 409, ok: false, message: 'Username already taken' });

//   data.users = ([...data.users, newUser]);
//   res.status(201).json(data.employees);
// };

const editUser = (req, res) => {
  const user = data.users.find((entry) => entry.id === req.body.id);

  if (!user)
    return res
      .status(404)
      .json({ status: 404, ok: false, message: 'User not found' });

  if (user.username) user.username = req.body.username;
  // if (user.mail) user.mail = req.body.mail;

  const filteredUsers = data.users.filter(
    ({ id }) => id !== Number(req.body.id)
  );
  data.users = [...filteredUsers, user];
  res
    .status(200)
    .json({ status: 200, ok: true, message: 'User info saved', payload: user });

  // TODO: изменение файла БД, если нужно
};

const deleteUser = (req, res) => {
  const user = data.users.find(({ id }) => id === Number(req.body.id));
  if (!user)
    return res
      .status(404)
      .json({ status: 404, ok: false, message: 'User not found' });

  const filteredUsers = data.users.filter(
    ({ id }) => id !== Number(req.body.id)
  );
  data.users = [...filteredUsers];
  res.status(200).json({ status: 200, ok: true, payload: data.users });
};

module.exports = { getUsers, getUserById, editUser, deleteUser };
