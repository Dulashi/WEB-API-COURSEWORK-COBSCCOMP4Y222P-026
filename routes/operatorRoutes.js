const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

/**
 * @swagger
 * /api/operators/all:
 *   get:
 *     summary: Get all operators
 *     description: Admin can retrieve all registered operators.
 *     tags: [Admin - Operators]
 *     responses:
 *       200:
 *         description: Successfully retrieved all operators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *       500:
 *         description: Error fetching operators
 */
router.get('/all', authenticateUser, authorizeRoles(['Admin']), operatorController.getAllOperators);

/**
 * @swagger
 * /api/operators/{id}:
 *   get:
 *     summary: Get operator by ID
 *     description: Admin and Operators can retrieve details of an operator by ID.
 *     tags: [Admin - Operators]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the operator
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved operator by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: Operator not found
 *       500:
 *         description: Error fetching operator
 */
router.get('/:id', authenticateUser, authorizeRoles(['Admin', 'Operator']), operatorController.getOperatorById);

/**
 * @swagger
 * /api/operators/pending:
 *   get:
 *     summary: Get all pending operators
 *     description: Admin can retrieve all operators who are in 'Pending' status.
 *     tags: [Admin - Operators]
 *     responses:
 *       200:
 *         description: Successfully retrieved pending operators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *       500:
 *         description: Error fetching pending operators
 */
router.get('/pending', authenticateUser, authorizeRoles(['Admin']), operatorController.getPendingOperators);

/**
 * @swagger
 * /api/operators/{id}/status:
 *   patch:
 *     summary: Update operator status
 *     description: Admin can update the status of an operator (e.g., approve or reject).
 *     tags: [Admin - Operators]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the operator to update
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
 *               status:
 *                 type: string
 *                 description: The new status of the operator (e.g., 'approved', 'rejected')
 *                 example: 'approved'
 *     responses:
 *       200:
 *         description: Successfully updated operator status
 *       404:
 *         description: Operator not found
 *       500:
 *         description: Error updating operator status
 */
router.patch('/:id/status', authenticateUser, authorizeRoles(['Admin']), operatorController.manageOperatorStatus);

/**
 * @swagger
 * /api/operators/{id}:
 *   delete:
 *     summary: Delete operator by ID
 *     description: Admin can delete an operator by ID.
 *     tags: [Admin - Operators]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the operator to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted operator
 *       404:
 *         description: Operator not found
 *       500:
 *         description: Error deleting operator
 */
router.delete('/:id', authenticateUser, authorizeRoles(['Admin']), operatorController.deleteOperatorById);

/**
 * @swagger
 * /api/operators/register:
 *   post:
 *     summary: Register a new operator
 *     description: Allows new operators to register.
 *     tags: [Operator - Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               companyName:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful, awaiting admin approval
 *       400:
 *         description: Bad request (e.g., password mismatch, operator already exists)
 *       500:
 *         description: Server error
 */
router.post('/register', operatorController.registerOperator);

/**
 * @swagger
 * /api/operators/owned-buses:
 *   get:
 *     summary: Get owned buses
 *     description: Operator can view all buses owned by them.
 *     tags: [Operator - Buses]
 *     responses:
 *       200:
 *         description: Successfully retrieved owned buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   busNumber:
 *                     type: string
 *                   capacity:
 *                     type: number
 *       404:
 *         description: No buses found for the operator
 *       500:
 *         description: Server error
 */
router.get('/owned-buses', authenticateUser, authorizeRoles(['Operator']), operatorController.getOwnedBuses);

/**
 * @swagger
 * /api/operators/all-trips:
 *   get:
 *     summary: Get all trips for operator-owned buses
 *     description: Operator can view all trips for the buses they own.
 *     tags: [Operator - Trips]
 *     responses:
 *       200:
 *         description: Successfully retrieved trips
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
 *       404:
 *         description: No trips found for the operator
 *       500:
 *         description: Server error
 */
router.get('/all-trips', authenticateUser, authorizeRoles(['Operator']), operatorController.getAllTrips);

/**
 * @swagger
 * /api/operators/bus-trips:
 *   get:
 *     summary: Get trips for a specific bus on a date
 *     description: Operator can view trips for a specific bus on a given date.
 *     tags: [Operator - Trips]
 *     parameters:
 *       - name: busNumber
 *         in: query
 *         description: Bus number of the operator
 *         required: true
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         description: Date of the trip
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved trips for the bus on the given date
 *       404:
 *         description: No trips found for the given bus on the date
 *       500:
 *         description: Server error
 */
router.get('/bus-trips', authenticateUser, authorizeRoles(['Operator']), operatorController.getBusTrips);

/**
 * @swagger
 * /api/operators/all-bookings:
 *   get:
 *     summary: Get all bookings for operator-owned buses
 *     description: Operator can view all bookings for the buses they own.
 *     tags: [Operator - Bookings]
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seatNumber:
 *                     type: string
 *                   passengerName:
 *                     type: string
 *                   price:
 *                     type: number
 *       404:
 *         description: No bookings found for the operator
 *       500:
 *         description: Server error
 */
router.get('/all-bookings', authenticateUser, authorizeRoles(['Operator']), operatorController.getAllBookings);

/**
 * @swagger
 * /api/operators/bookings-for-bus:
 *   get:
 *     summary: Get bookings for a specific bus on a given date
 *     description: Operator can view all bookings for a specific bus on a given date.
 *     tags: [Operator - Bookings]
 *     parameters:
 *       - name: busNumber
 *         in: query
 *         description: Bus number of the operator
 *         required: true
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         description: Date for the bus bookings
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *       404:
 *         description: No bookings found for the bus on the date
 *       500:
 *         description: Server error
 */
router.get('/bookings-for-bus', authenticateUser, authorizeRoles(['Operator']), operatorController.getBookingsForBus);

/**
 * @swagger
 * /api/operators/replace-bus:
 *   post:
 *     summary: Replace bus for a trip
 *     description: Operator can replace the bus for a trip they own and notify the commuters.
 *     tags: [Operator - Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               newBusNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bus successfully replaced and commuters notified
 *       404:
 *         description: Trip or bus not found
 *       500:
 *         description: Server error
 */
router.post('/replace-bus', authenticateUser, authorizeRoles(['Operator']), operatorController.replaceBusInTrip);

/**
 * @swagger
 * /api/operators/cancel-trip:
 *   post:
 *     summary: Cancel a bus trip
 *     description: Operator can cancel a bus trip and notify commuters.
 *     tags: [Operator - Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trip successfully cancelled and commuters notified
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.post('/cancel-trip', authenticateUser, authorizeRoles(['Operator']), operatorController.cancelBusTrip);

module.exports = router;