'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('meal_plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscription_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: "subscription_plans",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      },
      breakfast: {
        allowNull: false,
        type: Sequelize.STRING
      },
      snack1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lunch: {
        allowNull: false,
        type: Sequelize.STRING
      },
      snack2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dinner: {
        allowNull: false,
        type: Sequelize.STRING
      },
      days: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('meal_plans');
  }
};