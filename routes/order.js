const express = require('express');
const router = express.Router();
const OrderController = require('../controller/order_controller');

// Route to add a new order
router.post('/', OrderController.addOrder);

// Route to add a payment bill to an existing order
router.put('/:orderId/payment-bill', OrderController.addPaymentBill);

// Route to add an invoice URL to an existing order
router.put('/:orderId/invoice-url', OrderController.addInvoiceUrl);

// Route to get all orders
router.get('/', OrderController.getAllOrders);

// Route to update the status of a product in an order
router.put('/:orderId/products/:productId/status', OrderController.updateProductStatus);

module.exports = router;
