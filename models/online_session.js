const sequelizePaginate = require('sequelize-paginate')

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class online_session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.payments,{foreignKey:"payable_id",as:"sessions"})
      this.belongsToMany(models.users,{
        foreignKey:'session_id',
        through:'session_details',
        otherKey:'user_id',
        as:"users"
      })
    }
  }
  online_session.init({
    session_name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    duration: DataTypes.STRING,
    total_seats: DataTypes.INTEGER,
    available_seats: DataTypes.INTEGER,
    image:DataTypes.STRING,
    description:DataTypes.STRING,
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
    modelName: 'online_session',
  });
  sequelizePaginate.paginate(online_session)
  return online_session;
};