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
    await queryInterface.bulkInsert("PromoProducts", [
      {
        productId: 1,
        promoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        promoId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        promoId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4,
        promoId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 5,
        promoId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 6,
        promoId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 7,
        promoId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 8,
        promoId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 9,
        promoId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 10,
        promoId: 10,
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
    await queryInterface.bulkDelete("PromoProducts", null, {});
  },
};
