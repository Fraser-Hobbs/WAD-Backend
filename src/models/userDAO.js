const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const config = require('../../config');

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            this.db = new Datastore({ inMemoryOnly: true });
            console.log("Using In-Memory Database");
        }
    }

    init() {
        this.db.find({}, (err, docs) => {
            if (docs.length === 0) {
                // admin data
                this.db.insert({
                    email: "admin@example.com",
                    firstName: "admin",
                    lastName: "",
                    role: "admin",
                    passwordHash: bcrypt.hashSync('admin', config.BCRYPT_SALT_ROUNDS)
                });
            }
        });
    }

    create(email, firstName, lastName, password, role = 'user') {
        const user = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            passwordHash: null,
            role: role
        };
        return new Promise((resolve, reject) => {
            this.findByEmail(email)
                .then((doc) => {
                    if (doc) {
                        console.error('Email already exists: ', email);
                        reject(['Email already exists']);
                    } else {
                        bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS)
                            .then((hash) => {
                                user.passwordHash = hash;
                                this.db.insert(user, (err, doc) => {
                                    if (err) {
                                        console.error('Error while inserting user: ', err);
                                        reject(['Error while inserting user']);
                                    } else {
                                        console.info('User inserted: ', doc);
                                        resolve();
                                    }
                                });
                            })
                            .catch((err) => {
                                console.error('Error while hashing password: ', err);
                                reject(['Error while hashing password']);
                            });
                    }
                })
                .catch((err) => {
                    console.error('Error while looking up user: ', err);
                    reject(['Error while looking up user']);
                });
        });
    }

    findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ email: email }, (err, doc) => {
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

    findAll() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    update(query, update, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.update(query, update, options, (err, numReplaced) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    remove(query, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.remove(query, options, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}


const userDAO = new UserDAO(`${config.DATASTORE_DIR}/users.db`);
userDAO.init();
module.exports = userDAO;
