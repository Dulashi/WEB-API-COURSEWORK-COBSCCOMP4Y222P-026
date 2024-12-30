const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticateUser = require('../middleware/authenticateUser');  
const authorizeRoles = require('../middleware/authorizeRoles');  

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes
 *     description: Admin can retrieve all routes.
 *     tags: [Admin - Routes]
 *     responses:
 *       200:
 *         description: Successfully retrieved all routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   routeNumber:
 *                     type: string
 *                   origin:
 *                     type: string
 *                   destination:
 *                     type: string
 *                   stops:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Error fetching routes
 */
router.get('/', authenticateUser, authorizeRoles(['Admin']), routeController.searchRoutes);

/**
 * @swagger
 * /api/routes/{routeNumber}:
 *   get:
 *     summary: Get a route by route number
 *     description: Admin can retrieve a specific route by its route number.
 *     tags: [Admin - Routes]
 *     parameters:
 *       - name: routeNumber
 *         in: path
 *         description: The route number to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved route by route number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeNumber:
 *                   type: string
 *                 origin:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 stops:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Route not found
 *       500:
 *         description: Error fetching route
 */
router.get('/:routeNumber', authenticateUser, authorizeRoles(['Admin']), routeController.getRouteByNumber);

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create new routes
 *     description: Admin can create one or more new routes.
 *     tags: [Admin - Routes]
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
 *                 origin:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 stops:
 *                   type: array
 *                   items:
 *                     type: string
 *     responses:
 *       201:
 *         description: Successfully created new route(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   routeNumber:
 *                     type: string
 *                   origin:
 *                     type: string
 *                   destination:
 *                     type: string
 *                   stops:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Error creating routes
 */
router.post('/', authenticateUser, authorizeRoles(['Admin']), routeController.createRoute);

/**
 * @swagger
 * /api/routes/{routeNumber}:
 *   put:
 *     summary: Update an existing route
 *     description: Admin can update the details of an existing route.
 *     tags: [Admin - Routes]
 *     parameters:
 *       - name: routeNumber
 *         in: path
 *         description: The route number to update
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
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               stops:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully updated the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeNumber:
 *                   type: string
 *                 origin:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 stops:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Route not found
 *       500:
 *         description: Error updating route
 */
router.put('/:routeNumber', authenticateUser, authorizeRoles(['Admin']), routeController.updateRoute);

/**
 * @swagger
 * /api/routes/{routeNumber}:
 *   delete:
 *     summary: Delete a route
 *     description: Admin can delete an existing route by its route number.
 *     tags: [Admin - Routes]
 *     parameters:
 *       - name: routeNumber
 *         in: path
 *         description: The route number to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the route
 *       404:
 *         description: Route not found
 *       500:
 *         description: Error deleting route
 */
router.delete('/:routeNumber', authenticateUser, authorizeRoles(['Admin']), routeController.deleteRoute);

module.exports = router;
