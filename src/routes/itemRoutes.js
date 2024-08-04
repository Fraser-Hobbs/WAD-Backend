const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, itemController.createItem);

router.get('/', itemController.getItems);

router.put('/:id', authenticateToken, itemController.updateItem);

router.delete('/:id', authenticateToken, itemController.deleteItem);

module.exports = router;
