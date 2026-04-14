const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const mongoose = require('mongoose');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 0. Explicit DB Check - Ensure we are connected
    if (mongoose.connection.readyState !== 1) {
      console.error('DB Connection state is NOT connected:', mongoose.connection.readyState);
      return res.status(500).json({ message: 'Database connection issue. Please try again in 30 seconds.' });
    }

    // 1. Explicit Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required and must be a string' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // 2. Check if user exists
    const sanitizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: sanitizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3. Create user
    const user = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      password, // Pre-save hook will hash this
      role: role && ['customer', 'admin', 'driver'].includes(role) ? role : 'customer',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Registration Error Phase 2:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Distinguish between Mongoose and generic error
    const detailedMessage = error.name === 'ValidationError' 
      ? Object.values(error.errors).map(e => e.message).join(', ')
      : error.message;

    res.status(500).json({ 
      message: `System error: ${error.name}`, 
      error: detailedMessage,
      diagnostic: 'Registration failed at creation stage'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        phone: user.phone
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.phone = req.body.phone || user.phone;
      user.addresses = req.body.addresses || user.addresses;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { authUser, registerUser, getUserProfile, getUsers, updateUserProfile };
