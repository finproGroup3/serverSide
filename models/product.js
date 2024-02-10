'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Product.belongsToMany(models.Promo, { through: models.PromoProduct, foreignKey: 'productId' });
      Product.hasMany(models.ProductGallery, { foreignKey: 'productId' });
      Product.belongsToMany(models.Cart, { through: models.CartProduct, foreignKey: 'productId' });
    }
  }
  Product.init({
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};