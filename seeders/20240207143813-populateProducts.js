"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Products", [
      {
        sku: "PRO-MR-AHT",
        name: "headset ryzen",
        price: 200000,
        weight: 10,
        stock: 10,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "DRO-MR-AHT",
        name: "kemeja zara",
        price: 200000,
        weight: 10,
        stock: 10,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Products", null, {});
  },
};
