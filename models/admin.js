'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image:DataTypes.STRING,
    image_url: {
      type: DataTypes.VIRTUAL,
      get() {
          return `${process.env.BASE_URL}/images/${this.image}`;
          // return ;
    
      },
  },
  }, {
    sequelize,
    modelName: 'admin',
  });
  return admin;
};