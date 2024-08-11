const TimeConverter = require("./src/utils/timeConverter");
const path = require("node:path");

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in the environment variables');
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment variables');
}

const DEFAULT_ACCESS_TOKEN_EXPIRATION = '15m'; // Default: 15 minutes
const DEFAULT_REFRESH_TOKEN_EXPIRATION = '7d';  // Default: 7 days

module.exports = {
    URL: process.env.URL || `http://localhost:${process.env.PORT || 3000}`,
    PORT: process.env.PORT || 3000,
    DATASTORE_DIR: process.env.DATASTORE_DIR ? path.resolve(process.env.DATASTORE_DIR) : path.resolve(__dirname, 'datastore'),
    BCRYPT_SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 10,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: TimeConverter(process.env.ACCESS_TOKEN_EXPIRATION || DEFAULT_ACCESS_TOKEN_EXPIRATION),
    REFRESH_TOKEN_EXPIRATION: TimeConverter(process.env.REFRESH_TOKEN_EXPIRATION || DEFAULT_REFRESH_TOKEN_EXPIRATION),
};
