'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {foreignKey: 'userId'})
      Order.belongsTo(models.Promo, {foreignKey: 'promoId'})
      Order.belongsToMany(models.Product, {foreignKey: 'productId', through: models.OrderProduct})
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    promoId: DataTypes.INTEGER,
    totalDiscount: DataTypes.INTEGER,
    totalAffiliate: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    nettPrice: DataTypes.INTEGER,
    paymentBill: DataTypes.STRING,
    invoiceUrl: DataTypes.STRING,
    shippingCost: DataTypes.INTEGER,
    shippingMethod: DataTypes.STRING,
    courier: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};