const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PORT } = require('./config');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const storeRoutes = require('./src/routes/storeRoutes');
const tuiBox = require("./src/utils/tuiBox");
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Set up security headers with Helmet
app.use(helmet());

// Set up request logging with Morgan
app.use(morgan('combined'));

// Configure CORS with environment variables
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ["http://localhost:3000", "http://localhost:4200"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Route handling
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stores', storeRoutes);

// Swagger documentation setup in development environment
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    const swaggerJsDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'API Information'
            },
            servers: [{ url: 'http://localhost:5000' }]
        },
        apis: ['./src/routes/*.js']
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}


app.use(errorHandler);

// Start the server with conditional logging
app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
        tuiBox('Charity Shop API', [
            `🚀 Server is running on http://localhost:${PORT}`,
            `📚 Swagger API Docs is running on http://localhost:${PORT}/api-docs`
        ], 'Fraser Hobbs - 2024', 'rounded');
    } else {
        tuiBox('Charity Shop API', [
            `🚀 Server is running on http://localhost:${PORT}`
        ], 'Fraser Hobbs - 2024', 'rounded');
    }
});

module.exports = app;
