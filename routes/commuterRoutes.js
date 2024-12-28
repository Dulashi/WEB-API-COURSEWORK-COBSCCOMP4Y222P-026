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
router.get('/sort', sortBuses); // Sort buses by criteria

// Protected Routes (authentication required)
router.get('/trips/:tripId/seats', authenticateUser, viewSeats); // View seats for a specific trip
router.post('/book-seat', authenticateUser, bookSeat); // Book a seat
router.post('/payments', authenticateUser, processPayment); // Process payment for a booking
router.put('/cancel-booking', authenticateUser, cancelBooking); // Cancel a booking
router.get('/my-bookings', authenticateUser, viewOwnBookings); // View commuter's own bookings

module.exports = router;
