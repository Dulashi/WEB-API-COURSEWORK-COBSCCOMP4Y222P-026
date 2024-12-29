const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

const authenticateUser = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
  
      console.log('Decoded token:', decoded); // Log the token
      req.user = { id: decoded.id, roles: decoded.roles }; // Attach id (not _id) and roles
      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
  };

module.exports = authenticateUser;
