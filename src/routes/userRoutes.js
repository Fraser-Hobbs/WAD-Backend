const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, userController.getUserDetails);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/', authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/', authenticateToken, authorizeRole(['admin', 'manager']), userController.deleteUser);

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/all', authenticateToken, authorizeRole(['admin','manager']), userController.getAllUsers);

module.exports = router;
