const userDAO = require("../models/userDAO");
const bcrypt = require("bcryptjs");
const {BCRYPT_SALT_ROUNDS} = require("../../config");

// Create User
exports.createUser = async (req, res) => {
    const {email, firstName, lastName, password, role} = req.body;

    if (role === 'manager' && req.user.role !== 'admin') {
        return res.status(403).json({message: 'Permission denied'});
    }

    try {
        await userDAO.create(email, firstName, lastName, password, role);
        res.status(201).json({message: 'User created'});
    } catch (error) {
        res.status(400).json({message: 'Error creating user', errors: error});
    }
};

// Read / Get User
exports.getUserDetails = (req, res) => {
    const userId = req.user._id;

    userDAO.findById(userId)
        .then(user => {
            if ( !user ) {
                return res.status(404).json({message: 'User not found'});
            }
            const {passwordHash, ...userDetails} = user;
            res.json(userDetails);
        })
        .catch(err => {
            console.error('Error fetching user details: ', err);
            res.status(500).json({message: 'Internal server error'});
        });
};

exports.deleteUser = async (req, res) => {
    const {email} = req.params;
    try {
        const numRemoved = await userDAO.remove({email: email});
        if ( numRemoved === 0 ) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User deleted'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.user._id;
    req.user = await userDAO.findById(userId);
    const {email, firstName, lastName, password, role} = req.body;

    const targetEmail = email || req.user.email;

    if ( req.user.role !== 'manager' && req.user.email !== targetEmail ) {
        return res.status(403).json({message: 'Permission denied'});
    }

    try {
        const user = await userDAO.findByEmail(targetEmail);
        if ( !user ) {
            return res.status(404).json({message: 'User not found'});
        }

        const updatedUser = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            passwordHash: user.passwordHash,
            role: (req.user.role === 'manager' && role) ? role : user.role
        };

        if ( password ) {
            updatedUser.passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        }

        const result = await userDAO.update({_id: user._id}, {$set: updatedUser});
        if ( result === 0 ) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User updated successfully'});
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await userDAO.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};