const express = require('express');
const router = express.Router();
const { getBookingsByTrip, adminCancelBooking } = require('../controllers/bookingController');

// Get all bookings for a specific trip
router.get('/trips/:tripId/bookings', getBookingsByTrip);

// Cancel a booking on behalf of a commuter
router.delete('/bookings/:bookingId/cancel', adminCancelBooking);

module.exports = router;
