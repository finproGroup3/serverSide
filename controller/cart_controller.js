const { Cart, Product, CartProduct, Promo, PromoProduct, Order, ProductGallery } = require('../models');
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});

class CartController {

    static async getCart(req, res, next) {
        try {
            const cartId = req.params.cartId;
            // Find the cart by ID
            const cart = await Cart.findByPk(cartId, {
                include: [{ model: CartProduct, include: [Product] }]
            });

            if (!cart) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
            }

            // Extracting product IDs from cart products
            const productIds = cart.CartProducts.map(cartProduct => cartProduct.productId);

            // Fetching the first imageUrl for each productId
            const productImages = await Promise.all(productIds.map(async productId => {
                const productGallery = await ProductGallery.findOne({
                    where: { productId },
                    attributes: ['imageUrl'],
                    limit: 1
                });
                return { productId, imageUrl: productGallery ? productGallery.imageUrl : null };
            }));

            // Merging product images into the cart data
            cart.CartProducts.forEach(cartProduct => {
                const productImage = productImages.find(item => item.productId === cartProduct.productId);
                cartProduct.Product.dataValues.imageUrl = productImage ? productImage.imageUrl : null;
            });

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

            // Extracting productIds from cartProducts
            const productIds = cartProducts.map(cartProduct => cartProduct.productId);

            // Find all product galleries associated with the products in the cart
            const productGalleries = await ProductGallery.findAll({
                where: { productId: productIds },
                include: [{ model: Product }]
            });

            res.status(200).json({ status: 'success', code: 200, data: productGalleries, message: 'Product galleries retrieved from cart' });
        } catch (error) {
            next(error);
        }
    }



    static async addAndnUpdateProductToCart(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { productId, quantity } = req.body;
            const cartId = req.params.cartId;
            // Find the cart by ID
            const cart = await Cart.findByPk(cartId, { transaction: t });
            if (!cart) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
            }
            // Find the product by ID to get its price
            const product = await Product.findByPk(productId, { transaction: t });
            if (!product) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
            }
            // Calculate the total price for the quantity
            const price = product.price * quantity;

            // Check if the product already exists in the cart
            const existingCartItem = await CartProduct.findOne({
                where: { cartId, productId },
                transaction: t
            });

            if (existingCartItem) {
                // If the product already exists in the cart, update the quantity and total price
                await existingCartItem.update({ quantity, price }, { transaction: t });
            } else {
                // If the product does not exist in the cart, add it
                await CartProduct.create({ cartId, productId, quantity, price }, { transaction: t });
            }
            // Sum all the prices in CartProduct with the same cartId
            const totalPriceInCart = await CartProduct.sum('price', { where: { cartId }, transaction: t });
            // Update the totalPrice and nettPrice of the cart
            const totalPrice = totalPriceInCart;
            const nettPrice = totalPriceInCart - cart.shippingCost - cart.totalDiscount;
            await cart.update({ totalPrice, nettPrice }, { transaction: t });

            // Get the userId from the cart
            const userId = cart.userId;
            const order = await Order.findOne({ where: { userId }, transaction: t });

            // If user is first order
            if (!order) {
                const totalAffiliate = nettPrice / 2;
                const updatedNettPrice = nettPrice - totalAffiliate;
                await cart.update({ totalAffiliate, nettPrice: updatedNettPrice }, { transaction: t });
            }

            // Commit the transaction
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Product added/updated to cart', totalPrice, nettPrice });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async addPromoToCart(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { promoId } = req.body;
            const cartId = req.params.cartId;
            // Find the promo by ID
            const promo = await Promo.findByPk(promoId, { transaction: t });
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }
            // Check if the promo is active
            if (promo.isActive !== true) {
                return res.status(400).json({ status: 'failed', code: 400, message: 'Promo is not active' });
            }
            if (promo.isGlobal === true) {
                // If the promo is global, directly insert promoId to the cart
                const cart = await Cart.findByPk(cartId, { transaction: t });
                if (!cart) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
                }
                if (cart.totalDiscount === 0) {
                    // Calculate the total discount based on the promo percentage
                    const nettPrice = cart.nettPrice;
                    const percentage = promo.percentage;
                    const totalDiscount = nettPrice * (percentage / 100);
                    const updatedNettPrice = nettPrice - totalDiscount;

                    // Update the promo quota if the promo is successfully applied
                    await promo.update({ quota: promo.quota - 1 }, { transaction: t });
                    // Update the cart with promo details
                    await cart.update({ promoId, totalDiscount, nettPrice: updatedNettPrice }, { transaction: t });
                }
            } else {
                const cartProducts = await CartProduct.findAll({ where: { cartId }, transaction: t });
                const productIds = cartProducts.map(cartProduct => cartProduct.productId);

                // Find all PromoProducts for the given promoId
                const promoProducts = await PromoProduct.findAll({ where: { promoId }, transaction: t });
                const promoProductIds = promoProducts.map(promoProduct => promoProduct.productId);

                // Check if all productIds in cartProducts are present in promoProductIds
                const allProductsEligible = productIds.every(productId => promoProductIds.includes(productId));

                if (!allProductsEligible) {
                    return res.status(400).json({ status: 'failed', code: 400, message: 'Cart products are not eligible for the promo' });
                }

                // If all products in the cart are eligible, update the cart with the promoId
                const cart = await Cart.findByPk(cartId, { transaction: t });

                if (!cart) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
                }

                if (cart.totalDiscount === 0) {
                    // Calculate the total discount based on the promo percentage
                    const nettPrice = cart.nettPrice;
                    const percentage = promo.percentage;
                    const totalDiscount = nettPrice * (percentage / 100);
                    const updatedNettPrice = nettPrice - totalDiscount;

                    // Update the promo quota if the promo is successfully applied
                    await promo.update({ quota: promo.quota - 1 }, { transaction: t });
                    // Update the cart with promo details
                    await cart.update({ promoId, totalDiscount, nettPrice: updatedNettPrice }, { transaction: t });
                }
            }

            // Commit the transaction
            await t.commit();
            res.status(200).json({ status: 'success', code: 200, message: 'Promo added to cart' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
            res.status(500).json({ status: 'error', code: 500, message: 'Internal server error' });
        }
    }

    static async changeProductQuantity(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const cartProductId = req.params.productId;
            const cartId = req.params.cartId;
            const { quantity } = req.body;
            // Find the cart product by ID and cart ID
            const cartProduct = await CartProduct.findOne({
                where: { productId: cartProductId, cartId: cartId },
                transaction: t
            });
            if (!cartProduct) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart product not found' });
            }
            // Update the quantity of the cart product within the transaction
            await cartProduct.update({ quantity }, { transaction: t });
            // Commit the transaction if the update is successful
            await t.commit();
            res.status(200).json({ status: 'success', code: 200, message: 'Cart product quantity updated' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async removeProductFromCart(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const cartProductId = req.params.productId;
            const cartId = req.params.cartId;
            // Find the cart by ID
            const cart = await Cart.findByPk(cartId, { transaction: t });
            // Find the cart product by ID and cart ID within the transaction
            const cartProductCondition = await CartProduct.findOne({
                where: { productId: cartProductId, cartId: cartId },
                transaction: t
            });
            if (!cartProductCondition) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart product not found' });
            }
            // Sum all the prices in CartProduct with the same cartId
            const totalPriceInCart = await CartProduct.sum('price', { where: { productId: cartProductId }, transaction: t });

            // Update the totalPrice and nettPrice of the cart
            const totalPrice = cart.totalPrice - totalPriceInCart;
            const totalAffiliate = totalPrice / 2;
            const nettPrice = totalPrice - totalAffiliate

            await cart.update({ nettPrice, totalAffiliate, totalPrice }, { transaction: t });
            // Delete the cart product within the transaction
            await cartProductCondition.destroy({ transaction: t });
            // Commit the transaction if the deletion is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Product removed from cart' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }
    static async removeAllProductsFromCart(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const cartId = req.params.cartId;

            // Find the cart by ID
            const cart = await Cart.findByPk(cartId, { transaction: t });

            // Find all cart products associated with the cart ID
            const cartProducts = await CartProduct.findAll({
                where: { cartId: cartId },
                transaction: t
            });

            if (!cartProducts || cartProducts.length === 0) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'No products found in the cart' });
            }

            // Sum all the prices in CartProduct with the same cartId
            const totalPriceInCart = await CartProduct.sum('price', { where: { cartId: cartId }, transaction: t });

            // Update the totalPrice, totalAffiliate, and nettPrice of the cart
            const totalPrice = cart.totalPrice - totalPriceInCart;
            const totalAffiliate = totalPrice / 2;
            const nettPrice = totalPrice - totalAffiliate;

            await cart.update({ nettPrice, totalAffiliate, totalPrice }, { transaction: t });

            // Delete all cart products associated with the cart ID within the transaction
            await CartProduct.destroy({ where: { cartId: cartId }, transaction: t });

            // Commit the transaction if the deletion is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'All products removed from cart' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }



}

module.exports = CartController;
