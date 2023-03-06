// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');

const data = {
  users: require('../model/users.json'),
};

const login = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password)
    return res.status(400).json({
      status: 400,
      ok: false,
      message: 'Username and password required',
    });

  const foundUser = data.users.find((entry) => entry.user === user);

  if (!foundUser)
    return res
      .status(401)
      .json({ status: 409, ok: false, message: 'No such user' });

  const isCorrectPassword = await bcrypt.compare(password, foundUser.password);

  if (isCorrectPassword) {
    // JWT TOKEN HERE

    res.status(200).json({
      status: 200,
      ok: true,
      message: `User ${user} logged in successfully`,
    });
  } else {
    res.status(401).json({
      status: 401,
      ok: false,
      message: `Incorrect password and/or username`,
    });
  }
};

module.exports = { login };
