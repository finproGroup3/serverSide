const { Promo, PromoProduct, Product, ProductGallery } = require('../models');

class PromoController {
    static async getAll(req, res, next) {
        try {
            const promos = await Promo.findAll({
                include: [{
                    model: Product,
                    attributes: ['id', 'sku', 'name', 'price', 'weight', 'stock', 'categoryId', 'createdAt', 'updatedAt'],
                    through: { attributes: [] }, // Exclude association data
                    include: [{
                        model: ProductGallery,
                        attributes: ['id', 'imageUrl', 'createdAt', 'updatedAt']
                    }]
                }]
            });
            // Remove PromoProduct from the nested Product objects
            promos.forEach(promo => {
                promo.Products.forEach(product => {
                    delete product.PromoProduct;
                });
            });
            res.status(200).json({ status: 'success', code: 200, data: promos, message: 'Promos retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const promoId = req.params.id;
            const promo = await Promo.findByPk(promoId, {
                include: [{
                    model: Product,
                    attributes: ['id', 'sku', 'name', 'price', 'weight', 'stock', 'categoryId', 'createdAt', 'updatedAt'],
                    through: { attributes: [] }, // Exclude association data
                    include: [{
                        model: ProductGallery,
                        attributes: ['id', 'imageUrl', 'createdAt', 'updatedAt']
                    }]
                }]
            });
            // Remove PromoProduct from the nested Product objects
            if (promo) {
                promo.Products.forEach(product => {
                    delete product.PromoProduct;
                });
            }
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }
            res.status(200).json({ status: 'success', code: 200, data: promo, message: 'Promo retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async addPromo(req, res, next) {
        try {
            const { code, percentage, quota, isActive, isGlobal, description, productIds } = req.body;

            // Create the promo
            const newPromo = await Promo.create({
                code,
                percentage,
                quota,
                isActive,
                isGlobal,
                description
            });

            // Create associations with products
            if (productIds && productIds.length > 0) {
                const promoProducts = productIds.map(productId => ({ productId, promoId: newPromo.id }));
                await PromoProduct.bulkCreate(promoProducts);
            }

            res.status(201).json({ status: 'success', code: 201, data: newPromo, message: 'Promo added successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async editPromo(req, res, next) {
        try {
            const promoId = req.params.id;
            const { code, percentage, quota, isActive, isGlobal, description, productIds } = req.body;
            const promo = await Promo.findByPk(promoId);
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }
            await promo.update({ code, percentage, quota, isActive, isGlobal, description });

            // Delete all existing promo product associated with the product
            await PromoProduct.destroy({ where: { promoId } });
            // Create associations with products
            if (productIds && productIds.length > 0) {
                const promoProducts = productIds.map(productId => ({ productId, promoId: promo.id }));
                await PromoProduct.bulkCreate(promoProducts);
            }
            res.status(200).json({ status: 'success', code: 200, data: promo, message: 'Promo updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async activatePromo(req, res, next) {
        try {
            const promoId = req.params.id;
            const promo = await Promo.findByPk(promoId);
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }
            await promo.update({ isActive: true });
            res.status(200).json({ status: 'success', code: 200, message: 'Promo activated successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async deactivatePromo(req, res, next) {
        try {
            const promoId = req.params.id;
            const promo = await Promo.findByPk(promoId);
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }
            await promo.update({ isActive: false });
            res.status(200).json({ status: 'success', code: 200, message: 'Promo deactivated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PromoController;
