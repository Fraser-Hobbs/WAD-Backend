const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userDAO');
const ApiResponseDTO = require('../dto/apiResponseDTO');
const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION
} = require('../../config');

const { getTimeUntilExpiry } = require("../utils/TokenHelper");

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

const validateToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json(new ApiResponseDTO('Login Failed', null, "Invalid email or password"));
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: ACCESS_TOKEN_EXPIRATION,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: REFRESH_TOKEN_EXPIRATION,
            sameSite: 'Strict'
        });

        const { passwordHash, ...userWithoutSensitiveInfo } = user;
        res.json(new ApiResponseDTO('Login Successful', userWithoutSensitiveInfo, null));
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json(new ApiResponseDTO('Login Failed', null, error.message));
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json(new ApiResponseDTO('Unauthorized', null, 'Refresh token not provided'));
    }

    try {
        const decoded = validateToken(refreshToken, REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json(new ApiResponseDTO('Unauthorized', null, 'Invalid or expired refresh token'));
        }

        const user = await User.findById(decoded._id);
        if (!user) return res.status(401).json(new ApiResponseDTO('Unauthorized', null, 'User not found'));

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: ACCESS_TOKEN_EXPIRATION,
            sameSite: 'Strict'
        });
        res.json(new ApiResponseDTO('Token refreshed', null, null));
    } catch (error) {
        res.status(403).json(new ApiResponseDTO('Forbidden', null, error.message));
    }
};

exports.checkAuth = async (req, res) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        return res.status(401).json(new ApiResponseDTO('Unauthorized', { isAuthenticated: false }, 'No access token provided'));
    }

    const decoded = validateToken(accessToken, ACCESS_TOKEN_SECRET);
    if (!decoded) {
        return res.status(401).json(new ApiResponseDTO('Unauthorized', { isAuthenticated: false }, 'Access Token Expired'));
    }

    try {
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json(new ApiResponseDTO('Unauthorized', { isAuthenticated: false }, 'User not found'));
        }

        console.log(`Access Token valid. Time until expiry: ${getTimeUntilExpiry(accessToken, ACCESS_TOKEN_SECRET)} seconds`);
        return res.json(new ApiResponseDTO('Authenticated', { isAuthenticated: true }, null));
    } catch (error) {
        console.error('Check auth error:', error);
        return res.status(401).json(new ApiResponseDTO('Unauthorized', { isAuthenticated: false }, error.message));
    }
};

exports.logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json(new ApiResponseDTO('Successfully logged out', null, null));
};
