'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      promoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Promos",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      shippingCost: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalDiscount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalAffiliate: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      nettPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      shippingMethod: {
        type: Sequelize.STRING
      },
      courier: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};