const { getDb } = require('../db');

exports.getTasks = async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.collection('taskList').find({}).toArray();
        res.json(tasks);
    } catch (error) {
        res.status(500).send(err.message);
    }
};

exports.addTask = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('taskList').insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).send(err.message);
    }
};

exports.getTaskById = async(req,res) => {
    try{
        const db = getDb()
        const taskId = req.params.id;
        const task = await db.collection('taskList').findOne({_id: taskId})

        if(!task) {
            return res.status(404).send('Task not found')
        }
        res.json(task)
    } catch (error) {
        res.status(500).send(err.message)
    }
}

exports.updateTaskByID = async(req,res) => {
    try{
        const db = getDb()
        const taskId = req.params.id
        const result = await db.collection('taskList').updateOne (
            { _id: taskId },
            { $set: req.body }
        )

        if (result.matchedCount === 0) {
            return res.status(404).send('Task not found');
        }

        res.status(200).send('Task successfully updated');
    } catch (error) {
        res.status(500).send(err.message);
    }
};

exports.removeTask = async (req, res) => {
    try {
        const db = getDb()
        const taskId = req.params.id;
        const result = await db.collection('taskList').deleteOne({ _id: taskId });

        if (result.deletedCount === 0) {
            return res.status(404).send('Task not found');
    }
        res.status(200).send('Task successfuly deleted')
    } catch (error) {
    res.status(500).send(err.message)
    }
}





// REST API

// /tasks
// GET /tasks - get all tasks
// POST /tasks - create task

// /tasks/:id 
// GET  /tasks/:id - get task detail
// PUT /tasks/:id - update task
// DELETE /tasks/:id - remove task
