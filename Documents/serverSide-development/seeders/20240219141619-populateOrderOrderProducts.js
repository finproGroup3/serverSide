'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('OrderOrderProduct', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orderProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderProducts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    // Add unique constraint to prevent duplicates
    await queryInterface.addConstraint('OrderOrderProduct', {
      type: 'unique',
      fields: ['orderId', 'orderProductId'],
      name: 'unique_order_order_product'
    });

    // Insert data into OrderOrderProduct table
    await queryInterface.bulkInsert("OrderOrderProduct", [
      {
        orderId: 1, 
        orderProductId: 1, 
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 2, 
        orderProductId: 2, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 3, 
        orderProductId: 3, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 4, 
        orderProductId: 4, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 5, 
        orderProductId: 6, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 6, 
        orderProductId: 6, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 7, 
        orderProductId: 7,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 8, 
        orderProductId: 8, 
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 9,
        orderProductId: 9, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 10, 
        orderProductId: 10, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 11, 
        orderProductId: 11, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 12, 
        orderProductId: 12, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 13, 
        orderProductId: 13, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 14, 
        orderProductId: 14, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 15, 
        orderProductId: 15,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 16, 
        orderProductId: 16, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 17, 
        orderProductId: 17, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 18, 
        orderProductId: 18, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 19, 
        orderProductId: 19, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 20, 
        orderProductId: 20, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 21, 
        orderProductId: 21, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 22, 
        orderProductId: 22, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 23, 
        orderProductId: 23, 
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 24, 
        orderProductId: 24, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 25, 
        orderProductId: 25, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 26, 
        orderProductId: 26, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 27, 
        orderProductId: 27, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 28, 
        orderProductId: 28, 
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 29, 
        orderProductId: 29, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 30,
        orderProductId: 30,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 31, 
        orderProductId: 31, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 32, 
        orderProductId: 32, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 33, 
        orderProductId: 33, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 34, 
        orderProductId: 34,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 35, 
        orderProductId: 35,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 36,
        orderProductId: 36, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 37,
        orderProductId: 37,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 38,
        orderProductId: 38,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 39,
        orderProductId: 39,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 40, 
        orderProductId: 40, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 41, 
        orderProductId: 41, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 42,
        orderProductId: 42, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 43, 
        orderProductId: 43,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 44, 
        orderProductId: 44, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 45, 
        orderProductId: 45,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 46,
        orderProductId: 46,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 47, 
        orderProductId: 47, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 48, 
        orderProductId: 48, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 49, 
        orderProductId: 49, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 50, 
        orderProductId: 50, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 51, 
        orderProductId: 51,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 52, 
        orderProductId: 52, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 53, 
        orderProductId: 53,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 54, 
        orderProductId: 54, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 55, 
        orderProductId: 55,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 56,
        orderProductId: 56,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 57,
        orderProductId: 57, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 58, 
        orderProductId: 58,
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 59, 
        orderProductId: 59, 
        quantity: 100, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },

  async down(queryInterface, Sequelize) {
    // Remove unique constraint
    await queryInterface.removeConstraint('OrderOrderProduct', 'unique_order_order_product');
    
    // Drop OrderOrderProduct table
    await queryInterface.dropTable('OrderOrderProduct');
  }
};
