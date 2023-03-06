const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (msg, filename) => {
  const timestamp = format(new Date(), 'HH:mm:ss   dd-MM-yyyy');
  const item = `${timestamp}\t${uuid()}\t${msg}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs')))
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', filename),
      item
    );
  } catch (error) {
    console.error(error);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.headers.origin}\t${req.url}`,
    'requestLog.txt'
  );
  next();
};

module.exports = { logger, logEvents };
