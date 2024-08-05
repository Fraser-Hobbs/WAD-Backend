const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userDAO');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = require('../../config');

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: ACCESS_TOKEN_EXPIRATION });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: REFRESH_TOKEN_EXPIRATION });

        const { passwordHash, ...userWithoutSensitiveInfo } = user;
        res.json({ message: 'Login Successful', user: userWithoutSensitiveInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        const accessToken = generateAccessToken(user);

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
        res.json({ message: 'Token refreshed' });
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
};
