const express = require('express');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

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
 *             error: "Invalid credentials"
 *             data: null
 *         LogoutSuccess:
 *           value:
 *             message: "Successfully logged out"
 *             error: null
 *             data: null
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *       401:
 *         description: Unauthorized, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 */
router.post('/login', loginLimiter, [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await authController.login(req, res);
    } catch (err) {
        next(err); // Pass the error to the global error handler
    }
});

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using the refresh token stored in cookies
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed and returned in response body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *       401:
 *         description: Unauthorized, invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 */
router.post('/refresh-token', async (req, res, next) => {
    try {
        await authController.refreshToken(req, res);
    } catch (err) {
        next(err);
    }
});

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
 *       401:
 *         description: Unauthorized, either token expired or not provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 */
router.get('/check-auth', async (req, res, next) => {
    try {
        await authController.checkAuth(req, res);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               LogoutSuccess:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/LogoutSuccess'
 */
router.post('/logout', async (req, res, next) => {
    try {
        await authController.logout(req, res);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
