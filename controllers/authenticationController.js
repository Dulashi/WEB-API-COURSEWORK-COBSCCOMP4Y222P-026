const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Operator = require('../models/Operator');
require('dotenv').config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // set in the .env file

// SIGN UP 
exports.signup = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    // Validate input
    if (!email || !password || !roles) {
      return res.status(400).json({ error: 'All fields are required: email, password, roles.' });
    }

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
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Something went wrong during sign up.', details: err.message });
  }
};

// Login for all users (Admin, Operators, Commuters)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if the user exists in User or Operator collections
    const user = await User.findOne({ email });
    const operator = await Operator.findOne({ email });

    if (!user && !operator) {
      return res.status(404).json({ error: 'Invalid credentials.' });
    }

    // Determine if the account is a standard user or an operator
    const account = user || operator;
    const role = user ? user.roles : 'Operator';

    // If it's an operator, check if their account is approved
    if (operator && operator.status !== 'Approved') {
      return res.status(403).json({ error: 'Your operator account is awaiting admin approval.' });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, account.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: account._id, email: account.email, role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Something went wrong during login.', details: err.message });
  }
};
