const sequelizePaginate = require('sequelize-paginate')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsToMany(models.products, {
        foreignKey: "order_id",
        through: "order_details",
        otherKey: "product_id",
        as: "products"
      })
      //  this.hasMany(models.orders,{foreignKey:"customer_id"})   
      this.belongsTo(models.users, { foreignKey: "customer_id",as:"users" })
      this.hasMany(models.payments,{foreignKey:"payable_id",as:"payments"})
   
    }
  }
  orders.init({
    customer_id: DataTypes.INTEGER,
    order_number:DataTypes.INTEGER,
    amount_paid:{type: DataTypes.BOOLEAN,defaultValue:false},
    status: DataTypes.STRING,
    customer_name:DataTypes.STRING,
    customer_email:DataTypes.STRING,
    customer_phone:DataTypes.STRING,
    shipping_address:{
      type:DataTypes.JSON,
      allowNull:true,
      get: function(){
        return JSON.parse(this.getDataValue('shipping_address'));
      },
      set:function(value){
      this.setDataValue('shipping_address',JSON.stringify(value))
      console.log(value)
      }
    },
    same_as_shipping:DataTypes.BOOLEAN,
    billing_address:{
      type:DataTypes.JSON,
      allowNull:true,
      get: function(){
        return JSON.parse(this.getDataValue('billing_address'));
      },
      set:function(value){
      this.setDataValue('billing_address',JSON.stringify(value))
      console.log(value)
      }
    },
    
  }, {
    sequelize,
    modelName: 'orders',
  });
  sequelizePaginate.paginate(orders)
  return orders;
};