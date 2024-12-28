const jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Retrieve JWT_SECRET from .env file

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token using secret

    req.user = decoded; // Attach user data (id and roles) to the request object
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
  }
};

module.exports = authenticateUser;
