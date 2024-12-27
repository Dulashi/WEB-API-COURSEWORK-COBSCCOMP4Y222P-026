const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Route to add a new trip
router.post('/trips', tripController.addTrip);

// Route to get all trips
router.get('/trips', tripController.getAllTrips);

// Route to get a trip by ID
router.get('/trips/:id', tripController.getTripById);

// Route to update a trip
router.put('/trips/:id', tripController.updateTrip);

// Route to cancel a trip
router.delete('/trips/:id', tripController.cancelTrip);

module.exports = router;
