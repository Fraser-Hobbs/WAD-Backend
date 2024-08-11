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

// Custom Morgan format: date/time - route - activity
morgan.token('date', () => new Date().toISOString());
morgan.token('route', (req) => req.originalUrl);
morgan.token('activity', (req) => `${req.method} ${req.originalUrl}`);

const morganFormat = ':date - :route - :activity';
app.use(morgan(morganFormat));

// Configure CORS with environme nt variables
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
            openapi: "3.0.0",
            info: {
                title: 'Charity Shop API',
                version: '1.0.0',
                description: "API for managing charity shop inventory and users",
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 3000}/api`,
                    description: 'Development server',
                },
            ],
            components: {
                securitySchemes: {
                    cookieAuth: {
                        type: 'apiKey',
                        in: 'cookie',
                        name: 'accessToken',
                        description: 'JWT Authorization cookie. Example: "accessToken={token}"'
                    }
                }
            },
            security: [
                {
                    cookieAuth: []
                }
            ],
            basePath: '/api',
        },
        apis: ["./src/routes/*.js"]
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
