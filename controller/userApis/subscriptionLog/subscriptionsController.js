const { apiSuccessWithData, apiError } = require('../../../helpers/apiHelpers');
const { subscription_plan, subscription_details, subs_description, meal_plan } = require('../../../models');



exports.getAllSubcription = async (req, res) => {

    try {
        const whereStatement = {}
        const { status, startDate, endDate, search } = req.query;
        if (req.query.status) {
            whereStatement.status = { [Sequelize.Op.like]: `%${status}%` };
        }
        if (req.query.startDate && req.query.endDate) {
            whereStatement.createdAt = { [Op.between]: [startDate, endDate] }
        }
        if (req.query.search) {
            whereStatement.createdAt = { [Op.like]: `%${search}%` }

        }
        let subscription = await subscription_plan.findAll({
            include: ['plan', 'meal_plan'],
            where: whereStatement
        })

        subscription.forEach(element => {
            console.log(element.plan)
        });
        // console.log(subscription)
        return res.json(apiSuccessWithData( "subcription listing",subscription))


    } catch (error) {
        console.log(error)
    return res.status(500).json(error)
    }
}

exports.myMeals = async (req, res) => {

    let { user } = req;
    try {

        let myMeals = await subscription_details.findAll({
            include: ['subscription_plan',"users"],
            where: {
                user_id: user.id
            }
        })


       return res.json(apiSuccessWithData("Mealplan of auth",myMeals))

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
exports.viewMealDetails = async (req, res) => {

    let { user } = req;

    let mealPlan = await subscription_details.findOne({
        include: [{ model: subscription_plan,as:"plan", 
        include:[{model:meal_plan ,as:"meal_plan" }, {model:subs_description,as:"plan"}]
    },  
 ],
                where: {
            id: req.params.id,
            user_id: user.id
        }
    })

    if(!mealPlan) return res.status(404).json(apiError("Not found"))

    return res.json(apiSuccessWithData("Mealpal details",mealPlan))
}