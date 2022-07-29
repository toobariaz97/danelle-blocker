const { food_intake } = require('../../../models');
const moment= require('moment');
const { Op } = require('sequelize');
const { apiSuccess, apiSuccessWithData, apiError } = require('../../../helpers/apiHelpers');

exports.addfoodIntake = async (req, res) => {

    let { user } = req;

    let { breakfast, snacks1, lunch, snacks2, dinner, dated } = req.body;

    try {

        let addFood = await food_intake.findOne({ where: { dated: dated } });

        if (!addFood) {
            await food_intake.create({
                dated,
                breakfast,
                snacks1,
                lunch,
                snacks2,
                dinner,
                user_id: user.id
            })
        }
        else {
            return res.status(500).json(apiSuccess("already have record"))
        }

        let response = {
            msg: "Record added suuccessfully",
            success: true,
            id: user.id
        };
        return res.status(500).json(apiSuccess("Record added suuccessfully"));

    } catch (error) {
        console.log(error)
    }
}


exports.editFood = async (req, res) => {

    let { user } = req;
    let { breakfast, snacks1, lunch, snacks2, dinner, dated } = req.body;

    try {
        let isExist = await food_intake.findOne(
            {
                where: {
                    dated: dated,
                    user_id:user.id
                }
            }
        );
        if (isExist){
            isExist.breakfast = breakfast;
            isExist.snacks1 = snacks1;
            isExist.lunch = lunch;
            isExist.snacks2 = snacks2;
            isExist.dinner = dinner;
            await isExist.save();
        }

        return res.status(200).json(apiSuccess("updated successfully"));
    } catch (error) {
        console.log(error)
    }
}


exports.getFoodRecord = async (req, res) => {

    let {user}=req;
    try {

        let food = await food_intake.findOne({ where: { dated:{[Op.gte]:req.body.dated},user_id:user.id }})
        if (!food) return res.status(404).json(apiError("No record found"));

        return res.status(200).json(apiSuccessWithData("food record",food))

    } catch (error) {
        console.log(error)
    }

}


