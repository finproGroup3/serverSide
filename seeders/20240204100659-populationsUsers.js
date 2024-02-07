<<<<<<< HEAD
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
=======
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
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin1@gmail.com",
        password: "admin1",
        username: "admin1",
        cityId: 1, 
        provinceId: 1, 
        address: "cilejet",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin2@gmail.com",
        password: "admin2",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "cilejet",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
<<<<<<< HEAD
    ], {});
  },

  async down(queryInterface, Sequelize) {
=======
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
    await queryInterface.bulkDelete("Users", null, {});
  },
};
