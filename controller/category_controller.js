const { Category, Product } = require('../models');
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});

class CategoryController {
    static async addCategory(req, res, next) {
        try {
            const { name } = req.body;

            // Create the category
            const newCategory = await Category.create({ name });

            res.status(201).json({ status: 'success', code: 201, data: newCategory, message: 'Category added successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getAllCategories(req, res, next) {
        try {
            // Get all categories
            const categories = await Category.findAll({
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt']
                }]
            });

            res.status(200).json({ status: 'success', code: 200, data: categories, message: 'Categories retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        const t = await sequelize.transaction();

        try {
            const categoryId = req.params.id;

            // Find the category by ID within the transaction
            const category = await Category.findByPk(categoryId, { transaction: t });
            if (!category) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Category not found' });
            }

            // Delete the category within the transaction
            await category.destroy({ transaction: t });

            // Commit the transaction if the deletion is successful
            await t.commit();

            res.status(200).json({ status: 'success', code: 200, message: 'Category deleted successfully' });
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            next(error);
        }
    }

}

module.exports = CategoryController;
