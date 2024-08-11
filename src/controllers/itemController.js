const Item = require('../models/itemDAO');
const Roles = require("../enums/roles");
const Store = require('../models/storeDAO');
const ApiResponseDTO = require('../dto/apiResponseDTO');

exports.getItems = async (req, res) => {
    const { storeId, userId } = req.query;
    const query = {};

    // Add storeId to the query if provided
    if (storeId) {
        query.storeId = storeId;
    }

    // Add userId to the query if provided
    if (userId) {
        query.userId = userId;
    }

    try {
        const items = await Item.getItems(query);
        const itemCount = items.length;
        res.json(new ApiResponseDTO('Items retrieved successfully', { itemCount, items }, null));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};

exports.createItem = async (req, res) => {
    let { name, description, storeId, price } = req.body;
    console.log(req.body);
    console.log(`Store ID: ${storeId}`);
    console.log(req.user)
    const dateCreated = new Date().toISOString(); // Automatically set the creation date
    const userId = req.user._id; // Get the user's ID

    try {
        if (req.user.role === Roles['admin'] && !storeId) {
            return res.status(400).json(new ApiResponseDTO('Store ID is required from admin users', null, 'Store ID missing'));
        } else if (req.user.storeId && !storeId) {
            storeId = req.user.storeId; // Assign the same store as the user
        }

        // Check if the store exists
        const store = await Store.getStoreById(storeId);
        console.log(`Store: ${store} - Store ID: ${storeId}`);
        if (!store) {
            return res.status(400).json(new ApiResponseDTO('Store not found', null, 'Invalid store ID'));
        }

        const newItem = await Item.addItem({ name, description, price, storeId, dateCreated, userId });
        res.status(201).json(new ApiResponseDTO('Item created successfully', newItem, null));
    } catch (error) {
        console.error(error);
        res.status(400).json(new ApiResponseDTO('Error creating item', null, error.message));
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, storeId } = req.body;

    try {
        // Prepare the fields to be updated
        const updateFields = { name, description, price };

        // If the user is an admin and a storeId is provided, add it to the updateFields
        if (req.user.role === 'admin' && storeId) {
            updateFields.storeId = storeId;
        }

        const numReplaced = await Item.updateItem({ _id: id }, { $set: updateFields });
        if (numReplaced === 0) {
            return res.status(404).json(new ApiResponseDTO('Item not found', null, 'Invalid item ID'));
        }
        res.json(new ApiResponseDTO('Item updated successfully', null, null));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};


exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const numRemoved = await Item.removeItem({ _id: id });
        if (numRemoved === 0) {
            return res.status(404).json(new ApiResponseDTO('Item not found', null, 'Invalid item ID'));
        }
        res.json(new ApiResponseDTO('Item deleted successfully', null, null));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};