const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Define the path where secrets will be stored
const secretFilePath = path.join(__dirname, '../secrets.json');

// Generate a random SHA256 secret
function generateSecret() {
    return crypto.createHash('sha256').update(crypto.randomBytes(64)).digest('hex');
}

// Load or generate secrets
function loadSecrets() {
    let secrets = {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || null,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || null
    };

    // If secrets are not provided in environment variables, check if they exist in the secrets file
    if (!secrets.ACCESS_TOKEN_SECRET || !secrets.REFRESH_TOKEN_SECRET) {
        if (fs.existsSync(secretFilePath)) {
            const fileSecrets = JSON.parse(fs.readFileSync(secretFilePath, 'utf8'));
            secrets.ACCESS_TOKEN_SECRET = secrets.ACCESS_TOKEN_SECRET || fileSecrets.ACCESS_TOKEN_SECRET || generateSecret();
            secrets.REFRESH_TOKEN_SECRET = secrets.REFRESH_TOKEN_SECRET || fileSecrets.REFRESH_TOKEN_SECRET || generateSecret();
        } else {
            // Generate new secrets if they don't exist
            secrets.ACCESS_TOKEN_SECRET = secrets.ACCESS_TOKEN_SECRET || generateSecret();
            secrets.REFRESH_TOKEN_SECRET = secrets.REFRESH_TOKEN_SECRET || generateSecret();

            // Save the generated secrets to a file
            fs.writeFileSync(secretFilePath, JSON.stringify(secrets, null, 2));
        }
    }

    return secrets;
}

const secrets = loadSecrets();

module.exports = secrets;
