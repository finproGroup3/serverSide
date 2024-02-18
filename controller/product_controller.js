const { Product, Category, ProductGallery } = require('../models');
const multer = require('multer');
const path = require('path');
const { Sequelize, Op } = require('sequelize');


// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/productImage'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
}).array('images', 4); // Accept up to 4 files with the field name 'images'

class ProductController {
    static async getAll(req, res, next) {
        try {
            const products = await Product.findAll({
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: ProductGallery, attributes: ['id', 'imageUrl'] } // Remove where clause
                ],
                attributes: { exclude: ['categoryId'] }
            });
            res.status(200).json({ status: 'success', code: 200, data: products, message: 'Products retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await Product.findByPk(productId, {
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: ProductGallery, attributes: ['id', 'imageUrl'] } // Remove where clause
                ],
                attributes: { exclude: ['categoryId'] }
            });
            if (!product) {
                throw { name: 'not_found', message: "product not found" }
            }
            res.status(200).json({ status: 'success', code: 200, data: product, message: 'Product retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }


    static async addProduct(req, res, next) {
        const t = await sequelize.transaction();

        try {
            upload(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({ status: 'failed', code: 400, message: err.message });
                }

                const { sku, name, price, weight, stock, categoryId } = req.body;

                // Create the product within the transaction
                const newProduct = await Product.create({
                    sku,
                    name,
                    price,
                    weight,
                    stock,
                    categoryId
                }, { transaction: t });

                // Create an array to store the promises for creating product galleries
                const productGalleries = [];

                // Loop through each file and create a product gallery within the transaction
                req.files.forEach((file) => {
                    const imageUrl = file.filename;
                    // Create the product gallery and push the promise to the array
                    productGalleries.push(ProductGallery.create({
                        productId: newProduct.id,
                        imageUrl
                    }, { transaction: t }));
                });

                // Wait for all product galleries to be created
                await Promise.all(productGalleries);

                // Commit the transaction if everything is successful
                await t.commit();

                // Respond with success
                res.status(201).json({ status: 'success', code: 201, data: newProduct, message: 'Product added successfully' });
            });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async editProduct(req, res, next) {
        const t = await sequelize.transaction();
        try {
            upload(req, res, async function (err) {
                if (err) {
                    throw { name: 'not_found', message: "Failed to upload image" };
                }
                const productId = req.params.id;
                const { sku, name, price, weight, stock, categoryId, destroyGallery } = req.body;
                const product = await Product.findByPk(productId, { include: ProductGallery });
                if (!product) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
                }
                // Update the product details within the transaction
                await product.update({
                    sku,
                    name,
                    price,
                    weight,
                    stock,
                    categoryId
                }, { transaction: t });
                if (destroyGallery) {
                    // Parse destroyGallery into an array if it's not already
                    const galleryIds = Array.isArray(destroyGallery) ? destroyGallery : JSON.parse(destroyGallery);
                    // Delete product galleries if specified
                    if (galleryIds && galleryIds.length > 0) {
                        // Convert array of IDs to integers
                        const parsedGalleryIds = galleryIds.map(id => parseInt(id));
                        // Delete galleries
                        await ProductGallery.destroy({
                            where: {
                                id: {
                                    [Op.in]: parsedGalleryIds
                                }
                            },
                            transaction: t
                        });
                    }
                }

                // Create an array to store the promises for creating product galleries
                const productGalleries = [];
                if (req.files.length > 0) {
                    // Create an array to store the promises for creating product galleries
                    const productGalleries = [];
                    // Loop through each file and create a product gallery
                    req.files.forEach((file) => {
                        const imageUrl = file.filename;
                        // Create the product gallery and push the promise to the array
                        productGalleries.push(ProductGallery.create({
                            productId: product.id,
                            imageUrl
                        }, { transaction: t }));
                    });

                    // Wait for all product galleries to be created
                    await Promise.all(productGalleries);

                    // Fetch the updated product with associated galleries
                    const updatedProduct = await Product.findByPk(productId, { include: ProductGallery });
                    res.status(200).json({ status: 'success', code: 200, data: updatedProduct, message: 'Product updated successfully' });
                }
                // Commit the transaction if everything is successful
                await t.commit();
                res.status(200).json({ status: 'success', code: 200, message: 'Product updated successfully' });
            });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async deleteProduct(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const productId = req.params.id;
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
            }

            // Delete the product within the transaction
            await product.destroy({ transaction: t });

            // Commit the transaction if deletion is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Product deleted successfully' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

}

module.exports = ProductController;
