'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('directors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      second_name: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATE
      },
      birth_place: {
        type: Sequelize.INTEGER
      },
      death_year: {
        type: Sequelize.DATE
      },
      death_place: {
        type: Sequelize.INTEGER
      },
      photo: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('directors');
  }
};