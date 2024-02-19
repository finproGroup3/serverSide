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
      {
        code: "DISCOUNT50",
        percentage: 50,
        quota: 200,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "WEEKENDSALE",
        percentage: 20,
        quota: 100,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "DISCOUNT55",
        percentage: 50,
        quota: 200,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "WEEKENDSALE88",
        percentage: 20,
        quota: 100,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "DISCOUNT60",
        percentage: 50,
        quota: 200,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "WEEKENDSALE77",
        percentage: 20,
        quota: 100,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "DISCOUNT30",
        percentage: 50,
        quota: 200,
        isActive: true,
        isGlobal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "WEEKENDSALE12",
        percentage: 20,
        quota: 100,
        isActive: true,
        isGlobal: true,
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
