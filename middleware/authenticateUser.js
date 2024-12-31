const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

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

        // Ensure the ID is valid
        if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
            throw new Error('Invalid user ID in token.');
        }

        req.user = { id: decoded.id, roles: [decoded.role] }; // Set the user details in req.user
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};

module.exports = authenticateUser;

