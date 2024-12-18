const express = require('express');
const { signup, login } = require('../controllers/authenticationController'); 
const router = express.Router();

// Routes
router.post('/signup', signup); // Sign up route
router.post('/login', login);   // Login route

module.exports = router;
