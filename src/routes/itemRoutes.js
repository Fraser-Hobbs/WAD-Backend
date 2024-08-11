const express = require('express');
const itemController = require('../controllers/itemController');
const {authenticateToken} = require("../middleware/authMiddleware");
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
 *         - storeId
 *         - price
 *         - userId
 *         - dateCreated
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: A brief description of the item
 *         storeId:
 *           type: string
 *           description: The ID of the store where the item is located
 *         price:
 *           type: number
 *           description: The price of the item
 *         userId:
 *           type: string
 *           description: The ID of the user who created the item
 *         dateCreated:
 *           type: string
 *           format: date-time
 *           description: The date the item was created
 *       example:
 *         name: "Antique Vase"
 *         description: "A beautiful antique vase from the 19th century."
 *         storeId: "dpIM3R5pQoXuMszt"
 *         price: 50
 *         userId: "Qu7iKv4UNunvMmlf"
 *         dateCreated: "2023-08-01T12:34:56Z"
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
 *         ItemsRetrieved:
 *           value:
 *             message: "Items retrieved successfully"
 *             data:
 *               - name: "Antique Vase"
 *                 description: "A beautiful antique vase from the 19th century."
 *                 storeId: "dpIM3R5pQoXuMszt"
 *                 price: 50
 *                 userId: "Qu7iKv4UNunvMmlf"
 *                 dateCreated: "2023-08-01T12:34:56Z"
 *             error: null
 *         ItemCreated:
 *           value:
 *             message: "Item created successfully"
 *             data:
 *               name: "Antique Vase"
 *               description: "A beautiful antique vase from the 19th century."
 *               storeId: "dpIM3R5pQoXuMszt"
 *               price: 50
 *               userId: "Qu7iKv4UNunvMmlf"
 *               dateCreated: "2023-08-01T12:34:56Z"
 *             error: null
 *         ItemUpdated:
 *           value:
 *             message: "Item updated successfully"
 *             data: null
 *             error: null
 *         ItemDeleted:
 *           value:
 *             message: "Item deleted successfully"
 *             data: null
 *             error: null
 *         ItemNotFound:
 *           value:
 *             message: "Item not found"
 *             data: null
 *             error: "Invalid item ID"
 *         StoreNotFound:
 *           value:
 *             message: "Store not found"
 *             data: null
 *             error: "Invalid store ID"
 *         ServerError:
 *           value:
 *             message: "Server error"
 *             data: null
 *             error: "An unexpected error occurred"
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Creates a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ItemCreated:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ItemCreated'
 *       400:
 *         description: Bad request, could be due to missing store ID or store not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               StoreNotFound:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/StoreNotFound'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ServerError'
 */
router.post('/', authenticateToken,  itemController.createItem);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieves items, optionally filtered by storeId and/or userId
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         description: The ID of the store to filter items by
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: The ID of the user to filter items by
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ItemsRetrieved:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ItemsRetrieved'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ServerError'
 */
router.get('/', itemController.getItems);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Updates an existing item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ItemUpdated:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ItemUpdated'
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ItemNotFound:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ItemNotFound'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ServerError'
 */
router.put('/:id', authenticateToken, itemController.updateItem);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Deletes an existing item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ItemDeleted:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ItemDeleted'
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ItemNotFound:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ItemNotFound'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseDTO'
 *             examples:
 *               ServerError:
 *                 $ref: '#/components/schemas/ApiResponseDTO/examples/ServerError'
 */
router.delete('/:id', authenticateToken, itemController.deleteItem);

module.exports = router;