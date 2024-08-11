const User = require('../models/userDAO');
const ApiResponseDTO = require('../dto/apiResponseDTO');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Roles = require("../enums/roles");

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponseDTO('Validation error', null, errors.array()));
    }

    const { email, firstName, lastName, role, password, storeId } = req.body;

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json(new ApiResponseDTO('User already exists', null, 'Email is already in use'));
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = {
            email,
            firstName,
            lastName,
            role: role || Roles['volunteer'],
            passwordHash,
            storeId,
        };

        const createdUser = await User.createUser(newUser);
        res.status(201).json(new ApiResponseDTO('User created successfully', { userId: createdUser._id }, null));
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};

exports.getAllUsers = async (req, res) => {
    const { storeId } = req.query;
    const query = {};

    // Add storeId to the query if provided
    if (storeId) {
        query.storeId = storeId;
    }

    try {
        const users = await User.getUsersByQuery(query);
        res.json(new ApiResponseDTO('Users retrieved successfully', { users }, null));
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'Invalid user ID'));
        }
        res.json(new ApiResponseDTO('User retrieved successfully', { user }, null));
    } catch (error) {
        console.error('Error retrieving user by ID:', error);
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};

exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponseDTO('Validation error', null, errors.array()));
    }

    const { userId } = req.params;
    const { email, firstName, lastName, role, password, storeId } = req.body;

    try {
        const updateFields = {};

        if (email) updateFields.email = email;
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (role) updateFields.role = role;
        if (storeId) updateFields.storeId = storeId;
        if (password) updateFields.passwordHash = bcrypt.hashSync(password, 10);

        const numReplaced = await User.updateUser(userId, updateFields);
        if (numReplaced === 0) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'Invalid user ID'));
        }
        res.json(new ApiResponseDTO('User updated successfully', null, null));
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const numRemoved = await User.deleteUser(userId);
        if (numRemoved === 0) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'Invalid user ID'));
        }
        res.json(new ApiResponseDTO('User deleted successfully', null, null));
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};
