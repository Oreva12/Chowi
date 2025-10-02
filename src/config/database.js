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




module.exports = sequelize;