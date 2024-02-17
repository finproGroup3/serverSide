'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.ReferralCode, {foreignKey: 'privateReferralCodeId'})
      User.belongsTo(models.ReferralCode, {foreignKey: 'reedemedReferralCodeId'})
      User.hasOne(models.Cart, {foreignKey: 'userId'})
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    cityId: DataTypes.INTEGER,
    provinceId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    role: DataTypes.STRING,
    privateReferralCodeId: DataTypes.INTEGER,
    reedemedReferralCodeId: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};