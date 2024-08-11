const jwt = require('jsonwebtoken');

class TokenHelper {
    /**
     * Get the time in seconds until the token expires.
     * @param {string} token - The JWT token.
     * @param {string} secret - The secret key used to verify the token.
     * @returns {number|null} - Time in seconds until expiry, or null if the token is invalid.
     */
    static getTimeUntilExpiry(token, secret) {
        try {
            const decoded = jwt.verify(token, secret);
            const now = Math.floor(Date.now() / 1000);
            return decoded.exp - now; // Time in seconds
        } catch (error) {
            return null;
        }
    }

    /**
     * Get the expiration date and time in the format HH:MM:SS - DD/MM/YYYY.
     * @param {string} token - The JWT token.
     * @param {string} secret - The secret key used to verify the token.
     * @returns {string|null} - Formatted expiration date and time, or null if the token is invalid.
     */
    static getTokenExpiryDate(token, secret) {
        try {
            const decoded = jwt.verify(token, secret);
            const expiryDate = new Date(decoded.exp * 1000); // Convert from seconds to milliseconds

            const hours = String(expiryDate.getHours()).padStart(2, '0');
            const minutes = String(expiryDate.getMinutes()).padStart(2, '0');
            const seconds = String(expiryDate.getSeconds()).padStart(2, '0');

            const day = String(expiryDate.getDate()).padStart(2, '0');
            const month = String(expiryDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = expiryDate.getFullYear();

            return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
        } catch (error) {
            return null;
        }
    }
}

module.exports = TokenHelper;