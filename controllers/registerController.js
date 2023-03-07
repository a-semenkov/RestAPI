const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const data = {
  users: require('../model/users.json'),
};

const createNewUser = async (req, res) => {
  const { user: username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      status: 400,
      ok: false,
      message: 'Username and/or password required',
    });

  const isUserExists = data.users.find((entry) => entry.user === username);
  if (isUserExists)
    return res
      .status(409)
      .json({ status: 409, ok: false, message: 'Username already taken' });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuid(),
      username,
      roles: {
        user: 3,
      },
      password: hashedPwd,
    };

    data.users = [...data.users, newUser];
    await fsPromises.writeFile(
      path.join(__dirname, '../model/users.json'),
      JSON.stringify(data.users)
    );

    res
      .status(201)
      .json({
        status: 201,
        ok: true,
        payload: { username: newUser.username, id: newUser.id },
      });
  } catch (e) {
    res.status(500).json({ status: 500, ok: false, message: e.message });
  }

  res.status(201).json(data.users);
};

module.exports = createNewUser;
