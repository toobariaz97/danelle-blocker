'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class food_intake extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  food_intake.init({
    dated: DataTypes.DATE,
    breakfast: DataTypes.STRING,
    snacks1: DataTypes.STRING,
    lunch: DataTypes.STRING,
    snacks2: DataTypes.STRING,
    dinner: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'food_intake',
  });
  return food_intake;
};