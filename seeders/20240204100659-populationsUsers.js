'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
