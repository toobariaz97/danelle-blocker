'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.products,{as:"products",foreignKey:"media_id",constraints: false,})
      // this.belongsTo(models.products,{foreignKey:"media_id"})
      // media.hasMany(models.products, {
      //   foreignKey: 'media_id',
      //   constraints: false,
      //   scope: {
      //     commentableType: 'image'
      //   }
      // });
    }
  }
  media.init({
    name: DataTypes.STRING,
    media_type: DataTypes.STRING,
    media_id: DataTypes.INTEGER,
    image_url: {
      type: DataTypes.VIRTUAL,
      get() {
          return `${process.env.BASE_URL}/images/${this.name}`;
      },
},
  }, {
    sequelize,
    modelName: 'media',
  });
  return media;
};