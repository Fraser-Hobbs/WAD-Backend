const Datastore = require('nedb');
const config = require('../../config.js');

class ItemDAO {
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
                const mockItems = [
                    {
                        name: 'Antique Vase',
                        description: 'A beautiful antique vase from the 19th century.',
                        location: 'Shop 1',
                        price: 50,
                        userID: 'user1',
                        dateCreated: new Date().toISOString()
                    },
                    {
                        name: 'Vintage Clock',
                        description: 'A vintage clock in perfect working condition.',
                        location: 'Shop 2',
                        price: 75,
                        userID: 'user2',
                        dateCreated: new Date().toISOString()
                    },
                    {
                        name: 'Leather Jacket',
                        description: 'A stylish leather jacket, barely used.',
                        location: 'Shop 3',
                        price: 100,
                        userID: 'user3',
                        dateCreated: new Date().toISOString()
                    }
                ];
                this.db.insert(mockItems, (err, newDocs) => {
                    if (err) {
                        console.error('Error while inserting mock items: ', err);
                    } else {
                        console.info('Mock items inserted: ', newDocs);
                    }
                });
            }
        });
    }

    getItems(query) {
        return new Promise((resolve, reject) => {
            this.db.find(query, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    getSingleItem(query) {
        return new Promise((resolve, reject) => {
            this.db.findOne(query, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    addItem(item) {
        return new Promise((resolve, reject) => {
            this.db.insert(item, (err, newDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    updateItem(query, update, options = {}) {
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

    removeItem(query, options = {}) {
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

const itemDAO = new ItemDAO(`${config.DATASTORE_DIR}/items.db`);
itemDAO.init();
module.exports = itemDAO;
