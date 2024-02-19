'use strict';

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
    await queryInterface.bulkInsert("Carts", [
      {
        userId: 1,
        promoId: 1,
        shippingCost: 30000,
        totalDiscount: 100000,
        totalAffiliate: 10000,
        totalPrice: 20000,
        nettPrice: 30000,
        shippingMethod: "reg",
        courier: "jne",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        promoId: 2,
        shippingCost: 30000,
        totalDiscount: 100000,
        totalAffiliate: 10000,
        totalPrice: 20000,
        nettPrice: 30000,
        shippingMethod: "reg",
        courier: "jne",
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
    await queryInterface.bulkDelete('Carts', null, {});
  }
};
