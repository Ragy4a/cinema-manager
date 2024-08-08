const http = require('http');
require('dotenv').config()

const app = require('./src/app.js')

const HOST_NAME = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;
const server = http.createServer(app);


server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is running on http://${HOST_NAME}:${PORT}`);
});