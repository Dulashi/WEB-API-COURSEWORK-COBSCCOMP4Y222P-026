const express = require('express');
const morgan = require('morgan');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests

// Sample Test Route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test route is working!',
    success: true,
  });
});

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
