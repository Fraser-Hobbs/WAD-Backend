const express = require('express');
const storeController = require('../controllers/storeController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const Roles = require('../enums/roles');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         _id:
 *           type: string
 *           description: Store ID
 *         name:
 *           type: string
 *           description: Name of the store
 *         address:
 *           type: string
 *           description: Address of the store
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         name: "Shop 1"
 *         address: "123 Main St"
 * tags:
 *   name: Stores
 *   description: Store management endpoints
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of stores retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', authenticateToken, storeController.getAllStores);

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get a store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 */
router.get('/:id', authenticateToken, storeController.getStoreById);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               name: "Shop 1"
 *               address: "123 Main St"
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, authorizeRole([Roles['admin']]), storeController.createStore);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update a store
 *     tags: [Stores]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
router.put('/:id', authenticateToken, authorizeRole([Roles['admin']]), storeController.updateStore);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete a store
 *     tags: [Stores]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
router.delete('/:id', authenticateToken, authorizeRole([Roles['admin']]), storeController.deleteStore);

module.exports = router;
