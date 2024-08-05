const Store = require('../models/storeDAO');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.getAllStores();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await Store.getStoreById(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createStore = async (req, res) => {
    const { name, address } = req.body;
    const newStore = { name, address };
    try {
        const createdStore = await Store.addStore(newStore);
        res.status(201).json(createdStore);
    } catch (error) {
        res.status(400).json({ message: 'Error creating store', errors: error });
    }
};

exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;
    const update = { name, address };
    try {
        const numReplaced = await Store.updateStore(id, update);
        if (numReplaced === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ message: 'Store updated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const numRemoved = await Store.deleteStore(id);
        if (numRemoved === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ message: 'Store deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
