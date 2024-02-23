'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.belongsTo(models.City, { foreignKey: 'cityId' });
      Store.belongsTo(models.Province, { foreignKey: 'provinceId' });
    }
  }
  Store.init({
    bankAccount: DataTypes.STRING,
    bankName: DataTypes.STRING,
    cityId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};