const express = require('express');
const { signup, login } = require('../controllers/authenticationController');
const router = express.Router();

// Routes
router.post('/signup', signup); // Public route
router.post('/login', login);   // Public route

module.exports = router;
