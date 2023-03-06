const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'serving', 'test.png'));
});

module.exports = router;
