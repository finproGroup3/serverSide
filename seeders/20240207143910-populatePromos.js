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
    await queryInterface.bulkInsert("Promos", [
      {
        code: "REGE1039",
        percentage: 11,
        quota: 1000,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "TER3928",
        percentage: 11,
        quota: 1000,
        isActive: true,
        isGlobal: false,
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
    await queryInterface.bulkDelete("Promos", null, {});
  },
};
