'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
<<<<<<< HEAD
  User.init({
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    privateReferralCodeId: DataTypes.INTEGER,
    reedemedReferralCodeId: DataTypes.INTEGER
=======
  Admin.init({
    password: DataTypes.STRING,
    username: DataTypes.STRING
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};