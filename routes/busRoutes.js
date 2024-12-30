const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const authenticateUser = require('../middleware/authenticateUser');  
const authorizeRoles = require('../middleware/authorizeRoles');  

// Route to add a new bus (Admin only)
router.post('/buses', authenticateUser, authorizeRoles(['Admin']), busController.addBus);

// Route to get all list of buses (Admin only)
router.get('/buses', authenticateUser, authorizeRoles(['Admin']), busController.getAllBuses);

// Route to get bus using permit number (Admin only)
router.get('/buses/permit/:permitNo', authenticateUser, authorizeRoles(['Admin']), busController.getBusByPermitNo);

// Route to get bus using bus number (Admin only)
router.get('/buses/number/:busNumber', authenticateUser, authorizeRoles(['Admin']), busController.getBusByBusNumber);

// Route to update bus details (Admin only)
router.put('/buses/:busNumber', authenticateUser, authorizeRoles(['Admin']), busController.updateBusDetails);

// Route to delete a bus (Admin only)
router.delete('/buses/:busNumber', authenticateUser, authorizeRoles(['Admin']), busController.deleteBus);

module.exports = router;
