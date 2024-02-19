'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReferralCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReferralCode.hasMany(models.User, {foreignKey: 'privateReferralCodeId'})
      ReferralCode.hasMany(models.User, {foreignKey: 'reedemedReferralCodeId'})
    }
  }
  ReferralCode.init({
    code: DataTypes.STRING,
    percentage: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ReferralCode',
  });
  return ReferralCode;
};