const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Food = sequelize.define('Food', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'foods',
  timestamps: true
});

module.exports = Food;