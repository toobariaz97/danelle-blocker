'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customize_subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customize_subscriptions.init({
    subscription_details_id: DataTypes.INTEGER,
    descriptions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customize_subscriptions',
  });
  return customize_subscriptions;
};