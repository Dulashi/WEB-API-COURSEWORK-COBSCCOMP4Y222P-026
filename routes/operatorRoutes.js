const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');

// Public routes
router.post('/register', operatorController.registerOperator);

// Admin-only routes
router.get('/all', operatorController.getAllOperators); // Get all operators
router.get('/Pending', operatorController.getPendingOperators); 
router.patch('/:id/status', operatorController.manageOperatorStatus); 

module.exports = router;
