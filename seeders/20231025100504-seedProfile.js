'use strict';

/** @type {import('sequelize-cli').Migration} */
const fs = require('fs')
module.exports = {
  async up (queryInterface, Sequelize) {
    const profiles = JSON.parse(fs.readFileSync('./data/profile.json', 'utf8')).map(el => {
      delete el.id,
      el.createdAt = new Date(),
      el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Profiles', profiles, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {
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
