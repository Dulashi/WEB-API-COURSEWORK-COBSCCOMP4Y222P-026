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
const authorizeRoles = require('../middleware/authorizeRoles'); // Import authorizeRoles middleware

const router = express.Router();

/**
 * @swagger
 * /api/commuters/search:
 *   get:
 *     summary: Search buses based on departure and arrival stations and date
 *     description: >
 *       Search buses based on the departure station, arrival station,
 *       and the selected travel date.
 *     tags: [Commuter]
 *     parameters:
 *       - name: departureStation
 *         in: query
 *         required: true
 *         description: Departure station
 *         schema:
 *           type: string
 *       - name: arrivalStation
 *         in: query
 *         required: true
 *         description: Arrival station
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         required: true
 *         description: Travel date (format: YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully found buses
 *       404:
 *         description: No buses found for the selected criteria
 *       500:
 *         description: Server error
 */
router.get('/search', searchBuses); // Search buses

/**
 * @swagger
 * /api/commuters/sort:
 *   get:
 *     summary: Sort buses by a specified criterion
 *     description: Sort buses by fare, departure time, arrival time, seat availability, or bus name.
 *     tags: [Commuter]
 *     parameters:
 *       - name: criteria
 *         in: query
 *         required: true
 *         description: Sorting criteria
 *         schema:
 *           type: string
 *           enum: [fare, departure, arrival, seatAvailability, name]
 *     responses:
 *       200:
 *         description: Successfully sorted buses
 *       400:
 *         description: Invalid sorting criteria
 *       500:
 *         description: Server error
 */
router.get('/sort', sortBuses); // Sort buses by criteria

/**
 * @swagger
 * /api/commuters/trips/{tripId}/seats:
 *   get:
 *     summary: View available seats for a specific bus trip
 *     description: View available seats on a specific bus trip based on its tripId.
 *     tags: [Commuter]
 *     parameters:
 *       - name: tripId
 *         in: path
 *         required: true
 *         description: Trip ID to view seats for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched seat availability
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.get('/trips/:tripId/seats', viewSeats); // View seats for a specific trip

/**
 * @swagger
 * /api/commuters/book-seat:
 *   post:
 *     summary: Book a seat for a commuter
 *     description: Allow a commuter to book a seat on a specific bus trip.
 *     tags: [Commuter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               passengerName:
 *                 type: string
 *               seatNumber:
 *                 type: integer
 *               boardingPlace:
 *                 type: string
 *               destinationPlace:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seat booked successfully
 *       401:
 *         description: Unauthorized. Please log in.
 *       400:
 *         description: Seat not available
 *       500:
 *         description: Error booking seat
 */
router.post('/book-seat', authenticateUser, authorizeRoles(['Commuter']), bookSeat); // Book a seat

/**
 * @swagger
 * /api/commuters/payments:
 *   post:
 *     summary: Process payment for a booking
 *     description: Process the payment for a confirmed booking and generate a booking token.
 *     tags: [Commuter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               cardDetails:
 *                 type: object
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *                   expirationDate:
 *                     type: string
 *                   cardHolderName:
 *                     type: string
 *                   cvv:
 *                     type: string
 *     responses:
 *       200:
 *         description: Payment successful
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Booking is not in a valid state for payment
 *       500:
 *         description: Error processing payment
 */
router.post('/payments', authenticateUser, authorizeRoles(['Commuter']), processPayment); // Process payment for a booking

/**
 * @swagger
 * /api/commuters/cancel-booking:
 *   put:
 *     summary: Cancel a confirmed booking
 *     description: Allow a commuter to cancel their booking by providing the booking ID and token.
 *     tags: [Commuter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               bookingToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Invalid booking token
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Error cancelling booking
 */
router.put('/cancel-booking', authenticateUser, authorizeRoles(['Commuter']), cancelBooking); // Cancel a booking

/**
 * @swagger
 * /api/commuters/my-bookings:
 *   get:
 *     summary: View a commuter's own bookings
 *     description: Allow a commuter to view their own booking details.
 *     tags: [Commuter]
 *     responses:
 *       200:
 *         description: Successfully fetched commuter bookings
 *       401:
 *         description: Unauthorized. Please log in.
 *       404:
 *         description: No bookings found
 *       500:
 *         description: Error fetching bookings
 */
router.get('/my-bookings', authenticateUser, authorizeRoles(['Commuter']), viewOwnBookings); // View commuter's own bookings

module.exports = router;