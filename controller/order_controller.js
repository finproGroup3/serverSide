const { Order, OrderProduct, Cart, CartProduct } = require('../models');

class OrderController {
    static async addOrder(req, res, next) {
        try {
            const { userId, cartId } = req.body;

            // Find the cart by ID
            const cart = await Cart.findByPk(cartId, {
                include: [{ model: CartProduct }]
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

            // Create the order
            const order = await Order.create({ userId, promoId, totalDiscount, totalAffiliate, totalPrice, nettPrice, shippingCost, shippingMethod, courier, status: 'pending' });

            // Add products to the order
            if (products && products.length > 0) {
                await Promise.all(products.map(async (product) => {
                    await OrderProduct.create({ orderId: order.id, ...product });
                }));
            }

            res.status(201).json({ status: 'success', code: 201, message: 'Order created successfully', order });
        } catch (error) {
            next(error);
        }
    }



    static async addPaymentBill(req, res, next) {
        try {
            const { orderId, paymentBill } = req.body;

            // Find the order
            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order not found' });
            }

            // Update paymentBill
            await order.update({ paymentBill });

            res.status(200).json({ status: 'success', code: 200, message: 'Payment bill added successfully', order });
        } catch (error) {
            next(error);
        }
    }

    static async addInvoiceUrl(req, res, next) {
        try {
            const { orderId, invoiceUrl } = req.body;

            // Find the order
            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order not found' });
            }

            // Update invoiceUrl
            await order.update({ invoiceUrl });

            res.status(200).json({ status: 'success', code: 200, message: 'Invoice URL added successfully', order });
        } catch (error) {
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

    static async updateProductStatus(req, res, next) {
        try {
            const orderId = req.params.orderId;
            const productId = req.params.productId;
            const { status } = req.body;

            // Find the order product
            const orderProduct = await OrderProduct.findOne({ where: { orderId, productId } });
            if (!orderProduct) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order product not found' });
            }

            // Update the status
            await orderProduct.update({ status });

            res.status(200).json({ status: 'success', code: 200, message: 'Product status updated successfully', orderProduct });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
