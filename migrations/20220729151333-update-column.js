'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([

      queryInterface.removeColumn("subscription_details","descriptions"),
      queryInterface.removeColumn("subscription_details","added_on"),


    ])
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return  Promise.all([

       queryInterface.addColumn("subscription_details","descriptions",{
        after:"user_id",
        type:Sequelize.TEXT
       }),

       queryInterface.addColumn("subscription_details","added_on",{
        after:"type",
        type:Sequelize.DATE
       }),
       

     ]) 

  }
};
