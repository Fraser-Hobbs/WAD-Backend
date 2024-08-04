const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PORT, URL } = require('./config');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const tuiBox = require("./src/utils/tuiBox");

const app = express();

app.use(cors({
    origin: URL ,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/items', itemRoutes);

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    const swaggerJsDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const swaggerOptions = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: 'Charity Shop API',
                version: '1.0.0',
                description: "API for Charity Shop",
                contact: {
                    name: "Fraser Hobbs",
                },
                servers: [{
                    url: `http://localhost:${PORT || 3000}`
                }, {
                    url: URL
                }]
            },
            tags: [
                { name: 'Auth', description: 'Authentication endpoints' },
                { name: 'Users', description: 'User management endpoints' },
                { name: 'Items', description: 'Item management endpoints' }
            ],
            components: {
                securitySchemes: {
                    cookieAuth: {
                        type: 'apiKey',
                        in: 'cookie',
                        name: 'accessToken'
                    }
                }
            },
            security: [
                {
                    cookieAuth: []
                }
            ]
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
