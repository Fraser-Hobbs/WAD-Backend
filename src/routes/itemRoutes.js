const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - location
 *         - price
 *         - userID
 *         - dateCreated
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: A detailed description of the item
 *         location:
 *           type: string
 *           description: The location where the item is stored or available
 *         price:
 *           type: number
 *           description: The price of the item
 *         userID:
 *           type: string
 *           description: The ID of the user who created the item
 *         dateCreated:
 *           type: string
 *           format: date-time
 *           description: The date and time when the item was created
 *       example:
 *         name: "Antique Vase"
 *         description: "A beautiful antique vase from the 19th century."
 *         location: "Shop 1"
 *         price: 50.0
 *         userID: "user123"
 *         dateCreated: "2024-08-04T12:34:56Z"
 *     CreateItemDTO:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - location
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: A detailed description of the item
 *         location:
 *           type: string
 *           description: The location where the item is stored or available
 *         price:
 *           type: number
 *           description: The price of the item
 *       example:
 *         name: "Antique Vase"
 *         description: "A beautiful antique vase from the 19th century."
 *         location: "Shop 1"
 *         price: 50.0
 * tags:
 *   name: Items
 *   description: Item management endpoints
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemDTO'
 *     responses:
 *       201:
 *         description: Item created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, itemController.createItem);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get('/', itemController.getItems);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticateToken, itemController.updateItem);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticateToken, itemController.deleteItem);

module.exports = router;
