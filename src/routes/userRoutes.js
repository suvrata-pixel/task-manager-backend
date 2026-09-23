const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { getAllUsers, getMyProfile, deleteUser } = require('../controllers/userController');

router.get('/', authMiddleware, requireRole('admin'), getAllUsers);
router.get('/me', authMiddleware, getMyProfile);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUser);

module.exports = router;
