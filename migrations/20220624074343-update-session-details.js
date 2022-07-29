'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // return Promise.all([

    //   queryInterface.removeColumn("session_details","total_price"),
    //   queryInterface.removeColumn("session_details","addedOn"),
     

    // ])
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  // return Promise.all([

  //  queryInterface.addColumn("session_details","addedOn",{
  //     after:"user_id",
  //     type:Sequelize.DATE,
  //   }),
  // queryInterface.addColumn("session_details","total_price",{
  //     after:"addedOn",
  //     type:Sequelize.DOUBLE,
  //   })
  // ])
  }
};
