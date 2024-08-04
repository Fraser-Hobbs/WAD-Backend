const path = require("node:path");

module.exports = {
    URL: process.env.URL || `http://localhost:${process.env.PORT || 3000}`,
    PORT: process.env.PORT || 3000,
    DATASTORE_DIR: path.resolve(process.env.DATASTORE_DIR),
    BCRYPT_SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
};
