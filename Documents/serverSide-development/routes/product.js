const express = require('express');
const router = express.Router();
const ProductController = require('../controller/product_controller.js');
const authorize = require('../middleware/authorize');

// GET all products (admin and user can access)
router.get('/', authorize, ProductController.getAll);

// GET product by ID (admin and user can access)
router.get('/:id', authorize, ProductController.getById);

// POST add new product (only admin can access)
router.post('/', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return ProductController.addProduct(req, res, next);
});

// PUT edit product (only admin can access)
router.put('/:id', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return ProductController.editProduct(req, res, next);
});

// DELETE delete product (only admin can access)
router.delete('/:id', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return ProductController.deleteProduct(req, res, next);
});

module.exports = router;
