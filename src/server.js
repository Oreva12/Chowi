require('dotenv').config();
const express = require('express');
const { testConnection } = require('./config/database');
const { Sequelize, DataTypes } = require('sequelize');
const Food = require('./api/food/models/Food');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const foodRoutes = require('./api/food/routes');
app.use('/api/foods', foodRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

app.get('/test-db', async (req, res) => {
  try {
    // Try to query the database
    const foodCount = await Food.count();
    res.json({ 
      status: 'DB Connected!', 
      foodCount: foodCount,
      message: 'Database is working correctly!' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'DB Error', 
      error: error.message 
    });
  }
});

// ✅ Start server with database connection
const startServer = async () => {
  console.log('🔄 Attempting to connect to database...');
  
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.log('❌ Server cannot start without database connection.');
    process.exit(1);
  }
  
  // Sync database (create tables)
  try {
    await Food.sync({ force: false });
    console.log('✅ Food table synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📊 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  });
};

startServer();