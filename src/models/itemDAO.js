const Datastore = require('nedb');
const config = require('../../config');

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
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Vintage Clock',
                        description: 'A vintage clock in perfect working condition.',
                        price: 75,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Leather Jacket',
                        description: 'A stylish leather jacket, barely used.',
                        price: 100,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Book Collection',
                        description: 'A collection of classic novels.',
                        price: 30,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Ceramic Plate Set',
                        description: 'A set of 12 ceramic plates.',
                        price: 40,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Wooden Table',
                        description: 'A solid oak wooden table.',
                        price: 120,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Electric Guitar',
                        description: 'An electric guitar with amp.',
                        price: 150,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Mountain Bike',
                        description: 'A high-quality mountain bike.',
                        price: 200,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Lampshade',
                        description: 'A decorative lampshade.',
                        price: 25,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Dinner Set',
                        description: 'A complete dinner set for six.',
                        price: 60,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Painting',
                        description: 'A beautiful landscape painting.',
                        price: 80,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Coffee Maker',
                        description: 'A programmable coffee maker.',
                        price: 35,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Sofa',
                        description: 'A comfortable two-seater sofa.',
                        price: 250,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Smartphone',
                        description: 'A latest model smartphone.',
                        price: 300,
                        storeId: 'kYZnkBrmiZwhOQ61',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Tablet',
                        description: 'A 10-inch display tablet.',
                        price: 150,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Headphones',
                        description: 'Noise-cancelling headphones.',
                        price: 100,
                        storeId: 'w1r3B9p5F4IJHq0x',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Backpack',
                        description: 'A durable hiking backpack.',
                        price: 75,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Wristwatch',
                        description: 'A stainless steel wristwatch.',
                        price: 50,
                        storeId: 'dpIM3R5pQoXuMszt',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Sunglasses',
                        description: 'A pair of polarized sunglasses.',
                        price: 20,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate()
                    },
                    {
                        name: 'Blender',
                        description: 'A high-speed blender.',
                        price: 45,
                        storeId: 'hnDVPnZk4l3WfmRp',
                        dateCreated: getRandomDate()
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
