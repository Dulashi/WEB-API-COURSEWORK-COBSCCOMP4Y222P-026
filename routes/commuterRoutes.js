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
const authenticateUser = require('../middleware/authenticateUser');  // Import middleware
const authorizeRoles = require('../middleware/authorizeRoles');  // Import authorizeRoles middleware

const router = express.Router();

// Public Routes (no authentication required)
router.get('/search', searchBuses); // Search buses
router.get('/sort', sortBuses); // Sort buses by criteria
router.get('/trips/:tripId/seats', viewSeats); // View seats for a specific trip

// Protected Routes (authentication and commuter role required)
router.post('/book-seat', authenticateUser, authorizeRoles(['Commuter']), bookSeat); // Book a seat
router.post('/payments', authenticateUser, authorizeRoles(['Commuter']), processPayment); // Process payment for a booking
router.put('/cancel-booking', authenticateUser, authorizeRoles(['Commuter']), cancelBooking); // Cancel a booking
router.get('/my-bookings', authenticateUser, authorizeRoles(['Commuter']), viewOwnBookings); // View commuter's own bookings

module.exports = router;
