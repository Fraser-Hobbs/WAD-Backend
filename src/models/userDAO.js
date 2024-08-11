const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const Roles = require('../enums/roles');

/**
 * Data Access Object for User operations.
 */
class UserDAO {
    /**
     * Creates an instance of UserDAO.
     * @param {string} [dbFilePath] - Path to the database file.
     */
    constructor(dbFilePath) {
        this.db = dbFilePath
            ? new Datastore({ filename: dbFilePath, autoload: true })
            : new Datastore();

        if (dbFilePath) {
            console.log('DB connected to ' + dbFilePath);
        }
    }

    /**
     * Initializes the database with mock users if empty.
     */
    async init() {
        try {
            const docs = await this.getAllUsers();
            if (docs.length === 0) {
                const mockUsers = [
                    {
                        email: 'admin@example.com',
                        firstName: 'Admin',
                        lastName: 'Example',
                        role: Roles['admin'],
                        passwordHash: bcrypt.hashSync('password123', config.BCRYPT_SALT_ROUNDS)
                    },
                    {
                        email: 'manager1@example.com',
                        firstName: 'Manager',
                        lastName: 'Store1',
                        role: Roles['manager'],
                        storeId: 'kYZnkBrmiZwhOQ61',
                        passwordHash: bcrypt.hashSync('password123', config.BCRYPT_SALT_ROUNDS)
                    },
                    {
                        email: 'volunteer1@example.com',
                        firstName: 'Volunteer',
                        lastName: 'Store1',
                        role: Roles['volunteer'],
                        storeId: 'kYZnkBrmiZwhOQ61',
                        passwordHash: bcrypt.hashSync('password123', config.BCRYPT_SALT_ROUNDS)
                    },
                    {
                        email: 'manager2@example.com',
                        firstName: 'Manager',
                        lastName: 'Store2',
                        role: Roles['manager'],
                        storeId: 'a1B2c3D4e5F6',
                        passwordHash: bcrypt.hashSync('password123', config.BCRYPT_SALT_ROUNDS)
                    }
                ];
                await this.createUser(mockUsers);
            }
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    }

    /**
     * Finds a user by email.
     * @param {string} email - The email of the user.
     * @returns {Promise<Object|null>} The user document or null if not found.
     */
    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ email }, (err, doc) => {
                if (err) {
                    console.error('Error finding user by email:', err);
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    /**
     * Creates a new user in the database.
     * @param {Object} user - The user object to create.
     * @returns {Promise<Object>} The created user document.
     */
    async createUser(user) {
        return new Promise((resolve, reject) => {
            this.db.insert(user, (err, newDoc) => {
                if (err) {
                    console.error('Error creating user:', err);
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    /**
     * Updates a user's information in the database.
     * @param {string} id - The ID of the user to update.
     * @param {Object} user - The new user data.
     * @returns {Promise<number>} The number of documents updated.
     */
    async updateUser(id, user) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: id }, { $set: user }, {}, (err, numUpdated) => {
                if (err) {
                    console.error('Error updating user:', err);
                    reject(err);
                } else {
                    resolve(numUpdated);
                }
            });
        });
    }

    /**
     * Deletes a user from the database.
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise<number>} The number of documents removed.
     */
    async deleteUser(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    console.error('Error deleting user:', err);
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }

    /**
     * Gets all users from the database.
     * @returns {Promise<Object[]>} The array of user documents.
     */
    async getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, { passwordHash: 0 }, (err, docs) => {
                if (err) {
                    console.error('Error retrieving all users:', err);
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    /**
     * Gets all users by store ID.
     * @param {string} storeId - The ID of the store.
     * @returns {Promise<Object[]>} The array of user documents.
     */
    async getUsersByStoreId(storeId) {
        return new Promise((resolve, reject) => {
            this.db.find({ storeId }, (err, docs) => {
                if (err) {
                    console.error('Error retrieving users by store ID:', err);
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    /**
     * Removes multiple users from the database.
     * @param {Object} query - The query object to find the users to delete.
     * @returns {Promise<number>} - The number of documents removed.
     */
    async deleteMany(query) {
        return new Promise((resolve, reject) => {
            this.db.remove(query, { multi: true }, (err, numRemoved) => {
                if (err) {
                    console.error('Error deleting many users:', err);
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}

// Initialize UserDAO with the specified database file path
const userDAO = new UserDAO(`${config.DATASTORE_DIR}/users.db`);
userDAO.init();

module.exports = userDAO;
