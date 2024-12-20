// server.js
const express = require('express');
const morgan = require('morgan');
const connectToMongoDB = require('./config/MongoDB'); // Import the MongoDB connection function

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests

// Sample Test Route
//app.get('/api/test', (req, res) => {
  //res.json({
    //message: 'Test route is working!',
    //success: true,
  //});
//});

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

  
// Use the authentication routes
const authRoutes = require('./routes/authenticationRoutes');
app.use('/api/auth', authRoutes);

// Use the routes Routes
const routeRoutes = require('./routes/Admin(NTC)Routes/routeRoutes'); 
app.use('/api/routes', routeRoutes); 

// Use the bus routes
const busRoutes = require('./routes/Admin(NTC)Routes/busRoutes');
app.use('/api/buses', busRoutes);

// Use the trip routes
const tripRoutes = require('./routes/Admin(NTC)Routes/tripRoutes');
app.use('/api/trips', tripRoutes);