module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Optionally include stack trace in development mode
    });
    next();
};
