'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reminder_settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reminder_settings.init({
    reminder_id: DataTypes.INTEGER,
    reminder_interval: DataTypes.TIME,
    reminder_value: DataTypes.INTEGER,
    reminder_times:DataTypes.INTEGER,


    reminder_days: {
      type: DataTypes.JSON,
      get:function(){
        return JSON.parse(this.getDataValue('reminder_days'));

      },
      set:function (value) {
       
          this.setDataValue('reminder_days',JSON.stringify(value))
        
       }
    },
    choose_place:DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'reminder_settings',
  });
  return reminder_settings;
};