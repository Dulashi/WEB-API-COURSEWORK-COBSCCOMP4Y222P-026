const express = require('express');
const router = express.Router();
const routeController = require('../controllers/Admin(NTC)Controllers/routeController');

// Search all routes
router.get('/', routeController.searchRoutes);

// Get a route by its route number
router.get('/:routeNumber', routeController.getRouteByNumber);

// Create a new route
router.post('/', routeController.createRoute);

// Update an existing route
router.put('/:routeNumber', routeController.updateRoute);

// Delete a route
router.delete('/:routeNumber', routeController.deleteRoute);

module.exports = router;
