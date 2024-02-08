'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      promoId: {
        type: Sequelize.INTEGER,
        references:{
          model: "Promos",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      totalDiscount: {
        type: Sequelize.INTEGER
      },
      totalAffiliate: {
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.INTEGER
      },
      nettPrice: {
        type: Sequelize.INTEGER
      },
      paymentBill: {
        type: Sequelize.STRING
      },
      invoiceUrl: {
        type: Sequelize.STRING
      },
      shippingCost: {
        type: Sequelize.INTEGER
      },
      shippingMethod: {
        type: Sequelize.STRING
      },
      courier: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('Orders');
  }
};