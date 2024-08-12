const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userDAO');
const ApiResponseDTO = require('../dto/apiResponseDTO');
const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION
} = require('../config/config');

const {getTimeUntilExpiry} = require("../utils/TokenHelper");

const generateAccessToken = (user) => {
    return jwt.sign({
        _id: user._id,
        role: user.role,
        storeId: user.storeId
    }, ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
};

const generateRefreshToken = (user) => {
    return jwt.sign({
        _id: user._id,
        role: user.role,
        storeId: user.storeId
    }, REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION});
};

const isTokenExpired = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp <= now;
    } catch (error) {
        return true;
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findByEmail(email);
        if ( !user || !bcrypt.compareSync(password, user.passwordHash) ) {
            return res.status(401).json(new ApiResponseDTO('Login Failed', null, "Invalid email or password"));
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: ACCESS_TOKEN_EXPIRATION,
            sameSite: 'Strict',
            secure: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: REFRESH_TOKEN_EXPIRATION,
            sameSite: 'Strict'
        });

        const {passwordHash, ...userWithoutSensitiveInfo} = user;
        res.json(new ApiResponseDTO('Login Successful', {isAuthenticated: true, user: userWithoutSensitiveInfo}, null));
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json(new ApiResponseDTO('Server error', null, error.message));
    }
};

exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.json(new ApiResponseDTO('Logged out', null, null));
};

exports.refreshToken = async (req, res) => {
    const {refreshToken} = req.cookies;
    if ( !refreshToken ) return res.status(401).json(new ApiResponseDTO('Unauthorized', null, 'No refresh token provided'));

    if ( isTokenExpired(refreshToken, REFRESH_TOKEN_SECRET) ) {
        return res.status(403).json(new ApiResponseDTO('Forbidden', null, 'Refresh token expired'));
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if ( !user ) return res.status(401).json(new ApiResponseDTO('Unauthorized', null, 'User not found'));

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: ACCESS_TOKEN_EXPIRATION,
            sameSite: 'Strict'
        });
        res.json(new ApiResponseDTO('Token refreshed', null, null));
    } catch (error) {
        res.status(403).json(new ApiResponseDTO('Forbidden', null, error.message));
    }
};

exports.checkAuth = async (req, res) => {
    const {accessToken, refreshToken} = req.cookies;

    // Check if access token is provided
    if ( !accessToken && refreshToken ) {
        return res.status(401).json(new ApiResponseDTO('Unauthorized', {isAuthenticated: false}, 'No access token provided'));
    }

    // Check if the access token is expired
    if ( getTimeUntilExpiry(accessToken, ACCESS_TOKEN_SECRET) <= 0 ) {
        return res.status(401).json(new ApiResponseDTO('Unauthorized', {isAuthenticated: false}, 'Access Token Expired'));
    }

    try {
        // Verify the access token and retrieve the user
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if ( !user ) {
            return res.status(401).json(new ApiResponseDTO('Unauthorized', {isAuthenticated: false}, 'User not found'));
        }

        // Log the time until expiry
        console.log(`Access Token valid. Time until expiry: ${getTimeUntilExpiry(accessToken, ACCESS_TOKEN_SECRET)} seconds`);

        // Respond with an authenticated status
        return res.json(new ApiResponseDTO('Authenticated', {isAuthenticated: true}, null));
    } catch (error) {
        console.error('Check auth error:', error);
        return res.status(401).json(new ApiResponseDTO('Unauthorized', {isAuthenticated: false}, error.message));
    }
};