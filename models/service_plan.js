let {paginate}= require('sequelize-paginate')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service_plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  service_plan.init({
    title: DataTypes.STRING,
    prices_per_hour: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'service_plan',
  });
  paginate(service_plan)
  return service_plan;
};