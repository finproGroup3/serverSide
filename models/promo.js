'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promo.belongsToMany(models.Product, {foreignKey: 'promoId', through: models.PromoProduct})
    }
  }
  Promo.init({
    code: DataTypes.STRING,
    percentage: DataTypes.INTEGER,
    quota: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    isGlobal: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Promo',
  });
  return Promo;
};