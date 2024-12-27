const express = require('express');
const { searchBuses } = require('../controllers/commuterController');
const router = express.Router();

router.get('/search', searchBuses); // Search buses by departure station, arrival station, and date
router.get('/sort', sortBuses); // Sort Buses
router.get('/trips/:tripId/seats', viewSeats); // Defined the route for viewing seats by tripId
router.post('/book-seat', bookingController.bookSeat);// Route for booking a seat
router.put('/cancel-booking/:bookingId', bookingController.cancelBooking); // Route for canceling a booking
router.post('/payments', processPayment); // route for making the payments


module.exports = router;

