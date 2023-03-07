const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const data = {
  users: require('../model/users.json'),
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      status: 400,
      ok: false,
      message: 'Username and password required',
    });

  const foundUser = data.users.find((entry) => entry.username === username);

  if (!foundUser)
    return res
      .status(401)
      .json({ status: 409, ok: false, message: 'No such user' });

  const isCorrectPassword = await bcrypt.compare(password, foundUser.password);

  if (isCorrectPassword) {
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_REFRESH,
      { expiresIn: '1d' }
    );

    // store access token

    const filteredUsers = data.users.filter(
      (entry) => entry.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };

    data.users = [...filteredUsers, currentUser];
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(data.users)
    );

    // send jwt as http-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: 200,
      ok: true,
      token: accessToken,
      payload: { username, id: foundUser.id },
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
