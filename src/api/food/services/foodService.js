const Food = require('../models/Food');

const foodService = {
  // Get all foods with optional filtering
  async getAllFoods(filters = {}) {
    const whereClause = {};
    
    if (filters.category) whereClause.category = filters.category;
    // You can add more filters later (price range, availability, etc.)

    return await Food.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']] 
    });
  },

  // Get a single food by ID
  async getFoodById(foodId) {
    return await Food.findByPk(foodId);
  },

  // Create a new food item
  async createFood(foodData) {
    return await Food.create(foodData);
  },

  // Update a food item
  async updateFood(foodId, updateData) {
    const food = await Food.findByPk(foodId);
    if (!food) return null;
    
    return await food.update(updateData);
  },

  // Delete a food item
  async deleteFood(foodId) {
    const food = await Food.findByPk(foodId);
    if (!food) return null;
    
    await food.destroy();
    return food;
  }
};

module.exports = foodService;