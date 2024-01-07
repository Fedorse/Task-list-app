const { getDb } = require('../db');

exports.getTasks = async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.collection('taskList').find({}).toArray();
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.addTask = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('taskList').insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
