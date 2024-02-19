'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Categories", [
      {
        name: "electronic",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // done
      {
        name: "pakaian",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // done
      {
        name: "makanan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // done
      {
        name: "mainan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // done
      {
        name: "perawatan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // done
      {
        name: "perlengkapan mandi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //done
      {
        name: "peralatan tidur",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
