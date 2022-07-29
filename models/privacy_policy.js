'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class privacy_policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  privacy_policy.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'privacy_policy',
  });
  return privacy_policy;
};