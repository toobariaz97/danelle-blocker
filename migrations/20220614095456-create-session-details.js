'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'online_sessions',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
              }
      },
      addedOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),

      },
      total_price: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_details');
  }
};