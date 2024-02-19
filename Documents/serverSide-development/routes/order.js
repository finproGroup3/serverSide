const express = require('express');
const router = express.Router();
const OrderController = require('../controller/order_controller');
const authorize = require('../middleware/authorize');

// Route to add a new order
router.post('/', authorize, OrderController.addOrder);

// Route to add a payment bill to an existing order
router.put('/:orderId/payment-bill', authorize, OrderController.addPaymentBill);

// Route to get all orders
router.put('/:orderId/invoice-url', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return OrderController.addInvoiceUrl(req, res, next);
});

// Route to get all orders
router.get('/', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return OrderController.getAllOrders(req, res, next);
});

// Route to update the status of a product in an order
router.put('/:orderId/products/:productId/status', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return OrderController.updateProductStatus(req, res, next);
});

// Route to get top buyers based on highest nettPrice with same userId
router.get('/top-buyers', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return OrderController.getTopBuyers(req, res, next);
});

// Route to get all orders with the same userId
router.get('/user/:userId', authorize, OrderController.getOrdersByUserId);

// Route to get highest selling products
router.get('/top-products', authorize, OrderController.getHighestSellingProducts);

module.exports = router;
