const bcrypt = require('bcryptjs');
const User = require('../models/userDAO');
const Roles = require('../enums/roles');

exports.createUser = async (req, res) => {
    const { email, firstName, lastName, role, password } = req.body;
    if (!Roles.exists(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = { email, firstName, lastName, role, passwordHash };
    try {
        const createdUser = await User.addUser(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', errors: error });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { passwordHash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { firstName, lastName, role } = req.body;
    if (role && !Roles.exists(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    const update = { firstName, lastName, role };
    try {
        const numReplaced = await User.updateUser(req.user._id, update);
        if (numReplaced === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const numRemoved = await User.deleteUser(req.user._id);
        if (numRemoved === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        const usersWithoutPasswords = users.map(user => {
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};