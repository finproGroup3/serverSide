const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/category_controller');
const authorize = require('../middleware/authorize');

// Route to add a new category
router.post('/', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return CategoryController.addCategory(req, res, next);
});

// Route to get all categories with associated products
router.get('/', CategoryController.getAllCategories);

// Route to delete a category by ID
router.delete('/categories/:id', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return CategoryController.deleteCategory(req, res, next);
});

module.exports = router;
