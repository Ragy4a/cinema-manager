'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      country_id: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('locations');
  }
};