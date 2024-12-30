const express = require('express');
const { signup, login } = require('../controllers/authenticationController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account with email, password, and roles. 
 *     tags: [Authentication and Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of roles assigned to the user (e.g., 'Admin', 'Operator', 'Commuter')
 *             required:
 *               - email
 *               - password
 *               - roles
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/signup', signup);  // Public route

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user based on email and password, returning a JWT token if successful.
 *     tags: [Authentication and Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Operator account awaiting admin approval
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);    // Public route

module.exports = router;
