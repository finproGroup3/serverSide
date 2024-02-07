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
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    cityId: DataTypes.INTEGER,
    provinceId: DataTypes.INTEGER,
    address: DataTypes.STRING,
<<<<<<< HEAD
    role: DataTypes.STRING,
    privateReferralCodeId: DataTypes.INTEGER,
    reedemedReferralCodeId: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING
=======
    role: DataTypes.STRING
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};