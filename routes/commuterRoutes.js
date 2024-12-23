const express = require('express');
const { searchBuses } = require('../controllers/commuterController');
const router = express.Router();

router.get('/search', searchBuses); // Search buses by departure station, arrival station, and date
router.get('/sort', sortBuses); // Sort Buses

module.exports = router;
