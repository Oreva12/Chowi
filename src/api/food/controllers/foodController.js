const foodService = require('../services/foodService');

const foodController = {
  // GET /api/foods - Get all foods
  async getAllFoods(req, res, next) {
    try {
      const foods = await foodService.getAllFoods(req.query);
      res.json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/foods/:id - Get a single food
  async getFoodById(req, res, next) {
    try {
      const food = await foodService.getFoodById(req.params.id);
      
      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }
      
      res.json({
        success: true,
        data: food
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/foods - Create a new food
  async createFood(req, res, next) {
    try {
      const { name, price, category } = req.body;
      
      // Basic validation (we'll improve this later)
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Name and price are required'
        });
      }
      
      const newFood = await foodService.createFood({ name, price, category });
      
      res.status(201).json({
        success: true,
        message: 'Food created successfully',
        data: newFood
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/foods/:id - Update a food
  async updateFood(req, res, next) {
    try {
      const updatedFood = await foodService.updateFood(req.params.id, req.body);
      
      if (!updatedFood) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Food updated successfully',
        data: updatedFood
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/foods/:id - Delete a food
  async deleteFood(req, res, next) {
    try {
      const deletedFood = await foodService.deleteFood(req.params.id);
      
      if (!deletedFood) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Food deleted successfully',
        data: deletedFood
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = foodController;