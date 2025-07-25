const express = require('express');
const router = new express.Router();
const taskController = require('../controllers/task-controller');

router.route('/').get(taskController.getAllTasks).post(taskController.createTask);

module.exports = router;