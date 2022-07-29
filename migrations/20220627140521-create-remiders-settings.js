'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reminder_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reminder_id: {
        type: Sequelize.INTEGER
      },
      reminder_interval: {
        type: Sequelize.TIME
      },
      reminder_value: {
        type: Sequelize.INTEGER
      },
      reminder_times: {
        type:Sequelize.INTEGER
      },
      reminder_days: {
        type: Sequelize.TEXT,

      },
      choose_place:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('reminder_settings');
  }
};