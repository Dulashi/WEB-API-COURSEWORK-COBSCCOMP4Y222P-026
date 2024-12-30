const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authenticateUser = require('../middleware/authenticateUser');  // Import authenticate middleware
const authorizeRoles = require('../middleware/authorizeRoles');  // Import authorizeRoles middleware

// Route to add a new trip (Admin only)
router.post('/trips', authenticateUser, authorizeRoles(['Admin']), tripController.addTrip);

// Route to get all trips (Admin only)
router.get('/trips', authenticateUser, authorizeRoles(['Admin']), tripController.getAllTrips);

// Route to get a trip by ID (Admin only)
router.get('/trips/:id', authenticateUser, authorizeRoles(['Admin']), tripController.getTripById);

// Route to update a trip (Admin only)
router.put('/trips/:id', authenticateUser, authorizeRoles(['Admin']), tripController.updateTrip);

// Route to cancel a trip (Admin only)
router.delete('/trips/:id', authenticateUser, authorizeRoles(['Admin']), tripController.cancelTrip);

module.exports = router;
