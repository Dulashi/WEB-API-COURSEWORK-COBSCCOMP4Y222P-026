// server.js
const express = require('express');
const morgan = require('morgan');
const connectToMongoDB = require('./config/MongoDB'); // Import the MongoDB connection function

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests

// Define the port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and then start the server
connectToMongoDB() // Call the connection function
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB:', err.message);
  });


// Routes
app.use('/api/auth', require('./routes/authenticationRoutes')); // Authentication routes
app.use('/api/routes', require('./routes/routeRoutes')); // Routes for managing routes
app.use('/api/buses', require('./routes/busRoutes')); // Routes for managing buses
app.use('/api/trips', require('./routes/tripRoutes')); // Routes for managing trips
app.use('/api/bookings', require('./routes/bookingRoutes'));// Booking routes
app.use('/api/operators', require('./routes/operatorRoutes')); // Routes for operators
app.use('/api/commuters', require('./routes/commuterRoutes')); // Routes for commuters


