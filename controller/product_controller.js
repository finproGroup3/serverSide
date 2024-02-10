const { Product, Category, ProductGallery } = require('../models');
const multer = require('multer');
const path = require('path');

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
                return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
            }
            res.status(200).json({ status: 'success', code: 200, data: product, message: 'Product retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }


    static async addProduct(req, res, next) {
        try {
            upload(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({ status: 'failed', code: 400, message: err.message });
                }

                const { sku, name, price, weight, stock, categoryId } = req.body;

                // Create the product
                const newProduct = await Product.create({
                    sku,
                    name,
                    price,
                    weight,
                    stock,
                    categoryId
                });

                // Create an array to store the promises for creating product galleries
                const productGalleries = [];

                // Loop through each file and create a product gallery
                req.files.forEach((file) => {
                    const imageUrl = file.filename;
                    // Create the product gallery and push the promise to the array
                    productGalleries.push(ProductGallery.create({
                        productId: newProduct.id,
                        imageUrl
                    }));
                });

                // Wait for all product galleries to be created
                await Promise.all(productGalleries);

                // Respond with success
                res.status(201).json({ status: 'success', code: 201, data: newProduct, message: 'Product added successfully' });
            });
        } catch (error) {
            next(error);
        }
    }

    static async editProduct(req, res, next) {
        try {
            upload(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({ status: 'failed', code: 400, message: err.message });
                }
                const productId = req.params.id;
                const { sku, name, price, weight, stock, categoryId } = req.body;
                const product = await Product.findByPk(productId, { include: ProductGallery });
                if (!product) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
                }
                // Update the product details
                await product.update({
                    sku,
                    name,
                    price,
                    weight,
                    stock,
                    categoryId
                });

                // Delete all existing product galleries associated with the product
                await ProductGallery.destroy({ where: { productId } });
                // Create an array to store the promises for creating product galleries
                const productGalleries = [];

                // Loop through each file and create a product gallery
                req.files.forEach((file) => {
                    const imageUrl = file.filename;
                    // Create the product gallery and push the promise to the array
                    productGalleries.push(ProductGallery.create({
                        productId: product.id, // Corrected from newProduct.id
                        imageUrl
                    }));
                });

                // Wait for all product galleries to be created
                await Promise.all(productGalleries);

                // Fetch the updated product with associated galleries
                const updatedProduct = await Product.findByPk(productId, { include: ProductGallery });

                res.status(200).json({ status: 'success', code: 200, data: updatedProduct, message: 'Product updated successfully' });
            });
        } catch (error) {
            next(error);
        }
    }




    static async deleteProduct(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Product not found' });
            }
            await product.destroy();
            res.status(200).json({ status: 'success', code: 200, message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
