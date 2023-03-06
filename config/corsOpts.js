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

module.exports = corsOptions;
