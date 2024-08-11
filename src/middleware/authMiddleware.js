const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../../config');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        console.error('Authentication failed: No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Authentication failed: Invalid or expired token', err);
            res.clearCookie('accessToken');  // Clear the invalid token
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        req.user = decoded;
        next();
    });
};

exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.error(`Authorization failed: User role ${req.user.role} not permitted`);
            return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        }
        next();
    };
};
