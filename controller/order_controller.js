const { Order, OrderProduct, Cart, CartProduct, User, Product } = require('../models');
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});

class OrderController {
    static async addOrder(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const { userId, cartId } = req.body;

            // Find the cart by ID within the transaction
            const cart = await Cart.findByPk(cartId, {
                include: [{ model: CartProduct }],
                transaction: t
            });

            if (!cart) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Cart not found' });
            }

            // Extract relevant information from the cart
            const { promoId, totalDiscount, totalAffiliate, totalPrice, nettPrice, shippingCost, shippingMethod, courier } = cart;
            const products = cart.CartProducts.map(cartProduct => ({
                productId: cartProduct.productId,
                price: cartProduct.price,
                quantity: cartProduct.quantity
            }));

            // Create the order within the transaction
            const order = await Order.create({ userId, promoId, totalDiscount, totalAffiliate, totalPrice, nettPrice, shippingCost, shippingMethod, courier, status: 'pending' }, { transaction: t });

            // Add products to the order within the transaction
            if (products && products.length > 0) {
                await Promise.all(products.map(async (product) => {
                    await OrderProduct.create({ orderId: order.id, ...product }, { transaction: t });
                }));
            }

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(201).json({ status: 'success', code: 201, message: 'Order created successfully', order });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

    static async addPaymentBill(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const { orderId, paymentBill } = req.body;

            // Find the order within the transaction
            const order = await Order.findByPk(orderId, { transaction: t });
            if (!order) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order not found' });
            }

            // Update paymentBill within the transaction
            await order.update({ paymentBill }, { transaction: t });

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Payment bill added successfully', order });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async addInvoiceUrl(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const { orderId, invoiceUrl } = req.body;

            // Find the order within the transaction
            const order = await Order.findByPk(orderId, { transaction: t });
            if (!order) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order not found' });
            }

            // Update invoiceUrl within the transaction
            await order.update({ invoiceUrl }, { transaction: t });

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Invoice URL added successfully', order });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

    static async updateProductStatus(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const orderId = req.params.orderId;
            const productId = req.params.productId;
            const { status } = req.body;

            // Find the order product within the transaction
            const orderProduct = await OrderProduct.findOne({ where: { orderId, productId }, transaction: t });
            if (!orderProduct) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order product not found' });
            }

            // Update the status within the transaction
            await orderProduct.update({ status }, { transaction: t });

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Product status updated successfully', orderProduct });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

    static async getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll({ include: [OrderProduct] });
            res.status(200).json({ status: 'success', code: 200, data: orders, message: 'Orders retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getTopBuyers(req, res, next) {
        try {
            const topBuyers = await Order.findAll({
                attributes: [
                    'userId',
                    [sequelize.fn('SUM', sequelize.col('nettPrice')), 'totalNettPrice'],
                    [sequelize.literal('"User"."username"'), 'username'] // Include the username attribute
                ],
                include: [{
                    model: User,
                    attributes: [] // Exclude other attributes from the User model
                }],
                where: { status: 'success' }, // Check if order status is 'success'
                group: ['Order.userId', 'User.id', 'User.username'], // Adjust the GROUP BY clause
                order: [[sequelize.fn('SUM', sequelize.col('nettPrice')), 'DESC']],
                limit: 5
            });
            res.status(200).json({ status: 'success', code: 200, data: topBuyers, message: 'Top buyers retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getHighestSellingProducts(req, res, next) {
        try {
            const highestSellingProducts = await OrderProduct.findAll({
                attributes: [
                    'productId',
                    [sequelize.fn('SUM', sequelize.col('quantity')), 'TotalQuantitySold'] // Ensure the alias is properly defined
                ],
                include: [{
                    model: Order,
                    attributes: [],
                    where: { status: 'success' }
                }, {
                    model: Product,
                    attributes: ['id', 'name'], // Include the id attribute from the Product model
                }],
                group: ['OrderProduct.productId', 'Product.id'], // Adjust the GROUP BY clause
                order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
                limit: 5
            });
            // Manipulate the result to match the desired output format
            const formattedData = highestSellingProducts.map(item => ({
                productId: item.productId,
                TotalQuantitySold: item.dataValues.TotalQuantitySold, // Access TotalQuantitySold from dataValues
                ProductName: item.Product.name
            }));
            res.status(200).json({ status: 'success', code: 200, data: formattedData, message: 'Highest selling products retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }


    static async getOrdersByUserId(req, res, next) {
        try {
            const userId = req.params.userId;
            const orders = await Order.findAll({ where: { userId } });
            res.status(200).json({ status: 'success', code: 200, data: orders, message: 'Orders retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
