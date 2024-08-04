const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRole(['admin','manager']), userController.createUser);

router.get('/', authenticateToken, userController.getUserDetails);

router.put('/', authenticateToken, userController.updateUser);

router.delete('/', authenticateToken, authorizeRole(['admin','manager']), userController.deleteUser);

router.get('/all', authenticateToken, authorizeRole(['admin','manager']), userController.getAllUsers);

module.exports = router;
