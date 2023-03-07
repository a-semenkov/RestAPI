const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, cb) => {
    // TODO: remove in prod
    if (allowedOrigins.includes(origin) || !origin) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS policy'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
