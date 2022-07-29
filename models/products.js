
'use strict';
const {
  Model
} = require('sequelize');
const { paginate } = require('sequelize-paginate');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.media, {
        foreignKey: 'media_id',
        constraints: false,
        as:"media",
      
      }); 
           this.belongsToMany(models.orders, {
        foreignKey: "product_id",
        through: "order_details",
        otherKey: "order_id",
        as: "orders"
      })
    }
  }
  products.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    prices: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    // image: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    // image_url: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return `${process.env.BASE_URL}/images/${}`;
    //     // return ;

    //   },
    // }

  }, {
    sequelize,
    modelName: 'products',
  });
  paginate(products)
  return products;
};