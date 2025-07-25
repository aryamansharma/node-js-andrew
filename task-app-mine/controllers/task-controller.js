const Task = require('../models/task-model');

exports.getAllTasks = async (req, res) => {
    try {
        res.status(200).json({
            message: 'route not yet defined'
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