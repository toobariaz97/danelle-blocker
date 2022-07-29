const sequelizePaginate = require('sequelize-paginate')

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // this.hasMany(models.subscription_details, {
      //   foreignKey: "user_id",
      //   otherKey: "subs_id",
      //   as: 'plan'
      // })

      this.belongsToMany(models.subscription_plan, {
        foreignKey: "user_id",
        through: "subscription_details",
        otherKey: "subs_id",
        as: 'subscription_plan'
      })
      // define association here
      // this.belongsToMany(models.online_session,{
      //   foreignKey:'user_id',
      //   through:'session_details',
      //   otherKey:'session_id',
      //   as:"online_sessions"
      // })
      // this.hasMany(models.subscription_details, { foreignKey: "user_id", as: "subscription_details" })
      // this.belongsToMany(models.orders, { foreignKey: "user_id",otherKey:"order_id" ,through:"order_details",as:"orders"})
this.hasMany(models.orders,{foreignKey:"customer_id",as:"orders"})

    }
  }
  users.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    DOB: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
    image_url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${process.env.BASE_URL}/images/${this.image}`;
        // return ;

      },
    }

  }, {
    sequelize,
    modelName: 'users',
  });
  sequelizePaginate.paginate(users)
  // console.log(sequelizePaginate)

  return users;
};