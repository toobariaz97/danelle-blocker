'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meal_plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.subscription_plan,{
        foreignKey:'subscription_id',
        as:"subscription_plan"
    
      })
      this.hasMany(models.payments,{foreignKey:"payable_id",as:"plan"})
    }
  }
  meal_plan.init({
    subscription_id: DataTypes.INTEGER,
    breakfast: DataTypes.STRING,
    snack1: DataTypes.STRING,
    lunch: DataTypes.STRING,
    snack2: DataTypes.STRING,
    dinner: DataTypes.STRING,
    days: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'meal_plan',
  });
  return meal_plan;
};