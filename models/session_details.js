'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.payments,{foreignKey:"payable_id"});
      this.belongsTo(models.users,{foreignKey:"user_id", as:"users"})
      this.belongsTo(models.online_session,{foreignKey:"session_id",as:"online_session"})
    }
  }
  session_details.init({
    session_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
   
  }, {
    sequelize,
    modelName: 'session_details',
  });
  return session_details;
};