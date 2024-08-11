const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
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
 *         email: "admin@example.com"
 *         password: "password123"
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - role
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
 *           description: User's role
 *           enum: [volunteer, manager, admin]
 *       example:
 *         email: "user@example.com"
 *         firstName: "John"
 *         lastName: "Doe"
 *         role: "volunteer"
 *     ApiResponseDTO:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         error:
 *           type: string
 *           description: Any error messages
 *         data:
 *           type: object
 *           description: Response data
 *       examples:
 *         LoginSuccess:
 *           value:
 *             message: "Login Successful"
 *             data:
 *               email: "admin@example.com"
 *               firstName: "Admin"
 *               lastName: "Example"
 *               role: "admin"
 *               _id: "Qu7iKv4UNunvMmlf"
 *             error: null
 *         LoginFailed:
 *           value:
 *             message: "Login Failed"
 *             data: null
 *             error: "Invalid email or password"
 *         AuthSuccess:
 *           value:
 *             message: "Authenticated"
 *             data:
 *               isAuthenticated: true
 *               data:
 *                 email: "admin@example.com"
 *                 firstName: "Admin"
 *                 lastName: "Example"
 *                 role: "admin"
 *                 _id: "Qu7iKv4UNunvMmlf"
 *             error: null
 *         AuthTokenExpired:
 *           value:
 *             message: "Unauthorized"
 *             data:
 *               isAuthenticated: false
 *             error: "Access Token Expired"
 *         NoTokenProvided:
 *           value:
 *             message: "Unauthorized"
 *             data:
 *               isAuthenticated: false
 *             error: "Unauthorized, no tokens provided"
 *         LogoutSuccess:
 *           value:
 *             message: "Logged out successfully"
 *             data: null
 *             error: null
 *         TokenRefreshed:
 *           value:
 *             message: "Token refreshed"
 *             data: null
 *             error: null
 *         RefreshFailed:
 *           value:
 *             message: "Unauthorized"
 *             data: null
 *             error: "Invalid or missing refresh token"
 *
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user and sets the refresh token in cookies
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful, access token is returned in response body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               LoginSuccess:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/LoginSuccess'
 *       401:
 *         description: Unauthorized, invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               LoginFailed:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/LoginFailed'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               LogoutSuccess:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/LogoutSuccess'
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
 *         description: Access token refreshed and returned in response body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               TokenRefreshed:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/TokenRefreshed'
 *       401:
 *         description: Unauthorized, invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               RefreshFailed:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/RefreshFailed'
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /auth/check-auth:
 *   get:
 *     summary: Checks if the user is authenticated
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               AuthSuccess:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/AuthSuccess'
 *       401:
 *         description: Unauthorized, either token expired or not provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               AuthTokenExpired:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/AuthTokenExpired'
 *               NoTokenProvided:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/NoTokenProvided'
 */
router.get('/check-auth', authController.checkAuth);

module.exports = router;