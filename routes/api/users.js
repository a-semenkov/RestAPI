const express = require('express');
const USER_ROLES = require('../../config/userRoles');
const usersController = require('../../controllers/usersController');
const verifyRoles = require('../../middleware/verifyRoles');
const router = express.Router();

router
  .route('/')
  .get(usersController.getUsers)

  .put(
    verifyRoles(USER_ROLES.admin, USER_ROLES.moderator),
    usersController.editUser
  )
  .delete(verifyRoles(USER_ROLES.admin), usersController.deleteUser);

router.route('/:id').get(usersController.getUserById);

module.exports = router;
