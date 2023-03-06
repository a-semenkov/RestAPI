const express = require('express');

const router = express.Router();
const data = {};
data.users = require('../../data/users.json');

router
  .route('/')
  .get((req, res) => res.json(data.users))
  .post((req, res) => {
    res.json({
      id: data.users[data.users.length - 1].id + 1,
      name: req.body.name,
      mail: req.body.mail,
    });
  })
  .put((req, res) => {})
  .delete((req, res) => {
    res.json({ id: req.body.id });
  });

router.route('/:id').get((req, res) => {
  res.json(data.users.filter((user) => user.id === Number(req.params.id)));
});

module.exports = router;
