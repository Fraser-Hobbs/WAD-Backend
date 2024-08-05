const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const Roles = require('../enums/roles');

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new Datastore();
        }
    }

    init() {
        this.db.find({}, (err, docs) => {
            if (docs.length === 0) {
                const mockUsers = [
                    {
                        email: 'manager@example.com',
                        firstName: 'Manager',
                        lastName: 'Example',
                        role: Roles["manager"],
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    {
                        email: 'volunteer@example.com',
                        firstName: 'Volunteer',
                        lastName: 'Example',
                        role: Roles["volunteer"],
                        passwordHash: bcrypt.hashSync('password123', 10)
                    },
                    {
                        email: 'admin@example.com',
                        firstName: 'Admin',
                        lastName: 'Example',
                        role: Roles["admin"],
                        passwordHash: bcrypt.hashSync('password123', 10)
                    }
                ];

                this.db.insert(mockUsers, (err, newDocs) => {
                    if (err) {
                        console.error('Error while inserting mock users: ', err);
                    } else {
                        console.info('Mock users inserted: ', newDocs);
                    }
                });
            }
        });
    }

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

    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, { passwordHash: 0 }, (err, docs) => { // Exclude passwordHash from results
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }
}

const userDAO = new UserDAO(`${config.DATASTORE_DIR}/users.db`);
userDAO.init();
module.exports = userDAO;