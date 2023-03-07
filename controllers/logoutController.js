const fsPromises = require('fs').promises;
const path = require('path');

const data = {
  users: require('../model/users.json'),
};

const logout = async (req, res) => {
  // should delete access token on frontend
  const cookies = req.cookies;
  console.log(cookies);

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = data.users.find(
    (entry) => entry.refreshToken === refreshToken
  );

  console.log(foundUser);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete token from the db

  const users = data.users.filter(
    (entry) => entry.refreshToken !== foundUser.refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: '' };
  data.users = [...users, currentUser];

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(data.users)
  );

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure:true for https
  res.sendStatus(204);
};

module.exports = { logout };
