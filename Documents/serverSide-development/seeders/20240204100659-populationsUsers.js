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
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin1@gmail.com",
        password: "admin1",
        username: "admin1",
        cityId: 1, 
        provinceId: 1, 
        address: "bali",
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
        address: "ntt",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin3@gmail.com",
        password: "admin3",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "ambon",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin4@gmail.com",
        password: "admin4",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "maluku",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin5@gmail.com",
        password: "admin5",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "jambi",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin6@gmail.com",
        password: "admin6",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "tangerang",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin7@gmail.com",
        password: "admin7",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "bogor",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin8@gmail.com",
        password: "admin8",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "jakarta",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin9@gmail.com",
        password: "admin9",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "medan",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin10@gmail.com",
        password: "admin10",
        username: "admin2",
        cityId: 1, 
        provinceId: 1, 
        address: "kalimantan",
        role: "user",
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
    await queryInterface.bulkDelete("Users", null, {});
  },
};
