'use strict';
<<<<<<< HEAD

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admins', {
=======
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
<<<<<<< HEAD
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
=======
      password: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
<<<<<<< HEAD
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admins');
=======
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Admins');
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
  }
};