const Datastore = require('nedb');
const config = require('../../config');

/**
 * Data Access Object for Item operations.
 */
class ItemDAO {
    /**
     * Creates an instance of ItemDAO.
     * @param {string} [dbFilePath] - Path to the database file.
     */
    constructor(dbFilePath) {
        if ( dbFilePath ) {
            this.db = new Datastore({filename: dbFilePath, autoload: true});
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new Datastore();
        }
    }

    /**
     * Initializes the database with mock items if empty.
     */
    init() {
        this.db.find({}, (err, docs) => {
            if ( docs.length === 0 ) {
                const getRandomDate = () => {
                    const daysAgo = Math.floor(Math.random() * 30);
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);
                    return date.toISOString();
                };

                const mockItems = [
                    {
                        name: 'Antique Vase',
                        description: 'A beautiful antique vase from the 19th century.',
                        price: 50,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Vintage Clock',
                        description: 'A vintage clock in perfect working condition.',
                        price: 75,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Leather Jacket',
                        description: 'A stylish leather jacket, barely used.',
                        price: 100,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Book Collection',
                        description: 'A collection of classic novels.',
                        price: 30,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Ceramic Plate Set',
                        description: 'A set of 12 ceramic plates.',
                        price: 40,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Wooden Table',
                        description: 'A solid oak wooden table.',
                        price: 120,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Electric Guitar',
                        description: 'An electric guitar with amp.',
                        price: 150,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                    {
                        name: 'Mountain Bike',
                        description: 'A high-quality mountain bike.',
                        price: 200,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Lampshade',
                        description: 'A decorative lampshade.',
                        price: 25,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Dinner Set',
                        description: 'A complete dinner set for six.',
                        price: 60,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Painting',
                        description: 'A beautiful landscape painting.',
                        price: 80,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                    {
                        name: 'Coffee Maker',
                        description: 'A programmable coffee maker.',
                        price: 35,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Sofa',
                        description: 'A comfortable two-seater sofa.',
                        price: 250,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Smartphone',
                        description: 'A latest model smartphone.',
                        price: 300,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Tablet',
                        description: 'A 10-inch display tablet.',
                        price: 150,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                    {
                        name: 'Headphones',
                        description: 'Noise-cancelling headphones.',
                        price: 100,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Backpack',
                        description: 'A durable hiking backpack.',
                        price: 75,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Wristwatch',
                        description: 'A stainless steel wristwatch.',
                        price: 50,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Sunglasses',
                        description: 'A pair of polarized sunglasses.',
                        price: 20,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                    {
                        name: 'Blender',
                        description: 'A high-speed blender.',
                        price: 45,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Gaming Console',
                        description: 'A next-gen gaming console.',
                        price: 400,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Smart TV',
                        description: 'A 50-inch 4K Smart TV.',
                        price: 600,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Microwave',
                        description: 'A microwave with multiple functions.',
                        price: 80,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                    {
                        name: 'Refrigerator',
                        description: 'A double-door refrigerator.',
                        price: 500,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Washing Machine',
                        description: 'A front-load washing machine.',
                        price: 450,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Air Conditioner',
                        description: 'A 1.5-ton air conditioner.',
                        price: 700,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Dishwasher',
                        description: 'A high-efficiency dishwasher.',
                        price: 350,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                    {
                        name: 'Laptop',
                        description: 'A gaming laptop with high-end specs.',
                        price: 1200,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate(),
                        userId: 'user1'
                    },
                    {
                        name: 'Office Chair',
                        description: 'An ergonomic office chair.',
                        price: 150,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate(),
                        userId: 'user2'
                    },
                    {
                        name: 'Bookshelf',
                        description: 'A wooden bookshelf with 5 tiers.',
                        price: 100,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate(),
                        userId: 'user3'
                    },
                    {
                        name: 'Grill',
                        description: 'A barbecue grill for outdoor cooking.',
                        price: 200,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate(),
                        userId: 'user4'
                    },
                ];

                this.db.insert(mockItems, (err, newDocs) => {
                    if ( err ) {
                        console.error('Error while inserting mock items: ', err);
                    } else {
                        console.info('Mock items inserted: ', newDocs);
                    }
                });
            }
        });
    }

    /**
     * Gets items based on a query.
     * @param {Object} query - The query object.
     * @returns {Promise<Object[]>} - The array of item documents.
     */
    getItems(query) {
        return new Promise((resolve, reject) => {
            this.db.find(query, (err, docs) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    /**
     * Gets a single item based on a query.
     * @param {Object} query - The query object.
     * @returns {Promise<Object>} - The item document.
     */
    getSingleItem(query) {
        return new Promise((resolve, reject) => {
            this.db.findOne(query, (err, doc) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    /**
     * Adds a new item to the database.
     * @param {Object} item - The item object to add, including userId.
     * @returns {Promise<Object>} - The newly added item document.
     */
    addItem(item) {
        return new Promise((resolve, reject) => {
            this.db.insert(item, (err, newDoc) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }

    /**
     * Updates an item in the database.
     * @param {Object} query - The query object to find the item.
     * @param {Object} update - The update object.
     * @param {Object} [options] - Additional options.
     * @returns {Promise<number>} - The number of documents updated.
     */
    updateItem(query, update, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.update(query, update, options, (err, numReplaced) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    /**
     * Removes an item from the database.
     * @param {Object} query - The query object to find the item.
     * @param {Object} [options] - Additional options.
     * @returns {Promise<number>} - The number of documents removed.
     */
    removeItem(query, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.remove(query, options, (err, numRemoved) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }

    /**
     * Gets items by store ID.
     * @param {string} storeId - The ID of the store.
     * @returns {Promise<Object[]>} - The array of item documents.
     */
    getItemsByStoreId(storeId) {
        return new Promise((resolve, reject) => {
            this.db.find({storeId}, (err, docs) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

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

// Initialize ItemDAO with the specified database file path
const itemDAO = new ItemDAO(`${config.DATASTORE_DIR}/items.db`);
itemDAO.init();

module.exports = itemDAO;