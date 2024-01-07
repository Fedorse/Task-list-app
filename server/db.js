const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'myNewDatabase';

let db = null;

async function connectToDb() {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db(dbName);
    return db;
}

function getDb() {
    return db;
}

module.exports = { connectToDb, getDb };
