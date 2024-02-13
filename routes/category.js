const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/category_controller');

// Route to add a new category
router.post('/', CategoryController.addCategory);

// Route to get all categories with associated products
router.get('/', CategoryController.getAllCategories);

// Route to delete a category by ID
router.delete('/categories/:id', CategoryController.deleteCategory);

module.exports = router;
