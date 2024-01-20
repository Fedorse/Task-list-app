const { getDb } = require('../db');
const { ObjectId } = require('mongodb');


exports.getTasks = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.cookies['user_id'];
        const tasks = await db.collection('taskList').find({userId}).sort({ date: -1 }).toArray();

        res.json(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.addTask = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.cookies['user_id'];
        console.log('userId', req.cookies['user_id']);

        const taskData = {
            ...req.body,
            date: new Date(),
            userId: userId
        };
        // const taskData = {
        //     ...req.body,
        //     userId: userId,
        //     date: new Date(req.body.date) // Получаем дату из запроса
        // };

        const result = await db.collection('taskList').insertOne(taskData);

        res.status(201).json(result);
    } catch (error) {
        res.status(500).send(err.message);
    }
};

exports.getTaskById = async(req,res) => {
    try{
        const db = getDb()
        const taskId = new ObjectId(req.params.id);
        const task = await db.collection('taskList').findOne({ _id: taskId })

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
        const taskId = new ObjectId(req.params.id);
        const userId = req.cookies['user_id']; 

        const result = await db.collection('taskList').updateOne (
            { _id: taskId, userId: userId },
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
        const taskId = new ObjectId(req.params.id);
        const userId = req.cookies['user_id']; 

        const result = await db.collection('taskList').deleteOne({ _id: taskId, userId: userId });

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
