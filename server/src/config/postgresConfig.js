require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.SERVER_HOST,
    dialect: process.env.DB_USER,
    migrationStorage: 'json',
    seederStorage: 'json',
  },
  test: {},
  production: {}
};