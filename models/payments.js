"use strict";
const { Model } = require("sequelize");

const { paginate } = require("sequelize-paginate");
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.orders, {
        foreignKey: "payable_id",
        constraints: false,
        as: "orders",
      });
      
      this.belongsTo(models.subscription_details, {
        foreignKey: "payable_id",
        constraints: false,
        as: "meal_plan",
      });


      this.belongsTo(models.session_details, {
        foreignKey: "payable_id",
        as: "sessions",
      });


      this.addHook("afterFind", (findResult) => {
        if (!Array.isArray(findResult)) findResult = [findResult];
        for (const i of findResult) {
          if (i.payable_type == "subscription" && i.meal_plan !== "undefind") {
          
            i.payable = i.meal_plan;
            delete i.sessions;
            delete i.dataValues.sessions;
            delete i.orders;
            delete i.dataValues.orders;
         
          } 
         else if (i.payable_type == "Orders" && i.orders !== "undefind") {
            i.payable= i.orders;

            delete i.sessions;
            delete i.dataValues.sessions;
            delete i.meal_plan;
            delete i.dataValues.meal_plan;

          }
          
          else if ( i.payable_type == "sessions" && i.sessions !== "undefind")
           {
            i.payable= i.sessions;
            delete i.orders;
            delete i.dataValues.orders;
            delete i.meal_plan;
            delete i.dataValues.meal_plan;
        }
      }
      
      });
    
    }
  }
  payments.init(
    {
      payable_id: DataTypes.INTEGER,
      payable_type: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      data: {
        type: DataTypes.JSON,
        get: function () {
          return JSON.parse(this.getDataValue("data"));
        },
        set: function (value) {
          this.setDataValue("data", JSON.stringify(value));
        },
      },
      amount_paid: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "payments",
    }
  );
  paginate(payments);
  return payments;
};
