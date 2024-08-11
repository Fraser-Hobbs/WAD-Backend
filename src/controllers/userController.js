const bcrypt = require('bcryptjs');
const User = require('../models/userDAO');
const Roles = require('../enums/roles');
const ApiResponseDTO = require('../dto/apiResponseDTO');

// Create a new user
exports.createUser = async (req, res) => {
    const { email, firstName, lastName, role, password, storeId } = req.body;

    // Validate the role
    if (!Roles.exists(role)) {
        return res.status(400).json(new ApiResponseDTO('Invalid role', null, 'Invalid role'));
    }

    // Hash the password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Determine the storeId based on the submitting user's role
    const newUser = {
        email,
        firstName,
        lastName,
        role,
        storeId: req.user.role === 'admin' ? storeId : req.user.storeId,  // Use the body storeId if admin, otherwise the submitting user's storeId
        passwordHash
    };

    try {
        // Add the user to the database
        const createdUser = await User.addUser(newUser);
        const { passwordHash, ...userWithoutPassword } = createdUser;

        // Respond with the created user's details
        res.status(201).json(new ApiResponseDTO('User created', { users: [userWithoutPassword] }, null));
    } catch (error) {
        // Handle errors
        res.status(400).json(new ApiResponseDTO('Error creating user', null, error.message));
    }
};


// Get user details
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'User not found'));
        }
        const { passwordHash, ...userWithoutPassword } = user;
        res.json(new ApiResponseDTO('User details retrieved', { user: userWithoutPassword }, null));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};

// Update a user using route parameter
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, role, storeId } = req.body;

    // Check if role or storeId is provided and if the requesting user is an admin
    if ((role || storeId) && req.user.role !== 'admin') {
        return res.status(403).json(new ApiResponseDTO('Permission denied', null, 'You do not have permission to update the role or storeId'));
    }

    // Validate the role if it's provided
    if (role && !Roles.exists(role)) {
        return res.status(400).json(new ApiResponseDTO('Invalid role', null, 'Invalid role'));
    }

    // Create the update object
    const update = { firstName, lastName };
    if (req.user.role === 'admin') {
        if (role) {
            update.role = role;
        }
        if (storeId) {
            update.storeId = storeId;
        }
    }

    try {
        // Update the user
        const numReplaced = await User.updateUser(userId, update);
        if (numReplaced === 0) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'User not found'));
        }
        res.json(new ApiResponseDTO('User updated', null, null));
    } catch (error) {
        // Handle errors
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};



// Delete a user using route parameter
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    const requestingUserId = req.user._id;

    try {
        const requestingUser = await User.findById(requestingUserId);

        if (!requestingUser) {
            return res.status(404).json(new ApiResponseDTO('Requesting user not found', null, 'Invalid requesting user ID'));
        }

        if (requestingUser.role !== 'admin' && requestingUser.role !== 'manager') {
            return res.status(403).json(new ApiResponseDTO('Permission denied', null, 'You do not have permission to delete users'));
        }

        if (requestingUser.role === 'manager') {
            const userToDelete = await User.findById(userId);
            if (!userToDelete) {
                return res.status(404).json(new ApiResponseDTO('User to delete not found', null, 'Invalid user ID'));
            }
            if (userToDelete.storeId.toString() !== requestingUser.storeId.toString()) {
                return res.status(403).json(new ApiResponseDTO('Permission denied', null, 'Managers can only delete users from their own store'));
            }
        }

        const numRemoved = await User.deleteUser(userId);
        if (numRemoved === 0) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'User not found'));
        }

        res.json(new ApiResponseDTO('User deleted', null, null));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const requestingUser = await User.findById(req.user._id);
        if (!requestingUser) {
            return res.status(404).json(new ApiResponseDTO('User not found', null, 'User not found'));
        }

        let users;
        if (requestingUser.role === 'manager') {
            users = await User.getUsersByStoreId(requestingUser.storeId);
        } else {
            users = await User.getAllUsers();
        }

        const usersWithoutPasswords = users.map(user => {
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json(new ApiResponseDTO('Users retrieved', { users: usersWithoutPasswords }, null));
    } catch (error) {
        res.status(500).json(new ApiResponseDTO('Internal server error', null, error.message));
    }
};
