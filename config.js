const TimeConverter = require("./src/utils/timeConverter");
const path = require("node:path");

module.exports = {
    URL: process.env.URL || `http://localhost:${process.env.PORT || 3000}`,
    PORT: process.env.PORT || 3000,
    DATASTORE_DIR: path.resolve(process.env.DATASTORE_DIR),
    BCRYPT_SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: TimeConverter(process.env.ACCESS_TOKEN_EXPIRATION),
    REFRESH_TOKEN_EXPIRATION: TimeConverter(process.env.REFRESH_TOKEN_EXPIRATION),
};
