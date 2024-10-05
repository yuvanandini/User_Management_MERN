// server/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone Number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Validates 10-digit phone numbers
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: [true, 'Email ID is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Simple email regex
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
