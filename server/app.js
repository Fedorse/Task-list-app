const express = require('express');
const path = require('path');
const { connectToDb } = require('./db');
const taskRoutes = require('./routes/taskRoutes');
const { pinoMiddleware,logger } = require('./logger')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid');


const server = express();
const port = 4000;

server.use(pinoMiddleware);
server.use(cookieParser())
server.use((req, res, next) => {
    if (!req.cookies['user_id']) {
      const userId = uuidv4();
      res.cookie('user_id', userId, { httpOnly: true});
      // bug phone
      // req.cookies['user_id'] = userId
    }
    next();
  });  
server.use(express.static(path.join(__dirname, '../client'))); 
server.use(express.json());
server.use('/api', taskRoutes);


connectToDb().then(() => {
    server.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}).catch(err => { 
    logger.error('Database connection failed', err)
});
