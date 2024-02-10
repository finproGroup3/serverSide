const { Cart, Product, CartProduct } = require('../models');

class CartController {

    static async getAllProductsInCart(req, res, next) {
        try {
            const cartId = req.params.cartId;

            // Find all products in the cart
            const cartProducts = await CartProduct.findAll({
                where: { cartId },
                include: [{ model: Product }]
            });

            res.status(200).json({ status: 'success', code: 200, data: cartProducts, message: 'Products retrieved from cart' });
        } catch (error) {
            next(error);
        }
    }

    static async addProductToCart(req, res, next) {
        try {
            const { productId, quantity, price } = req.body;
            const cartId = req.params.cartId;
            // Check if the product already exists in the cart
            const existingCartItem = await CartProduct.findOne({
                where: { cartId, productId }
            });

            if (existingCartItem) {
                // If the product already exists in the cart, update the quantity
                await existingCartItem.update({ quantity: existingCartItem.quantity + quantity });
                res.status(200).json({ status: 'success', code: 200, message: 'Product quantity updated in cart' });
            } else {
                // If the product does not exist in the cart, add it
                await CartProduct.create({ cartId, productId, quantity, price });
                res.status(201).json({ status: 'success', code: 201, message: 'Product added to cart' });
            }
        } catch (error) {
            next(error);
        }
    }

    static async changeProductQuantity(req, res, next) {
        try {
            const { cartProductId, quantity } = req.body;

            // Find the cart product by ID
            const cartProduct = await CartProduct.findByPk(cartProductId);

            if (!cartProduct) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart product not found' });
            }

            // Update the quantity of the cart product
            await cartProduct.update({ quantity });

            res.status(200).json({ status: 'success', code: 200, message: 'Cart product quantity updated' });
        } catch (error) {
            next(error);
        }
    }

    static async removeProductFromCart(req, res, next) {
        try {
            const cartProductId = req.params.id;

            // Find the cart product by ID
            const cartProduct = await CartProduct.findByPk(cartProductId);

            if (!cartProduct) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart product not found' });
            }

            // Delete the cart product
            await cartProduct.destroy();

            res.status(200).json({ status: 'success', code: 200, message: 'Product removed from cart' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CartController;
