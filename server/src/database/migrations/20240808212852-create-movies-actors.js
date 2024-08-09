'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movies_actors', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'movies',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true,
        allowNull: false,
      },
      actor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'actors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('movies_actors');
  }
};