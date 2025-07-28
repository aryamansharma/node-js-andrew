const express = require('express');
const router = new express.Router();
const taskController = require('../controllers/task-controller');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/').get(taskController.getAllTasks).post(taskController.createTask);
router.route('/:id').get(taskController.getTask).delete(taskController.deleteTask).patch(taskController.updateTask);

module.exports = router;