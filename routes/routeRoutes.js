const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticateUser = require('../middleware/authenticateUser');  // Import middleware
const authorizeRoles = require('../middleware/authorizeRoles');  // Import authorizeRoles middleware

// Search all routes (Admin only)
router.get('/', authenticateUser, authorizeRoles(['Admin']), routeController.searchRoutes);  // Search all routes

// Get a route by its route number (Admin only)
router.get('/:routeNumber', authenticateUser, authorizeRoles(['Admin']), routeController.getRouteByNumber);  // Get a route by its route number

// Create a new route (Admin only)
router.post('/', authenticateUser, authorizeRoles(['Admin']), routeController.createRoute);  // Create a new route

// Update an existing route (Admin only)
router.put('/:routeNumber', authenticateUser, authorizeRoles(['Admin']), routeController.updateRoute);  // Update an existing route

// Delete a route (Admin only)
router.delete('/:routeNumber', authenticateUser, authorizeRoles(['Admin']), routeController.deleteRoute);  // Delete a route

module.exports = router;
