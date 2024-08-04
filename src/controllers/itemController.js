const Item = require('../models/itemDAO');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.getItems({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createItem = async (req, res) => {
    const { name, description, location, price } = req.body;
    const userID = req.user._id; // Extract user ID from authenticated user
    const dateCreated = new Date().toISOString(); // Automatically set the creation date
    try {
        const newItem = await Item.addItem({ name, description, location, price, userID, dateCreated });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error creating item', errors: error });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, location, price } = req.body;
    try {
        const numReplaced = await Item.updateItem({ _id: id }, { $set: { name, description, location, price } });
        if (numReplaced === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const numRemoved = await Item.removeItem({ _id: id });
        if (numRemoved === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
