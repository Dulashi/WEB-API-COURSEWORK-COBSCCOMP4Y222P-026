const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv'); // For loading environment variables
const connectToMongoDB = require('./config/MongoDB'); // Import the MongoDB connection function
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Load environment variables from .env file (for local development)
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            process.env.SWAGGER_SERVER_URL || '*', // Allow Swagger UI URL
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
});

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests
app.use(cors()); // Enable CORS

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define the port and other environment variables
const PORT = process.env.PORT || 3000; // Railway provides PORT in the environment
const MONGO_URI = process.env.MONGO_URI; // Railway provides MONGO_URI in the environment

// Connect to MongoDB and then start the server
connectToMongoDB(MONGO_URI) // Pass the MONGO_URI from environment
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to MongoDB:', err.message);
    });

// Socket.IO events (example)
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', require('./routes/authenticationRoutes')); // Authentication routes
app.use('/api/routes', require('./routes/routeRoutes')); // Routes for managing routes
app.use('/api/buses', require('./routes/busRoutes')); // Routes for managing buses
app.use('/api/trips', require('./routes/tripRoutes')); // Routes for managing trips
app.use('/api/bookings', require('./routes/bookingRoutes')); // Booking routes
app.use('/api/operators', require('./routes/operatorRoutes')); // Routes for operators
app.use('/api/commuters', require('./routes/commuterRoutes')); // Routes for commuters
