const { body } = require('express-validator');

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be pending or completed')
];

module.exports = { taskValidation };
