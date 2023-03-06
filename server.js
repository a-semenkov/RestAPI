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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/users', require('./routes/api/users'));

app.use('/*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json'))
    res.status(404).json({ code: 404, message: '404 Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server working on ${PORT}`));
