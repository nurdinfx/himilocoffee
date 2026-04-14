const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers, updateUserProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin only routes
router.get('/users', protect, admin, getUsers);

module.exports = router;