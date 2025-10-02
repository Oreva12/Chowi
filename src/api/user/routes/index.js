const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userController = require('../controllers/userController');
const authMiddleware = require('../../../middleware/authMiddleware');

// Authentication routes (no protection needed)
router.use('/auth', authRoutes);

// Protected user routes
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);

module.exports = router;