'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // return Promise.all([
    //   queryInterface.addColumn(
    //     'online_sessions', // table name
    //     'status', // new field name
    //     {
    //       type: Sequelize.BOOLEAN,
    //       after: 'description',
    //       allowNull: false,
    //     },
    //   ),
    // ])
  },

  async down (queryInterface, Sequelize) {
//   return Promise.all([
//      queryInterface.removeColumn('online_sessions', 'status')
// ])
  }
};
