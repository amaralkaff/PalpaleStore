'use strict';

/** @type {import('sequelize-cli').Migration} */
const fs = require('fs')
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = JSON.parse(fs.readFileSync('./data/user.json', 'utf8')).map(el => {
      delete el.id,
      el.createdAt = new Date(),
      el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Users', users, {})
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
    await queryInterface.bulkDelete('Users', null, {
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
