const pino = require('pino')
const fs = require('fs');
const path = require('path');

const getLogLevel = () => {
    if(process.env.ENV === 'prod') {
        return'error'
    } else {
        return'info'
    }
}

const logFilePath = path.join(__dirname, 'logs', 'app.log'); 
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });


const logger = pino({
    level: getLogLevel(),
  },logStream);

module.exports = logger;
