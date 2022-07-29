'use strict';
const {
  Model
} = require('sequelize');

const {paginate}=require('sequelize-paginate')


module.exports = (sequelize, DataTypes) => {
  class feedbacks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  feedbacks.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'feedbacks',
  });

  paginate(feedbacks)
  return feedbacks;
};