const express = require('express');
const authController = require('../controllers/authController');
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
 *           default: "volunteer"
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         email: "user@example.com"
 *         firstName: "John"
 *         lastName: "Doe"
 *         role: "volunteer"
 *         password: "password123"
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         email: "user@example.com"
 *         password: "password123"
 *     LoginResponseDTO:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login Successful"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: User's ID
 *             email:
 *               type: string
 *               description: User's email address
 *             firstName:
 *               type: string
 *               description: User's first name
 *             lastName:
 *               type: string
 *               description: User's last name
 *             role:
 *               type: string
 *               description: User's role, defaults to "volunteer"
 *               default: "volunteer"
 *       example:
 *         message: "Login Successful"
 *         user:
 *           _id: "60d0fe4f5311236168a109ca"
 *           email: "user@example.com"
 *           firstName: "John"
 *           lastName: "Doe"
 *           role: "volunteer"
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user and sets access and refresh tokens in cookies
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful, cookies are set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponseDTO'
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out the current user and clears the authentication cookies
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful, cookies cleared
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refreshes the access token using the refresh token stored in cookies
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed and set in cookies
 *       401:
 *         description: Unauthorized, no refresh token provided
 */
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
