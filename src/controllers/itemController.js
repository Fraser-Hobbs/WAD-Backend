const Item = require('../models/itemDAO');
const Roles = require("../enums/roles");
const Store = require('../models/storeDAO');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.getItems({});
        res.json(items);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

exports.createItem = async (req, res) => {
    let { name, description, storeId, price } = req.body;
    const dateCreated = new Date().toISOString(); // Automatically set the creation date

    try {
        if (req.user.role === Roles['admin']) {
            if (!storeId) {
                return res.status(400).json({ message: 'Store ID is required for admin users' });
            }
        } else {
            storeId = req.user.storeId; // Assign the same store as the user
        }

        // Check if the store exists
        const store = await Store.getStoreById(storeId);
        if (!store) {
            return res.status(400).json({ message: 'Store not found' });
        }

        const newItem = await Item.addItem({ name, description, price, storeId, dateCreated });
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating item', errors: error });
    }
};

exports.updateItem = async (req, res) => {
    const {id} = req.params;
    const {name, description, price} = req.body;
    try {
        const numReplaced = await Item.updateItem({_id: id}, {$set: {name, description, price}});
        if ( numReplaced === 0 ) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json({message: 'Item updated'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

exports.deleteItem = async (req, res) => {
    const {id} = req.params;
    try {
        const numRemoved = await Item.removeItem({_id: id});
        if ( numRemoved === 0 ) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json({message: 'Item deleted'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};
