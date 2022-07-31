const sequelizePaginate = require('sequelize-paginate')

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscription_plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      this.hasMany(models.subs_description, {
        foreignKey: "subscription_id",
        as:"plan",
        onDelete: 'cascade'
    
      })
      // this.h=(models.users, {foreignKey:"user_id"})  
      // this.belongsToMany(models.users, {
      //   foreignKey: "subs_id",
      //   through: "subscription_details",
      //   otherKey: "user_id",
      //   as: 'users',
      //   onDelete: 'cascade'
      // })
      // this.hasOne(models.subs_description,{
      //   foreignKey:'subscription_id'

      this.hasMany(models.meal_plan, {
        foreignKey: "subscription_id",
        as: 'meal_plan',
      })

 
    }

  }
  subscription_plan.init({
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'subscription_plan',
    
  },
  {    paranoid: true}
  );
  sequelizePaginate.paginate(subscription_plan)

  return subscription_plan;
};