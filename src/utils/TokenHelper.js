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
            console.error('Error in getTimeUntilExpiry:', error);
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

            return TokenHelper.formatDateTime(expiryDate);
        } catch (error) {
            console.error('Error in getTokenExpiryDate:', error);
            return null;
        }
    }

    /**
     * Format a date object into HH:MM:SS - DD/MM/YYYY.
     * @param {Date} date - The date object to format.
     * @returns {string} - Formatted date and time.
     */
    static formatDateTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    }
}

module.exports = TokenHelper;
