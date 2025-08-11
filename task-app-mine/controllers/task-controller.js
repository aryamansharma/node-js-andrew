const Task = require('../models/task-model');

exports.getAllTasks = async (req, res) => {
    try {
        // one way for getting logged in users tasks
        // const tasks = await Task.find({ owner: req.user._id });

        const match = {};

        if (req.query.completed === 'true' || req.query.completed === 'false') {
            match.completed = JSON.parse(req.query.completed);
        }


        // another way is by using populate
        // .execPopulate method is not needed anymore.
        await req.user.populate({
            path: 'tasks',
            match // this match is a filter object, like we pass in the find methods to filter data
        });

        res.status(200).json({
            data: req.user.tasks
        });
    } catch (err) {
        res.send(500).json({
            message: 'Something went wrong'
        });
    }
}

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            owner: req.user._id
        });
        res.status(200).json({
            data: task
        });
    } catch (err) {
        res.send(500).json({
            message: 'Something went wrong'
        });
    }
}

exports.getTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id, owner: req.user._id });

        if (!task) res.status(404).send();

        res.status(200).json({
            data: task
        });
    } catch (err) {
        res.send(500).json({
            message: 'Something went wrong'
        });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const reqBody = req.body;
        const updates = Object.keys(reqBody);
        const allowedUpdates = ['description', 'completed'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) return res.status(400).json({
            message: 'Invalid operation'
        });

        const id = req.params.id;
        const task = await Task.findOne({ _id: id, owner: req.user._id });

        if (!task) res.status(404).json();


        updates.forEach((update) => {
            task[update] = reqBody[update];
        });

        await task.save();

        res.status(200).json({
            success: 'SUCCESS',
            data: task
        });
    } catch (err) {
        res.send(500).json({
            success: 'FAILURE',
            message: 'Something went wrong'
        });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });

        if (!task) res.status(404).send();
        res.status(200).json({
            data: task
        });
    } catch (err) {
        res.send(500).json({
            message: 'Something went wrong'
        });
    }
}