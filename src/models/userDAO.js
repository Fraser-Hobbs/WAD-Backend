const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
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
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new Datastore();
        }
    }

    /**
     * Initializes the database with mock users if empty.
     */
    init() {
        this.db.find({}, (err, docs) => {
            if (docs.length === 0) {
                const mockUsers = [
                    // Admin user
                    {
                        email: 'admin@example.com',
                        firstName: 'Admin',
                        lastName: 'Example',
                        role: Roles['admin'],
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    // Store 1 users
                    {
                        email: 'manager1@example.com',
                        firstName: 'Manager',
                        lastName: 'Store1',
                        role: Roles['manager'],
                        storeId: 'kYZnkBrmiZwhOQ61',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    {
                        email: 'volunteer1@example.com',
                        firstName: 'Volunteer',
                        lastName: 'Store1',
                        role: Roles['volunteer'],
                        storeId: 'kYZnkBrmiZwhOQ61',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    // Store 2 users
                    {
                        email: 'manager2@example.com',
                        firstName: 'Manager',
                        lastName: 'Store2',
                        role: Roles['manager'],
                        storeId: 'dpIM3R5pQoXuMszt',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    {
                        email: 'volunteer2@example.com',
                        firstName: 'Volunteer',
                        lastName: 'Store2',
                        role: Roles['volunteer'],
                        storeId: 'dpIM3R5pQoXuMszt',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    // Store 3 users
                    {
                        email: 'manager3@example.com',
                        firstName: 'Manager',
                        lastName: 'Store3',
                        role: Roles['manager'],
                        storeId: 'hnDVPnZk4l3WfmRp',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    {
                        email: 'volunteer3@example.com',
                        firstName: 'Volunteer',
                        lastName: 'Store3',
                        role: Roles['volunteer'],
                        storeId: 'hnDVPnZk4l3WfmRp',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    // Store 4 users
                    {
                        email: 'manager4@example.com',
                        firstName: 'Manager',
                        lastName: 'Store4',
                        role: Roles['manager'],
                        storeId: 'w1r3B9p5F4IJHq0x',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    {
                        email: 'volunteer4@example.com',
                        firstName: 'Volunteer',
                        lastName: 'Store4',
                        role: Roles['volunteer'],
                        storeId: 'w1r3B9p5F4IJHq0x',
                        passwordHash: bcrypt.hashSync('password123', 10)
                    }
                ];

                this.db.insert(mockUsers, (err) => {
                    if (err) {
                        console.error('Error while inserting mock users: ', err);
                    } else {
                        console.info('Mock users inserted: ');
                    }
                });
            }
        });
    }

    /**
     * Finds a user by email.
     * @param {string} email - The email of the user.
     * @returns {Promise<Object>} The user document.
     */
    findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ email }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    /**
     * Finds a user by ID.
     * @param {string} id - The ID of the user.
     * @returns {Promise<Object>} The user document.
     */
    findById(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    /**
     * Adds a new user to the database.
     * @param {Object} user - The user object to add.
     * @returns {Promise<Object>} The newly added user document.
     */
    addUser(user) {
        return new Promise((resolve, reject) => {
            this.db.insert(user, (err, newDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    /**
     * Updates a user in the database.
     * @param {string} id - The ID of the user to update.
     * @param {Object} update - The update object.
     * @returns {Promise<number>} The number of documents updated.
     */
    updateUser(id, update) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: id }, { $set: update }, {}, (err, numReplaced) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    /**
     * Deletes a user from the database.
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise<number>} The number of documents removed.
     */
    deleteUser(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
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
    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, { passwordHash: 0 }, (err, docs) => {
                if (err) {
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
    getUsersByStoreId(storeId) {
        return new Promise((resolve, reject) => {
            this.db.find({ storeId }, (err, docs) => {
                if (err) {
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
    deleteMany(query) {
        return new Promise((resolve, reject) => {
            this.db.remove(query, { multi: true }, (err, numRemoved) => {
                if (err) {
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