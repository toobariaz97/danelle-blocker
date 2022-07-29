'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscribe_video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subscribe_video.init({
    email: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    video_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'subscribe_video',
  });
  return subscribe_video;
};