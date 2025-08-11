const Task = require('../models/task-model');

exports.getAllTasks = async (req, res) => {
    try {
        // one way for getting logged in users tasks
        // const tasks = await Task.find({ owner: req.user._id });

        const match = {};
        const sort = {};

        // for manipulating match object for filtering
        if (req.query.completed === 'true' || req.query.completed === 'false') {
            match.completed = req.query.completed === 'true';
        }

        // for manipulating sort object for sorting
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            // we are sending 'asc' or 'desc' options for sorting
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1; // here 1 means the field for which we are adding sorting feature, will be sorted in ascending order and -1 means descending
        }

        // another way is by using populate
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const skip = (page - 1) * limit;

        await req.user.populate({
            path: 'tasks',
            match, // this match is a filter object, like we pass in the find methods to filter data
            options: { // this options object can be used for pagination and sorting
                limit,
                skip,
                sort // this sort is a sorting object, if passed an empty object that means, 
                // no sorting is applied
            }
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