const sequelizePaaginate= require('sequelize-paginate')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscription_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.payments,{foreignKey:"payable_id"})
      this.belongsTo(models.subscription_plan, { foreignKey: "subs_id",as:"plan", onDelete: 'cascade'});
      this.belongsTo(models.users, { foreignKey: "user_id", as: "users", onDelete: 'cascade'});
      this.hasMany(models.customize_subscriptions,{foreignKey:"subscription_details_id" , as:"descriptions"})
    }
  }
  subscription_details.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    subs_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    // descriptions: {
    //   type: DataTypes.JSON,
    //   get: function () {
    //     return JSON.parse(this.getDataValue('descriptions'));
    //   },
    //   set: function (value) {
    //     this.setDataValue('descriptions', JSON.stringify(value))
    //   }
    // },
    status: DataTypes.BOOLEAN,
    approval_status:DataTypes.STRING,
    type: DataTypes.STRING,
    amount_paid:DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'subscription_details',
  });
  sequelizePaaginate.paginate(subscription_details)

  return subscription_details;
};