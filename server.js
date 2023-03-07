const express = require('express');
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOpts');
const path = require('path');
const corsMiddleware = require('./middleware/cors');

const PORT = process.env.PORT || 3000;
const app = express();

// log events
app.use(logger);

// CORS
app.use(corsMiddleware);
app.use(cors(corsOptions));

// decode form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

// protected JWT routes
app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));

app.use('/*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json'))
    res.status(404).json({ status: 404, ok: false, message: '404 Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server working on ${PORT}`));
