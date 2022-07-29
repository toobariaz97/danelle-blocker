'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('food_intakes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dated: {
        type: Sequelize.DATE
      },
      breakfast: {
        type: Sequelize.STRING
      },
      snacks1: {
        type: Sequelize.STRING
      },
      lunch: {
        type: Sequelize.STRING
      },
      snacks2: {
        type: Sequelize.STRING
      },
      dinner: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
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
    await queryInterface.dropTable('food_intakes');
  }
};