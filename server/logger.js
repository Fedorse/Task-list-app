const pino = require('pino')
const fs = require('fs');
const path = require('path');
const pinoHttp = require('pino-http');

const getLogLevel = () => {
    if(process.env.ENV === 'prod') {
        return'error'
    } else {
        return'info'
    }
}

const logFilePath = process.env.ENV === 'prod' 
    ? path.join(__dirname, 'logs', 'prodApp.log')
    : path.join(__dirname, 'logs', 'devApp.log');

const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });


const logger = pino({
    level: getLogLevel(),
  },logStream);

  const pinoMiddleware = pinoHttp({
    logger: logger,
    autoLogging: true
  });

module.exports = {logger,pinoMiddleware};
