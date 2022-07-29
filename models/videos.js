const { paginate } = require('sequelize-paginate')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  videos.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    video_name: DataTypes.STRING,
    thumbnail_name: DataTypes.STRING,
    thumbnail_name_image_url:
    {
      type: DataTypes.VIRTUAL,
      get() {
        return `${process.env.BASE_URL}/images/${this.thumbnail_name}`;
        // return ;

      },
    },
    video_url:
    {
      type: DataTypes.VIRTUAL,
      get() {
        return `${process.env.BASE_URL}/images/${this.video_name}`;
        // return ;
      },
    }
  }, {
    sequelize,
    modelName: 'videos',
  });
  paginate(videos);
  return videos;
};