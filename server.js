const express = require('express');
const { logEvents, logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger);

const whitelist = [];
const corsOptions = {
  origin: (origin, cb) => {
    // TODO: remove in prod
    if (whitelist.includes(origin) || !origin) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS policy'));
    }
  },
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'serving', 'test.png'));
});

app.all('/*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json'))
    res.json({ code: 404, message: '404 Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server working on ${PORT}`));
