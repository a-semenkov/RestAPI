const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles)
      return res
        .status(401)
        .json({ status: 401, ok: false, message: 'Unauthorized' });

    const allRoles = [...allowedRoles];

    const result = req.roles.some((item) => allRoles.includes(item));

    if (!result)
      return res.status(401).json({
        status: 401,
        ok: false,
        message: "You don't have necessary permissions for this operation",
      });
    next();
  };
};

module.exports = verifyRoles;
