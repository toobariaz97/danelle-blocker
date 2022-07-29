'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subs_description extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // this.belongsTo(models.subscription_plan)

    }
  }
  subs_description.init({
    subscription_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    prices: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'subs_description',
  });
  return subs_description;
};