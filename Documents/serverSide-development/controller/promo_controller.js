const { Promo, PromoProduct, Product, ProductGallery } = require('../models');
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});

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
        const t = await sequelize.transaction();

        try {
            const { code, percentage, quota, isActive, isGlobal, description, productIds } = req.body;

            // Create the promo within the transaction
            const newPromo = await Promo.create({
                code,
                percentage,
                quota,
                isActive,
                isGlobal,
                description
            }, { transaction: t });

            // Create associations with products within the transaction
            if (productIds && productIds.length > 0) {
                const promoProducts = productIds.map(productId => ({ productId, promoId: newPromo.id }));
                await PromoProduct.bulkCreate(promoProducts, { transaction: t });
            }

            // Commit the transaction if promo creation is successful
            await t.commit();

            res.status(201).json({ status: 'success', code: 201, data: newPromo, message: 'Promo added successfully' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async editPromo(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const promoId = req.params.id;
            const { code, percentage, quota, isActive, isGlobal, description, productIds } = req.body;
            const promo = await Promo.findByPk(promoId, { transaction: t });
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }

            // Update the promo details within the transaction
            await promo.update({ code, percentage, quota, isActive, isGlobal, description }, { transaction: t });

            // Delete all existing promo product associations within the transaction
            await PromoProduct.destroy({ where: { promoId }, transaction: t });

            // Create associations with products within the transaction
            if (productIds && productIds.length > 0) {
                const promoProducts = productIds.map(productId => ({ productId, promoId: promo.id }));
                await PromoProduct.bulkCreate(promoProducts, { transaction: t });
            }

            // Commit the transaction if promo update is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, data: promo, message: 'Promo updated successfully' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }


    static async activatePromo(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const promoId = req.params.id;
            const promo = await Promo.findByPk(promoId, { transaction: t });
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }

            // Update the promo status to active within the transaction
            await promo.update({ isActive: true }, { transaction: t });

            // Commit the transaction if promo activation is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Promo activated successfully' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

    static async deactivatePromo(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const promoId = req.params.id;
            const promo = await Promo.findByPk(promoId, { transaction: t });
            if (!promo) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Promo not found' });
            }

            // Update the promo status to inactive within the transaction
            await promo.update({ isActive: false }, { transaction: t });

            // Commit the transaction if promo deactivation is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Promo deactivated successfully' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

}

module.exports = PromoController;
