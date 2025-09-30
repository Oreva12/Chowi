const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// GET /api/foods - Get all foods
router.get('/', foodController.getAllFoods);

// GET /api/foods/:id - Get a single food
router.get('/:id', foodController.getFoodById);

// POST /api/foods - Create a new food
router.post('/', foodController.createFood);

// PUT /api/foods/:id - Update a food
router.put('/:id', foodController.updateFood);

// DELETE /api/foods/:id - Delete a food
router.delete('/:id', foodController.deleteFood);

module.exports = router;