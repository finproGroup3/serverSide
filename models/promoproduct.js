'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromoProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PromoProduct.belongsTo(models.Product, {foreignKey: 'productId'})
      PromoProduct.belongsTo(models.Promo, {foreignKey: 'promoId'})
    }
  }
  PromoProduct.init({
    productId: DataTypes.INTEGER,
    promoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PromoProduct',
  });
  return PromoProduct;
};