const { Sequelize } =  require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
        host: config.dbHost,
        port: config.dbPort,
        dialect: 'postgres',
        logging: console.log,
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connection established successfully.');
        return true;
    }   catch (error) {
        console.error('Unable to connect to PostgreSQL:', error.message);
        return false;
    }
};

module.exports = { sequelize, testConnection };