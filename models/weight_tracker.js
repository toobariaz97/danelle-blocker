'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weight_tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  weight_tracker.init({
    user_id: DataTypes.INTEGER,
    current_weight: DataTypes.DOUBLE,
    desire_weight: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'weight_tracker',
  });
  return weight_tracker;
};