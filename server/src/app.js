const path = require('path')
const express = require('express');
const cors = require('cors');
const routers = require('./routers');

const {
    errorHandlers: { validationErrorHandler, sequelizeErrorHandler, multerErrorHandler, errorHandler }
} = require('./middlewares');


const app = express();
app.use(cors({
    origin: process.env.CLIENT,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.use(express.json());
app.use(express.static(path.resolve(process.env.STATIC_PATH)));

app.use('/api', routers);

app.use(validationErrorHandler, sequelizeErrorHandler, multerErrorHandler, errorHandler);

module.exports = app;