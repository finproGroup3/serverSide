const express = require('express');
const router = express.Router();
const CartController = require('../controller/cart_controller.js');

// Route to get all products in the cart
router.get('/:cartId/products', CartController.getAllProductsInCart);

// Route to add a product to the cart
router.post('/:cartId/product', CartController.addProductToCart);

// Route to change the quantity of a product in the cart
router.put('/:cartId/product/:productId', CartController.changeProductQuantity);

// Route to remove a product from the cart
router.delete('/:cartId/product/:productId', CartController.removeProductFromCart);


module.exports = router;
