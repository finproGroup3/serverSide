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
    await queryInterface.bulkInsert("Orders", [
      {
        userId: 2,
        promoId: 3,
        totalDiscount: 10000,
        totalPrice: 40000,
        nettPrice: 30000,
        paymentBill: "tunai.png",
        invoiceUrl: "invoice.pdf",
        shippingCost: 5000,
        shippingMethod: "reg",
        courier: "jne",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        promoId: 3,
        totalDiscount: 10000,
        totalAffiliate: 10,
        totalPrice: 40000,
        nettPrice: 30000,
        paymentBill: "tunai.png",
        invoiceUrl: "invoice.pdf",
        shippingCost: 5000,
        shippingMethod: "reg",
        courier: "jne",
        status: "accept",
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
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
