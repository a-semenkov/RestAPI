const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader)
    return res
      .status(401)
      .json({ status: 401, ok: false, message: 'Unauthorized' });

  const authToken = authHeader.split(' ')[1];

  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        status: 403,
        ok: false,
        message: 'Forbidden: incorrect access token',
      });
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
