const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const Roles = require('../enums/roles');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - role
 *         - password
 *         - storeId
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         role:
 *           type: string
 *           description: User's role, defaults to "volunteer"
 *           enum: [volunteer, manager, admin]
 *           default: "volunteer"
 *         password:
 *           type: string
 *           description: User's password
 *         storeId:
 *           type: string
 *           description: Store ID to which the user is assigned
 *       example:
 *         email: "user@example.com"
 *         firstName: "John"
 *         lastName: "Doe"
 *         role: "volunteer"
 *         password: "password123"
 *         storeId: "store1"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Success:
 *                 value:
 *                   message: "User created"
 *                   data:
 *                     user:
 *                       email: "user@example.com"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       role: "volunteer"
 *                       storeId: "store1"
 *                   error: null
 *       400:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               InvalidRole:
 *                 value:
 *                   message: "Invalid role"
 *                   data: null
 *                   error: "Invalid role"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *                   data: null
 *                   error: "Unauthorized access"
 */
router.post('/', authenticateToken, authorizeRole([Roles['manager'], Roles['admin']]), userController.createUser);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Success:
 *                 value:
 *                   message: "User details retrieved"
 *                   data:
 *                     user:
 *                       email: "user@example.com"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       role: "volunteer"
 *                       storeId: "store1"
 *                   error: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *                   data: null
 *                   error: "Unauthorized access"
 */
router.get('/', authenticateToken, userController.getUserDetails);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Success:
 *                 value:
 *                   message: "Users retrieved"
 *                   data:
 *                     users:
 *                       - email: "user1@example.com"
 *                         firstName: "John"
 *                         lastName: "Doe"
 *                         role: "volunteer"
 *                         storeId: "store1"
 *                       - email: "user2@example.com"
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                         role: "manager"
 *                         storeId: "store2"
 *                   error: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *                   data: null
 *                   error: "Unauthorized access"
 */
router.get('/all', authenticateToken, authorizeRole([Roles['manager'], Roles['admin']]), userController.getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Success:
 *                 value:
 *                   message: "User updated successfully"
 *                   data: null
 *                   error: null
 *       400:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               InvalidRole:
 *                 value:
 *                   message: "Invalid role"
 *                   data: null
 *                   error: "Invalid role"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *                   data: null
 *                   error: "Unauthorized access"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   message: "User not found"
 *                   data: null
 *                   error: "User not found"
 */
router.put('/:userId', authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestingUserId:
 *                 type: string
 *                 description: The ID of the user making the deletion request
 *             example:
 *               requestingUserId: "requestingUserId123"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Success:
 *                 value:
 *                   message: "User deleted"
 *                   data: null
 *                   error: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: "Unauthorized"
 *                   data: null
 *                   error: "Unauthorized access"
 *       403:
 *         description: Permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               PermissionDenied:
 *                 value:
 *                   message: "Permission denied"
 *                   data: null
 *                   error: "You do not have permission to delete users"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   message: "User not found"
 *                   data: null
 *                   error: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ServerError:
 *                 value:
 *                   message: "Internal server error"
 *                   data: null
 *                   error: "Internal server error"
 */
router.delete('/:userId', authenticateToken, authorizeRole([Roles['manager'], Roles['admin']]), userController.deleteUser);

module.exports = router;

