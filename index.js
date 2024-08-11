const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {PORT} = require('./config');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const storeRoutes = require('./src/routes/storeRoutes');
const tuiBox = require("./src/utils/tuiBox");

const app = express();

app.use(cors({
    origins: ["http://localhost:3000", "http://localhost:4200"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stores', storeRoutes);

if ( process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev' ) {
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
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.listen(PORT, () => {
        tuiBox('Charity Shop API', [
            `🚀 Server is running on http://localhost:${PORT}`,
            `📚 Swagger API Docs is running on http://localhost:${PORT}/api-docs`
        ], 'Fraser Hobbs - 2024', 'rounded');
    });
} else {

    app.listen(PORT, () => {
        tuiBox('Charity Shop API', [
            `🚀 Server is running on http://localhost:${PORT}`
        ], 'Fraser Hobbs - 2024', 'rounded');
    });
}
