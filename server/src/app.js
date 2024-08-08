const path = require('path')
const express = require('express');
// const routers = require('./routers');

// const { 
//     errorHandlers: { validationErrorHandler, sequelizeErrorHandler, errorHandler, multerErrorHandler } 
// } = require('./middleware');


const app = express();
app.use(express.json());
app.use(express.static(path.resolve(process.env.STATIC_PATH)));

// app.use('/api', routers);

// app.use(validationErrorHandler, sequelizeErrorHandler, multerErrorHandler, errorHandler);

module.exports = app;