const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { start } = require('repl');

exports.logEvents = async (msg) => {
  const timestamp = format(new Date(), 'HH:mm:ss   dd-mm-yyyy');
  const item = `${timestamp}   ${uuid()}   ${msg}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, 'logs')))
      await fsPromises.mkdir(path.join(__dirname, 'logs'));
    await fsPromises.appendFile(
      path.join(__dirname, 'logs', 'eventlog.txt'),
      item
    );
  } catch (error) {
    console.error(error);
  }
};
