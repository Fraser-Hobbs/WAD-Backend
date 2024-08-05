const Datastore = require('nedb');
const config = require('../../config');


class StoreDAO {
    constructor(dbFilePath) {
        if ( dbFilePath ) {
            this.db = new Datastore({filename: dbFilePath, autoload: true});
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new Datastore();
        }
    }

    init() {
        this.db.find({}, (err, docs) => {
            if ( docs.length === 0 ) {
                const mockStores = [
                    { _id: 'dpIM3R5pQoXuMszt', name: 'Shop 2', address: '456 Oak St' },
                    { _id: 'hnDVPnZk4l3WfmRp', name: 'Shop 3', address: '789 Pine St' },
                    { _id: 'kYZnkBrmiZwhOQ61', name: 'Shop 1', address: '123 Main St' },
                    { _id: 'w1r3B9p5F4IJHq0x', name: 'Shop 4', address: '101 Maple St' }
                ];

                this.db.insert(mockStores, (err, newDocs) => {
                    if ( err ) {
                        console.error('Error while inserting mock stores: ', err);
                    } else {
                        console.info('Mock stores inserted: ', newDocs);
                    }
                });
            }
        });
    }

    getAllStores() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, docs) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    getStoreById(storeId) {
        return new Promise((resolve, reject) => {
            this.db.findOne({_id: storeId}, (err, doc) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    addStore(store) {
        return new Promise((resolve, reject) => {
            this.db.insert(store, (err, newDoc) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    updateStore(storeId, update) {
        return new Promise((resolve, reject) => {
            this.db.update({_id: storeId}, {$set: update}, {}, (err, numReplaced) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    deleteStore(storeId) {
        return new Promise((resolve, reject) => {
            this.db.remove({_id: storeId}, {}, (err, numRemoved) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}

const storeDAO = new StoreDAO(`${config.DATASTORE_DIR}/stores.db`);
storeDAO.init();
module.exports = storeDAO;