// MongoDB.js
const mongoose = require('mongoose');


const MONGO_URI = "mongodb+srv://Dulashi:newDB2002NTC@cluster0.5p9d1.mongodb.net/National_Transport_DB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
module.exports = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: false, useUnifiedTopology: false });
    console.log('Connected to MongoDB Atlas successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

