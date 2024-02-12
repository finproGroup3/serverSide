const express = require('express');
const router = express.Router();
const CartController = require('../controller/cart_controller.js');

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


module.exports = router;
