const express = require('express');
const router = express.Router();
const { getBookingsByTrip, adminCancelBooking } = require('../controllers/bookingController');
const authenticateUser = require('../middleware/authenticateUser');  
const authorizeRoles = require('../middleware/authorizeRoles');  

// Get all bookings for a specific trip (Admin only)
router.get('/trips/:tripId/bookings', authenticateUser, authorizeRoles(['Admin']), getBookingsByTrip);

// Cancel a booking on behalf of a commuter (Admin only)
router.delete('/bookings/:bookingId/cancel', authenticateUser, authorizeRoles(['Admin']), adminCancelBooking);

module.exports = router;
