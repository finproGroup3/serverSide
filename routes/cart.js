const express = require('express');
const router = express.Router();
const CartController = require('../controller/cart_controller.js');
const authorize = require('../middleware/authorize');
// Route to get all columns of the cart
router.get('/:cartId', CartController.getCart);

// Route to get all products in the cart
router.get('/:cartId/products', CartController.getAllProductsInCart);

// Route to add a product to the cart
router.post('/:cartId/product', CartController.addAndnUpdateProductToCart);

// Route to add a promo to the cart
router.post('/:cartId/promo', CartController.addPromoToCart);

// Route to remove a product from the cart
router.delete('/:cartId/product/:productId', CartController.removeProductFromCart);

// Route to remove all product from the cart
router.delete('/:cartId/product/', CartController.removeAllProductsFromCart);

// Route to update shipping cost
router.put('/:cartId/shipping-cost', CartController.updateShippingCost);

module.exports = router;
