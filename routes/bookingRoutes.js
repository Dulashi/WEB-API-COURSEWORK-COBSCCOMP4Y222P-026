const express = require('express');
const router = express.Router();
const { getBookingsByTrip, adminCancelBooking } = require('../controllers/bookingController');
const authenticateUser = require('../middleware/authenticateUser');  
const authorizeRoles = require('../middleware/authorizeRoles');  

/**
 * @swagger
 * /api/bookings/trips/{tripId}/bookings:
 *   get:
 *     summary: Get all bookings for a specific trip
 *     description: Admin can view all bookings for a particular trip by providing the trip ID.
 *     tags: [Admin - Bookings]
 *     parameters:
 *       - name: tripId
 *         in: path
 *         description: The ID of the trip to fetch bookings for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings for the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       seatNumber:
 *                         type: number
 *                       status:
 *                         type: string
 *                       tripId:
 *                         type: object
 *                         properties:
 *                           busName:
 *                             type: string
 *                           busNumber:
 *                             type: string
 *                           departureTime:
 *                             type: string
 *                             format: date-time
 *                           arrivalTime:
 *                             type: string
 *                             format: date-time
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Error fetching bookings
 */
router.get('/:tripId/bookings', authenticateUser, authorizeRoles(['Admin']), getBookingsByTrip);

/**
 * @swagger
 * /api/bookings/{bookingId}/cancel:
 *   delete:
 *     summary: Cancel a booking on behalf of a commuter
 *     description: Admin can cancel a commuter's booking by providing the booking ID. The seat will be made available again.
 *     tags: [Admin - Bookings]
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         description: The ID of the booking to cancel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully canceled the booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     seatNumber:
 *                       type: number
 *                     tripId:
 *                       type: object
 *                       properties:
 *                         busName:
 *                           type: string
 *                         busNumber:
 *                           type: string
 *                         departureTime:
 *                           type: string
 *                           format: date-time
 *                         arrivalTime:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Booking or Trip not found
 *       500:
 *         description: Error canceling booking
 */
router.delete('/:bookingId/cancel', authenticateUser, authorizeRoles(['Admin']), adminCancelBooking);

module.exports = router;
