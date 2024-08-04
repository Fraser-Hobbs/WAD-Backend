const express = require('express');
const cookieParser = require('cookie-parser');
const { PORT } = require('./config');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const tuiBox = require("./src/utils/tuiBox");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
    tuiBox('Charity Shop API', [
        `🚀 Server is running on http://localhost:${PORT}`
    ], 'Fraser Hobbs - 2024', 'rounded');
});