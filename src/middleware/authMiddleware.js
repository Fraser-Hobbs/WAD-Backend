const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../../config');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        // console.log(`Authenticate Token - decoded:  ${JSON.stringify(decoded)}`);

        req.user = decoded;
        next();
    });
};

exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
