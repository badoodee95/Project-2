'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      review_desc: {
        type: Sequelize.STRING
      },
      release_string: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      is_free_game: {
        type: Sequelize.BOOLEAN
      },
      background: {
        type: Sequelize.STRING
      },
      deck_compat: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};