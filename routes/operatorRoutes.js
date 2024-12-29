const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// Public routes
router.post('/register', operatorController.registerOperator);

// Admin-only routes
router.get('/all', authenticateUser, authorizeRoles(['Admin']), operatorController.getAllOperators);
router.get('/pending', authenticateUser, authorizeRoles(['Admin']), operatorController.getPendingOperators);
router.patch('/:id/status', authenticateUser, authorizeRoles(['Admin']), operatorController.manageOperatorStatus);

// Get operator by ID (Admin and Operator access)
router.get('/:id', authenticateUser, authorizeRoles(['Admin', 'Operator']), operatorController.getOperatorById);

// Delete operator by ID (Admin only)
router.delete('/:id', authenticateUser, authorizeRoles(['Admin']), operatorController.deleteOperatorById);

module.exports = router;
