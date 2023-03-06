const express = require('express');
const usersController = require('../../controllers/usersController');
const router = express.Router();

router
  .route('/')
  .get(usersController.getUsers)
  .post(usersController.createNewUser)
  .put(usersController.editUser)
  .delete(usersController.deleteUser);

router.route('/:id').get(usersController.getUserById);

module.exports = router;
