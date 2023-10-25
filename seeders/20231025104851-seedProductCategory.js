'use strict';

/** @type {import('sequelize-cli').Migration} */
const fs = require('fs')
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync('./data/ProductCategory.json', 'utf8')).map(el => {
      delete el.id,
      el.createdAt = new Date(),
      el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('ProductCategories', data, {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
