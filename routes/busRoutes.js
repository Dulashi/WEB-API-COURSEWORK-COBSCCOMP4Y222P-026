const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const authenticateUser = require('../middleware/authenticateUser');  
const authorizeRoles = require('../middleware/authorizeRoles');  

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Add new buses
 *     description: Admin can add one or more buses at once by providing bus details (bus number, name, type, permit number, and operator ID).
 *     tags: [Admin - Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busNumber:
 *                 type: string
 *                 description: Unique bus number
 *               busName:
 *                 type: string
 *                 description: Name of the bus
 *               busType:
 *                 type: string
 *                 description: Type of the bus (e.g., 'Luxury', 'Regular')
 *               permitNumber:
 *                 type: string
 *                 description: Permit number of the bus
 *               operatorId:
 *                 type: string
 *                 description: Operator ID associated with the bus
 *             required:
 *               - busNumber
 *               - busName
 *               - busType
 *               - permitNumber
 *               - operatorId
 *     responses:
 *       201:
 *         description: Buses added successfully
 *       500:
 *         description: Error adding buses
 */
router.post('/', authenticateUser, authorizeRoles(['Admin']), busController.addBus);

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses
 *     description: Admin can view a list of all buses.
 *     tags: [Admin - Buses]
 *     responses:
 *       200:
 *         description: Successfully retrieved all buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   busNumber:
 *                     type: string
 *                   busName:
 *                     type: string
 *                   busType:
 *                     type: string
 *                   permitNumber:
 *                     type: string
 *                   operatorId:
 *                     type: string
 *       500:
 *         description: Error retrieving buses
 */
router.get('/', authenticateUser, authorizeRoles(['Admin']), busController.getAllBuses);

/**
 * @swagger
 * /api/buses/permit/{permitNo}:
 *   get:
 *     summary: Get bus by permit number
 *     description: Admin can retrieve a bus by its permit number.
 *     tags: [Admin - Buses]
 *     parameters:
 *       - name: permitNo
 *         in: path
 *         description: The permit number of the bus
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved bus by permit number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 busNumber:
 *                   type: string
 *                 busName:
 *                   type: string
 *                 busType:
 *                   type: string
 *                 permitNumber:
 *                   type: string
 *                 operatorId:
 *                   type: string
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Error retrieving bus by permit number
 */
router.get('/permit/:permitNo', authenticateUser, authorizeRoles(['Admin']), busController.getBusByPermitNo);

/**
 * @swagger
 * /api/buses/number/{busNumber}:
 *   get:
 *     summary: Get bus by bus number
 *     description: Admin can retrieve a bus by its bus number.
 *     tags: [Admin - Buses]
 *     parameters:
 *       - name: busNumber
 *         in: path
 *         description: The bus number of the bus
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved bus by bus number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 busNumber:
 *                   type: string
 *                 busName:
 *                   type: string
 *                 busType:
 *                   type: string
 *                 permitNumber:
 *                   type: string
 *                 operatorId:
 *                   type: string
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Error retrieving bus by bus number
 */
router.get('/number/:busNumber', authenticateUser, authorizeRoles(['Admin']), busController.getBusByBusNumber);

/**
 * @swagger
 * /api/buses/{busNumber}:
 *   put:
 *     summary: Update bus details
 *     description: Admin can update bus details using the bus number.
 *     tags: [Admin - Buses]
 *     parameters:
 *       - name: busNumber
 *         in: path
 *         description: The bus number to update details for
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
 *               busName:
 *                 type: string
 *               busType:
 *                 type: string
 *               permitNumber:
 *                 type: string
 *               operatorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated bus details
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Error updating bus details
 */
router.put('/:busNumber', authenticateUser, authorizeRoles(['Admin']), busController.updateBusDetails);

/**
 * @swagger
 * /api/buses/{busNumber}:
 *   delete:
 *     summary: Delete a bus
 *     description: Admin can delete a bus using the bus number.
 *     tags: [Admin - Buses]
 *     parameters:
 *       - name: busNumber
 *         in: path
 *         description: The bus number of the bus to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the bus
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Error deleting bus
 */
router.delete('/:busNumber', authenticateUser, authorizeRoles(['Admin']), busController.deleteBus);

module.exports = router;

