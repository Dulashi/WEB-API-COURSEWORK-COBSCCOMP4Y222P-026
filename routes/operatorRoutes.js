const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// Public routes
router.post('/register', operatorController.registerOperator);

// Admin-only routes
router.get('/all', authenticateUser, authorizeRoles(['Admin']), operatorController.getAllOperators);
router.get('/pending', authenticateUser, authorizeRoles(['Admin']), operatorController.getPendingOperators);
router.patch('/:id/status', authenticateUser, authorizeRoles(['Admin']), operatorController.manageOperatorStatus);
router.delete('/:id', authenticateUser, authorizeRoles(['Admin']), operatorController.deleteOperatorById); // Delete operator by ID (Admin only)

// Get operator by ID (Admin and Operator access)
router.get('/:id', authenticateUser, authorizeRoles(['Admin', 'Operator']), operatorController.getOperatorById);

// Get owned buses (Operator only)
router.get('/owned-buses', authenticateUser, authorizeRoles(['Operator']), operatorController.getOwnedBuses);

// Get trips for owned buses (Operator only)
router.get('/bus-trips', authenticateUser, authorizeRoles(['Operator']), operatorController.getBusTrips);

// Get all trips (Operator only)
router.get('/all-trips', authenticateUser, authorizeRoles(['Operator']), operatorController.getAllTrips);

// Get all bookings (Operator only)
router.get('/all-bookings', authenticateUser, authorizeRoles(['Operator']), operatorController.getAllBookings);

// Get bookings for a specific bus (Operator only)
router.get('/bookings-for-bus', authenticateUser, authorizeRoles(['Operator']), operatorController.getBookingsForBus);

// Replace a bus in a trip (Operator only)
router.post('/replace-bus', authenticateUser, authorizeRoles(['Operator']), operatorController.replaceBusInTrip);

// Cancel a bus trip (Operator only)
router.post('/cancel-trip', authenticateUser, authorizeRoles(['Operator']), operatorController.cancelBusTrip);

module.exports = router;

