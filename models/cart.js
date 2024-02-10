'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.belongsTo(models.Promo, { foreignKey: 'promoId' });
      Cart.belongsToMany(models.Product, { through: models.CartProduct, foreignKey: 'cartId' }); // Association for adding products to cart
      Cart.hasMany(models.CartProduct, { foreignKey: 'cartId' }); // Association for retrieving products in cart
    }
  }
  Cart.init({
    userId: DataTypes.INTEGER,
    promoId: DataTypes.INTEGER,
    shippingCost: DataTypes.INTEGER,
    totalDiscount: DataTypes.INTEGER,
    totalAffiliate: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    nettPrice: DataTypes.INTEGER,
    shippingMethod: DataTypes.STRING,
    courier: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};