const Datastore = require('nedb');
const config = require('../../config');

/**
 * Data Access Object for Store operations.
 */
class StoreDAO {
    /**
     * Creates an instance of StoreDAO.
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
     * Initializes the database with mock stores if empty.
     */
    init() {
        this.db.find({}, (err, docs) => {
            if (docs.length === 0) {
                const mockStores = [
                    { _id: 'dpIM3R5pQoXuMszt', name: 'Shop 2', address: '456 Oak St' },
                    { _id: 'hnDVPnZk4l3WfmRp', name: 'Shop 3', address: '789 Pine St' },
                    { _id: 'kYZnkBrmiZwhOQ61', name: 'Shop 1', address: '123 Main St' },
                    { _id: 'w1r3B9p5F4IJHq0x', name: 'Shop 4', address: '101 Maple St' }
                ];

                this.db.insert(mockStores, (err, newDocs) => {
                    if (err) {
                        console.error('Error while inserting mock stores: ', err);
                    } else {
                        console.info('Mock stores inserted: ', newDocs);
                    }
                });
            }
        });
    }

    /**
     * Gets all stores from the database.
     * @returns {Promise<Object[]>} - The array of store documents.
     */
    getAllStores() {
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

    /**
     * Gets a store by its ID.
     * @param {string} storeId - The ID of the store.
     * @returns {Promise<Object>} - The store document.
     */
    getStoreById(storeId) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: storeId }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    /**
     * Adds a new store to the database.
     * @param {Object} store - The store object to add.
     * @returns {Promise<Object>} - The newly added store document.
     */
    addStore(store) {
        return new Promise((resolve, reject) => {
            this.db.insert(store, (err, newDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    /**
     * Updates a store in the database.
     * @param {string} storeId - The ID of the store to update.
     * @param {Object} update - The update object.
     * @returns {Promise<number>} - The number of documents updated.
     */
    updateStore(storeId, update) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: storeId }, { $set: update }, {}, (err, numReplaced) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    /**
     * Deletes a store from the database.
     * @param {string} storeId - The ID of the store to delete.
     * @returns {Promise<number>} - The number of documents removed.
     */
    deleteStore(storeId) {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: storeId }, {}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}

// Initialize StoreDAO with the specified database file path
const storeDAO = new StoreDAO(`${config.DATASTORE_DIR}/stores.db`);
storeDAO.init();

module.exports = storeDAO;