require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASS,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT
};

module.exports = config;