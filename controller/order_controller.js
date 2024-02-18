const { Order, OrderProduct, Cart, CartProduct, User, Product, Promo } = require('../models');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads/paymentBills'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
}).single('paymentBill');

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
            upload(req, res, async function (err) {
                if (err) {
                    throw { name: 'not_found', message: "Failed to upload payment bill" };
                }

                const orderId = req.params.orderId;
                const paymentBill = req.file.filename; // Get the file name of the uploaded payment bill

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
            });
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
            const { status } = req.body;

            // Find the order within the transaction
            const order = await Order.findByPk(orderId, {
                include: [
                    {
                        model: OrderProduct,
                        include: [Product] // Optionally include other associated models if needed
                    },
                    {
                        model: User, // Include the User model to retrieve user information
                        attributes: ['username'] // Specify the attributes to include
                    }
                ],
                transaction: t
            });
            if (!order) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Order not found' });
            }

            // Update the status within the transaction
            await order.update({ status }, { transaction: t });

            // Check if the status is 'succeed' and generate PDF and update URL
            if (status === 'succeed') {
                // Generate PDF
                const doc = new PDFDocument();
                const pdfPath = path.join(__dirname, '..', 'uploads', 'invoices', `invoice_${orderId}.pdf`);
                doc.pipe(fs.createWriteStream(pdfPath));

                // Title
                doc.fontSize(20).text('Invoice Order', { align: 'center' }).moveDown();

                // Table header
                const tableHeader = ['No', 'Product Name', 'Product SKU', 'Price', 'Weight', 'Quantity'];
                // Initialize the row counter
                let rowNum = 1;
                // Map order products to table rows
                const tableRows = order.OrderProducts.map(orderProduct => {
                    const product = orderProduct.Product;
                    const row = [rowNum++, product.name, product.sku, product.price, `${product.weight}g`, orderProduct.quantity];
                    return row;
                });

                // Create table data
                const tableData = {
                    headers: tableHeader,
                    rows: tableRows
                };

                // Create and draw the table
                await doc.table(tableData, { width: 500 });
                doc.text(``).moveDown();
                doc.text(``).moveDown();
                // Additional details
                doc.fontSize(10).text(`Total Discount: Rp ${order.totalDiscount.toLocaleString('id-ID')}`).moveDown();
                doc.text(`Total Affiliate: Rp ${order.totalAffiliate.toLocaleString('id-ID')}`).moveDown();
                doc.text(`Nett Price: Rp ${order.nettPrice.toLocaleString('id-ID')}`).moveDown();
                doc.text(`Shipping Cost: Rp ${order.shippingCost.toLocaleString('id-ID')}`).moveDown();
                doc.text(``).moveDown();
                // Total price with bigger font
                doc.fontSize(14).text(`Total Price: Rp ${order.totalPrice.toLocaleString('id-ID')}`, { align: 'center', margin: 20 }).moveDown();

                // Update invoiceUrl after PDF generation
                await order.update({ invoiceUrl: `invoice_${orderId}.pdf` }, { transaction: t });

                doc.end(); // End the PDF document

            }

            // Commit the transaction if everything is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Product status updated successfully', order });
        } catch (error) {
            // Rollback the transaction in case of error
            if (t.finished !== 'commit') { // Check if the transaction hasn't been committed yet
                await t.rollback();
            }
            next(error);
        }
    }



    static async getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                include: [
                    User,
                    Promo
                ]
            });
            res.status(200).json({ status: 'success', code: 200, data: orders, message: 'Orders retrieved successfully' });
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
                where: { status: 'succeed' }, // Check if order status is 'success'
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
                    where: { status: 'succeed' }
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
}

module.exports = OrderController;
