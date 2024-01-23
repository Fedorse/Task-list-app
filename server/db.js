const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'myNewDatabase';

let db = null;

async function connectToDb() {
    const client = new MongoClient(url);
    try{
        await client.connect();
        console.log("Connected successfully to MongoDB");
        db = client.db(dbName);
        return db;
    } catch(err){
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }

} 

function getDb() {
    return db;
}

module.exports = { connectToDb, getDb };
