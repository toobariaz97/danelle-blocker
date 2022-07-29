'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      description: {
        type: Sequelize.STRING,
        allowNull:false
      },
      prices: {
        type: Sequelize.FLOAT,
        allowNull:false
      },
      quantity:{
        type: Sequelize.INTEGER,
        allowNull:false
      
      },
      image: {
        type: Sequelize.STRING,
        allowNull:false
      },
      
      status: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },

      createdAt: {
        allowNull:false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull:false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};