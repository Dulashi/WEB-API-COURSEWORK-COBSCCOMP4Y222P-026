const express = require('express');
const router = express.Router();
const busController = require('../../controllers/Admin_NTC_Controllers/busController');

// Route to add a new bus
router.post('/buses', busController.addBus);

// Route to get all list of buses
router.get('/buses', busController.getAllBuses);

// Route to get bus using permit number
router.get('/buses/permit/:permitNo', busController.getBusByPermitNo);

// Route to get bus using bus number
router.get('/buses/number/:busNumber', busController.getBusByBusNumber);

// Route to update bus details
router.put('/buses/:busNumber', busController.updateBusDetails);

// Route to delete a bus
router.delete('/buses/:busNumber', busController.deleteBus);

module.exports = router;
