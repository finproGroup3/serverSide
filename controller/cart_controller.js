const { Cart, Product, CartProduct, Promo, PromoProduct, Order } = require('../models');

class CartController {

    static async getCart(req, res, next) {
        try {
            const cartId = req.params.cartId;
            // Find the cart by ID
            const cart = await Cart.findByPk(cartId, {
                include: [{ model: CartProduct }]
            });

            if (!cart) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
            }

            res.status(200).json({ status: 'success', code: 200, data: cart, message: 'Cart details retrieved' });
        } catch (error) {
            next(error);
        }
    }


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

    static async addAndnUpdateProductToCart(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const cartId = req.params.cartId;
            // Find the cart by ID
            const cart = await Cart.findByPk(cartId);
            if (!cart) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
            }
            // Find the product by ID to get its price
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
            }
            // Calculate the total price for the quantity
            const price = product.price * quantity;

            // Check if the product already exists in the cart
            const existingCartItem = await CartProduct.findOne({
                where: { cartId, productId }
            });

            if (existingCartItem) {
                // If the product already exists in the cart, update the quantity and total price
                await existingCartItem.update({ quantity, price });
            } else {
                // If the product does not exist in the cart, add it
                await CartProduct.create({ cartId, productId, quantity, price });
            }

            // Update the totalPrice and nettPrice of the cart
            const totalPrice = cart.totalPrice + price;
            const nettPrice = cart.nettPrice + price;
            await cart.update({ totalPrice, nettPrice });

            // Get the userId from the cart
            const userId = cart.userId;
            const order = await Order.findOne({ where: { userId } });

            // If user is first order
            if (!order) {
                const totalAffiliate = nettPrice / 2;
                const updatedNettPrice = nettPrice - totalAffiliate;
                await cart.update({ totalAffiliate, nettPrice: updatedNettPrice });
            }

            res.status(200).json({ status: 'success', code: 200, message: 'Product added/updated to cart', totalPrice, nettPrice });
        } catch (error) {
            next(error);
        }
    }


    static async addPromoToCart(req, res, next) {
        try {
            const { promoId } = req.body;
            const cartId = req.params.cartId;
            // Find the promo by ID
            const promo = await Promo.findByPk(promoId);
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }
            // Check if the promo is active
            if (promo.isActive !== true) {
                return res.status(400).json({ status: 'failed', code: 400, message: 'Promo is not active' });
            }
            if (promo.isGlobal === true) {
                // If the promo is global, directly insert promoId to the cart
                const cart = await Cart.findByPk(cartId);
                if (!cart) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
                }
                // Calculate the total discount based on the promo percentage
                const nettPrice = cart.nettPrice;
                const percentage = promo.percentage;
                const totalDiscount = nettPrice * (percentage / 100);
                const updatedNettPrice = nettPrice - totalDiscount;

                // Update the promo quota if the promo is successfully applied
                await promo.update({ quota: promo.quota - 1 });
                // Update the cart with promo details
                await cart.update({ promoId, totalDiscount, nettPrice: updatedNettPrice });
            } else {
                const cartProducts = await CartProduct.findAll({ where: { cartId } });
                const productIds = cartProducts.map(cartProduct => cartProduct.productId);

                // Find all PromoProducts for the given promoId
                const promoProducts = await PromoProduct.findAll({ where: { promoId } });
                const promoProductIds = promoProducts.map(promoProduct => promoProduct.productId);

                // Check if all productIds in cartProducts are present in promoProductIds
                const allProductsEligible = productIds.every(productId => promoProductIds.includes(productId));

                if (!allProductsEligible) {
                    return res.status(400).json({ status: 'failed', code: 400, message: 'Cart products are not eligible for the promo' });
                }

                // If all products in the cart are eligible, update the cart with the promoId
                const cart = await Cart.findByPk(cartId);

                if (!cart) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
                }

                // Calculate the total discount based on the promo percentage
                const nettPrice = cart.nettPrice;
                const percentage = promo.percentage;
                const totalDiscount = nettPrice * (percentage / 100);
                const updatedNettPrice = nettPrice - totalDiscount;

                // Update the promo quota if the promo is successfully applied
                await promo.update({ quota: promo.quota - 1 });
                // Update the cart with promo details
                await cart.update({ promoId, totalDiscount, nettPrice: updatedNettPrice });
                res.status(200).json({ status: 'success', code: 200, message: 'Promo added to cart' });
            }
        } catch (error) {
            next(error);
        }
    }

    static async changeProductQuantity(req, res, next) {
        try {
            const cartProductId = req.params.productId;
            const cartId = req.params.cartId;
            const { quantity } = req.body;
            // Find the cart product by ID and cart ID
            const cartProduct = await CartProduct.findOne({
                where: { productId: cartProductId, cartId: cartId }
            });
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
            const cartProductId = req.params.productId;
            const cartId = req.params.cartId;

            // Find the cart product by ID and cart ID
            const cartProduct = await CartProduct.findOne({
                where: { productId: cartProductId, cartId: cartId }
            });
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
