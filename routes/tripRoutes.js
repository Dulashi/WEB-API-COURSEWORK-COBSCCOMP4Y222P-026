const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authenticateUser = require('../middleware/authenticateUser');  
const authorizeRoles = require('../middleware/authorizeRoles');  

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Add new trips
 *     description: Admin can create one or more new trips.
 *     tags: [Admin - Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 routeNumber:
 *                   type: string
 *                 busNumber:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 departureTime:
 *                   type: string
 *                   format: time
 *                 arrivalTime:
 *                   type: string
 *                   format: time
 *                 seatAvailability:
 *                   type: number
 *                   example: 50
 *                 price:
 *                   type: number
 *                   example: 100
 *                 status:
 *                   type: string
 *                   enum:
 *                     - Active
 *                     - Inactive
 *                     - Canceled
 *     responses:
 *       201:
 *         description: Trips successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Trips added successfully'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error adding trips
 */
router.post('/', authenticateUser, authorizeRoles(['Admin']), tripController.addTrip);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     description: Admin can retrieve all trips.
 *     tags: [Admin - Trips]
 *     responses:
 *       200:
 *         description: Successfully retrieved all trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   routeNumber:
 *                     type: string
 *                   busNumber:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   departureTime:
 *                     type: string
 *                     format: time
 *                   arrivalTime:
 *                     type: string
 *                     format: time
 *                   seatAvailability:
 *                     type: number
 *                   price:
 *                     type: number
 *                   status:
 *                     type: string
 *       500:
 *         description: Error fetching trips
 */
router.get('/', authenticateUser, authorizeRoles(['Admin']), tripController.getAllTrips);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     description: Admin can retrieve a specific trip by its ID.
 *     tags: [Admin - Trips]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the trip
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved trip by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeNumber:
 *                   type: string
 *                 busNumber:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 departureTime:
 *                   type: string
 *                   format: time
 *                 arrivalTime:
 *                   type: string
 *                   format: time
 *                 seatAvailability:
 *                   type: number
 *                 price:
 *                   type: number
 *                 status:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Error fetching trip
 */
router.get('/:id', authenticateUser, authorizeRoles(['Admin']), tripController.getTripById);

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Update a trip
 *     description: Admin can update the details of an existing trip.
 *     tags: [Admin - Trips]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the trip
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeNumber:
 *                 type: string
 *               busNumber:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               departureTime:
 *                 type: string
 *                 format: time
 *               arrivalTime:
 *                 type: string
 *                 format: time
 *               seatAvailability:
 *                 type: number
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum:
 *                   - Active
 *                   - Inactive
 *                   - Canceled
 *     responses:
 *       200:
 *         description: Successfully updated the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Error updating trip
 */
router.put('/:id', authenticateUser, authorizeRoles(['Admin']), tripController.updateTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Cancel a trip
 *     description: Admin can cancel an existing trip.
 *     tags: [Admin - Trips]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the trip
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip canceled successfully
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Error canceling trip
 */
router.delete('/:id', authenticateUser, authorizeRoles(['Admin']), tripController.cancelTrip);

module.exports = router;
