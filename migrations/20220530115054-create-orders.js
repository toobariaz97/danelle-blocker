'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }

      },
      order_number:{
        type:Sequelize.STRING
      },
      
      amount_paid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,

      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,

      },
      customer_name:{type:Sequelize.STRING},
      customer_email:{type:Sequelize.STRING},
      customer_phone:{type:Sequelize.STRING},

      shipping_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      same_as_shipping: {
        type: Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
            },
      billing_address:{
        type:Sequelize.TEXT,
        allowNull:true

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};