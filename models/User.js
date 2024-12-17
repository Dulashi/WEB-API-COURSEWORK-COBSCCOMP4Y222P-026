const mongoose = require('mongoose');

// schema for the user
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  roles: {
    type: String,
    enum: ['Admin', 'Operator', 'Commuter'], // Allowed roles
  },
});

// Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
