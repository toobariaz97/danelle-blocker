'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.payments,{foreignKey:"payable_id"})
      // this.hasMany(models.products,{foreignKey:"product_id",as:"products"})
    }
  }
  order_details.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    Qty: DataTypes.INTEGER,
    total_amount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'order_details',
  });
  return order_details;
};