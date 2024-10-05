// server/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/users
// @desc    Create a new user
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, address } = req.body;

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ errors: messages });
    }
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ errors: ['Email already exists'] });
    }
    res.status(500).json({ errors: ['Server Error'] });
  }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ errors: ['Server Error'] });
  }
});

// @route   GET /api/users/:id
// @desc    Get a single user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ errors: ['Server Error'] });
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user by ID
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, address } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;
    user.address = address || user.address;

    await user.save();
    res.json(user);
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ errors: messages });
    }
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ errors: ['Email already exists'] });
    }
    res.status(500).json({ errors: ['Server Error'] });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }

    await user.remove();
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ errors: ['Server Error'] });
  }
});

module.exports = router;
