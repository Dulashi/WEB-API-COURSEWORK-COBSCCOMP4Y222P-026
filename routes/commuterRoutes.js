const express = require('express');
const {
  searchBuses,
  sortBuses,
  viewSeats,
  bookSeat,
  processPayment,
  cancelBooking,
} = require('../controllers/commuterController');
const router = express.Router();

router.get('/search', searchBuses); // Search buses by departure station, arrival station, and date
router.get('/sort', sortBuses); // Sort buses
router.get('/trips/:tripId/seats', viewSeats); // View seats by tripId
router.post('/book-seat', bookSeat); // Book a seat
router.put('/cancel-booking/:bookingId', cancelBooking); // Cancel a booking
router.post('/payments', processPayment); // Process a payment

module.exports = router;
