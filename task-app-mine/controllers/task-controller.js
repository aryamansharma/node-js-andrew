const Task = require('../models/task-model');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({
            data: tasks
        });
    } catch (err) {
        es.send(500).json({
            message: 'Something went wrong'
        });
    }
}

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
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
        const task = await Task.findById(id);
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
        const id = req.params.id;
        const task = await Task.findByIdAndUpdate(id, req.body, {
            runValidators: true,
            new: true
        });
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
        const task = await Task.findByIdAndDelete(id);
        res.status(200).json({
            data: task
        });
    } catch (err) {
        res.send(500).json({
            message: 'Something went wrong'
        });
    }
}