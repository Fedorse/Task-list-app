const express = require('express');
const path = require('path');
const { connectToDb } = require('./db');
const taskRoutes = require('./routes/taskRoutes');
const server = express();
const port = 3000;

// pino log 
//static

server.use(express.static(path.join(__dirname, '../client'))); 
server.use(express.json());
server.use('/api', taskRoutes);


connectToDb().then(() => {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch(err => {
    console.error('Database connection failed', err);
});
