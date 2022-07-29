'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class terms_and_conditions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  terms_and_conditions.init({
    data:{
      type: DataTypes.JSON,
      get:function(){
        return JSON.parse(this.getDataValue('data'));

      },
      set:function (value) {
       
          this.setDataValue('data',JSON.stringify(value))
        
       }
    },
  }, {
    sequelize,
    modelName: 'terms_and_conditions',
  });
  return terms_and_conditions;
};