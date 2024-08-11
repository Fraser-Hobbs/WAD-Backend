const Store = require('../models/storeDAO');
const Item = require('../models/itemDAO');
const User = require('../models/userDAO');
const ApiResponseDTO = require('../dto/apiResponseDTO');

exports.getAllStores = async (req, res) => {
    try {
        let stores = await Store.getAllStores();

        // Sort the stores alphabetically by name
        stores.sort((a, b) => a.name.localeCompare(b.name));

        res.json(new ApiResponseDTO('Stores retrieved successfully', { stores }));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};

exports.getStoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await Store.getStoreById(id);
        if (!store) {
            return res.status(404).json(new ApiResponseDTO('Store not found'));
        }
        res.json(new ApiResponseDTO('Store retrieved successfully', { store }));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};

exports.createStore = async (req, res) => {
    const { name, address } = req.body;
    const newStore = { name, address };
    try {
        const createdStore = await Store.addStore(newStore);
        res.status(201).json(new ApiResponseDTO('Store created successfully', { store: createdStore }));
    } catch (error) {
        res.status(400).json(new ApiResponseDTO('Error creating store', null, error.message));
    }
};

exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;
    const update = { name, address };
    try {
        const numReplaced = await Store.updateStore(id, update);
        if (numReplaced === 0) {
            return res.status(404).json(new ApiResponseDTO('Store not found'));
        }
        res.json(new ApiResponseDTO('Store updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};

exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        // First, delete all items linked to the store
        await Item.deleteMany({ storeId: id });

        // Then, delete all users linked to the store
        await User.deleteMany({ storeId: id });

        // Finally, delete the store itself
        const numRemoved = await Store.deleteStore(id);
        if (numRemoved === 0) {
            return res.status(404).json(new ApiResponseDTO('Store not found'));
        }

        res.json(new ApiResponseDTO('Store deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};
