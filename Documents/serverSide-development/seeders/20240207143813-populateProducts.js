"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Tambahkan perintah seed di sini.
     *
     * Contoh:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Products", [
      {
        sku: "QLO-MR-ART",
        name: "ayunan bayi automatic",
        price: 800000,
        weight: 10,
        stock: 10,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        sku: "TRO-MR-TUT",
        name: "pemanas botol susu bayi",
        price: 700000,
        weight: 10,
        stock: 10,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        sku: "FRO-MR-ERT",
        name: "kaos dalam bayi",
        price: 50000,
        weight: 10,
        stock: 10,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "BDO-FR-ADG",
        name: "celana bayi",
        price: 100000,
        weight: 10,
        stock: 10,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "WRO-YR-AIT",
        name: "kaos bayi",
        price: 100000,
        weight: 10,
        stock: 10,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "RRO-JR-AKT",
        name: "bubur bayi",
        price: 50000,
        weight: 10,
        stock: 10,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "HRO-OR-AIT",
        name: "biskuit bayi",
        price: 30000,
        weight: 10,
        stock: 10,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "FRO-KR-ALT",
        name: "susu bayi",
        price: 100000,
        weight: 10,
        stock: 10,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "NRO-MQ-AWT",
        name: "boneka gantung",
        price: 100000,
        weight: 10,
        stock: 10,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "GRO-BR-AMT",
        name: "bola jaring",
        price: 50000,
        weight: 10,
        stock: 10,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "TRO-AR-SHT",
        name: "pemutar musik bayi",
        price: 200000,
        weight: 10,
        stock: 10,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "URO-ER-ADT",
        name: "bedak bayi",
        price: 50000,
        weight: 10,
        stock: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "ARO-ME-AHT",
        name: "lotion bayi",
        price: 20000,
        weight: 10,
        stock: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        sku: "PRO-ME-ADT",
        name: "minyak telon bayi",
        price: 20000,
        weight: 10,
        stock: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "DRO-MR-AHT",
        name: "kasur bayi",
        price: 200000,
        weight: 10,
        stock: 10,
        categoryId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "PRO-MR-IND",
        name: "selimut bayi",
        price: 200000,
        weight: 100,
        stock: 100,
        categoryId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "TOY-MR-AVT",
        name: "bantai bayi",
        price: 150000,
        weight: 10,
        stock: 10,
        categoryId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "PER-LX-STK",
        name: "sampo bayi",
        price: 50000,
        weight: 10,
        stock: 10,
        categoryId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "BED-LX-QNS",
        name: "sabun bayi",
        price: 30000,
        weight: 10,
        stock: 10,
        categoryId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "BTH-LX-SFT",
        name: "Handuk Lembut bayi",
        price: 75000,
        weight: 10,
        stock: 10,
        categoryId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Tambahkan perintah untuk menghapus seed di sini.
     *
     * Contoh:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Products", null, {});
  },
};
