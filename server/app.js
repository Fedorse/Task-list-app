const express = require('express');
const path = require('path');
const { connectToDb } = require('./db');
const taskRoutes = require('./routes/taskRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');

const server = express();
const port = 3000;


const pinoMiddleware = pinoHttp({
    logger: logger,
    autoLogging: true
  });

server.use(pinoMiddleware);
server.use(express.static(path.join(__dirname, '../client'))); 
server.use(express.json());
server.use('/api', taskRoutes);

  


connectToDb().then(() => {
    server.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}).catch(err => { 
    logger.info('Database connection failed', err)
});
