'use strict';
const {
  Model
} = require('sequelize');
const { paginate } = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notifications.init({
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    notfiable_id: DataTypes.STRING,
    notifiable_type: DataTypes.STRING,
    name: DataTypes.STRING,
    name_id: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'notifications',
  });
  paginate(notifications)
  return notifications;
};