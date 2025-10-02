const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

let sequelize;

try {
  sequelize = require('../../../config/database');
  console.log('✅ Using imported sequelize instance');
} catch (error) {
  console.error('❌ Config import failed, creating new instance...');
  
  // Create a proper fallback with actual database credentials
  sequelize = new Sequelize(
    process.env.DB_NAME || 'chowi',
    process.env.DB_USER || 'postgres', 
    process.env.DB_PASS || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
      logging: false
    }
  );
  console.log('✅ Created fallback sequelize instance');
}

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin', 'vendor'),
    defaultValue: 'customer'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;