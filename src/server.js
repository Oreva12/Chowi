require('dotenv').config();
const express = require('express');
const Food = require('./api/food/models/Food');
const User = require('./api/user/models/user'); // Add this line


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


// Import routes
const foodRoutes = require('./api/food/routes');
const userRoutes = require('./api/user/routes'); // Add this line

// Use routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes); // Add this line

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const foodCount = await Food.count();
    const userCount = await User.count(); // Add this line
    res.json({ 
      status: 'DB Connected!', 
      foodCount: foodCount,
      userCount: userCount, // Add this line
      message: 'Database is working correctly!' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'DB Error', 
      error: error.message 
    });
  }
});


// Start server
const startServer = async () => {
  console.log('🔄 Attempting to connect to database...');
  console.log('Database Connected!!!!!!')
  
    try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync only User model
    await User.sync({ force: false });
    console.log('✅ Users table created');

    // Rest of your server code...
  } catch (error) {
    console.error('❌ User table sync failed:', error);
  }



  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📊 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    console.log(`🍕 Food API: http://localhost:${PORT}/api/foods`);
    console.log(`👤 User API: http://localhost:${PORT}/api/users`); // Add this line
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/users/auth`); // Add this line
  });
};

startServer();