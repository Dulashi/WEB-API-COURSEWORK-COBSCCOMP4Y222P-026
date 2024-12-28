const express = require('express');
const {
  searchBuses,
  sortBuses,
  viewSeats,
  bookSeat,
  processPayment,
  cancelBooking,
  viewOwnBookings,
} = require('../controllers/commuterController');
const authenticateUser = require('../middleware/authenticateUser'); // Import middleware

const router = express.Router();

// Public Routes (no authentication required)
router.get('/search', searchBuses); // Search buses
router.get('/sort', sortBuses); // Sort buses

// Protected Routes (authentication required)
router.get('/trips/:tripId/seats', authenticateUser, viewSeats); // View seats by tripId
router.post('/book-seat', authenticateUser, bookSeat); // Book a seat
router.put('/cancel-booking/:bookingId', authenticateUser, cancelBooking); // Cancel a booking
router.post('/payments', authenticateUser, processPayment); // Process a payment
router.get('/my-bookings', authenticateUser, viewOwnBookings); // View user's own bookings

module.exports = router;
