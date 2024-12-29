const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
require('dotenv').config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Use .env for production

// SIGN UP
exports.signup = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, roles });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong during sign up.', details: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    if (user.roles.includes('Operator') && user.status !== 'Approved') {
      return res.status(403).json({ error: 'Your account is awaiting admin approval.' });
    }

    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully!', token });
  } catch (err) {
    res.status(500).json({ error: 'Error during login.', details: err.message });
  }
};
