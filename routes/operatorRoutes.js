const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');

// Public routes
router.post('/register', operatorController.registerOperator);

// Admin-only routes
router.get('/all', operatorController.getAllOperators); // Get all operators
router.get('/Pending', operatorController.getPendingOperators); 
router.patch('/:id/status', operatorController.manageOperatorStatus); 

// Get operator by ID
router.get('/:id', operatorController.getOperatorById); // New route to get operator by ID

// Delete operator by ID
router.delete('/:id', operatorController.deleteOperatorById); // New route to delete operator by ID

module.exports = router;
