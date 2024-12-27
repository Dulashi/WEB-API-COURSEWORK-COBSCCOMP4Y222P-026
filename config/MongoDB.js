// MongoDB.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Use the MONGO_URI from the .env file
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
module.exports = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};
