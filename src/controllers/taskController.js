const { validationResult } = require('express-validator');
const prisma = require('../utils/prismaClient');

async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'pending',
        userId: req.user.id
      }
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function getTasks(req, res, next) {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const tasks = await prisma.task.findMany({ where });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, status } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? task.title,
        description: description ?? task.description,
        status: status ?? task.status
      }
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.task.delete({ where: { id } });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
