const jwt = require('jsonwebtoken');
require('dotenv').config();

const data = {
  users: require('../model/users.json'),
};

const TOKEN_EXPIRES_IN = '30s';

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({
      status: 401,
      ok: false,
      message: 'Unauthorized',
    });

  const refreshToken = cookies.jwt;

  const foundUser = data.users.find(
    (entry) => entry.refreshToken === refreshToken
  );

  if (!foundUser)
    return res
      .status(403)
      .json({ status: 403, ok: false, message: 'Forbidden' });

  // evaluate jwt
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_REFRESH, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res
        .status(403)
        .json({ status: 403, ok: false, message: 'Forbidden' });
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );
    res.status(200).json({ status: 200, ok: true, token: accessToken });
  });
};

module.exports = { handleRefreshToken };
