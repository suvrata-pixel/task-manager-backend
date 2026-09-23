const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { taskValidation } = require('../validators/taskValidator');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');

router.post('/', authMiddleware, taskValidation, createTask);
router.get('/', authMiddleware, getTasks);
router.put('/:id', authMiddleware, taskValidation, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
