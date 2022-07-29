const moment = require('moment');
const { Op, where } = require('sequelize');
const { apiError, apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers');
const { subscription_plan, subs_description, subscription_details, Sequelize, sequelize ,users} = require('../../../models')

exports.subscriptionLog = async (req, res) => {

    let { user } = req;
    let whereStatement = {}
    const { status, startDate, endDate, search, limit, page, customizeLog } = req.query;

    if (req.query.status) {
        whereStatement.status = { [Op.like]: `%${status}%` };
    }
    if (customizeLog) {
        whereStatement.type =customizeLog
    }

    if (startDate && endDate) {
        whereStatement.createdAt = { [Op.between]: [startDate, endDate] }
    }
    if (search) {
        whereStatement = {
            ...whereStatement, 
            [Op.or] : [
                {
                    user_id : {
                        [Op.in]: sequelize.literal(`(SELECT id FROM users WHERE first_name like "%${search}%") `),            
                    }
                },
                {
                    subs_id : {
                        [Op.in]: sequelize.literal(`(SELECT id FROM subscription_plans WHERE title like "%${search}%") `),            
                    }
                }
            ],
        }
        
            // whereStatement.user_id = {
            //     [Op.in]: sequelize.literal(`(SELECT id FROM users WHERE first_name like "%${search}%")`),            
            // } 
    }
  
    try {
        var currentpage = page ? parseInt(page) : 1;

        var per_page = limit ? parseInt(limit) : 10;


        let { docs: data, total, pages } = await subscription_details.paginate({
            // include: ["users","plan",{ model: subscription_plan, as: "meal_plan"}],
            include: ["users","plan","descriptions"],
            where:
                whereStatement,
            page: currentpage,
            paginate: per_page,
        }
        )

    //    let mealPlan;
    //     data.forEach(async(element) => {
    //         // console.log((element))
    //      mealPlan=  await subscription_plan.findOne({  
    //         include:["meal_plan"],  
    //         where:{
    //             id:element.subs_id
    //         }})
    //     });
    //     console.log(mealPlan);

// console.log(data[0].id)
        // let mealPlan = await subscription_plan.findOne({  
        //     include:["meal_plan"],  
        //     where:{
        //         id:data.subs_id
        //     }})

        let response = {
            data,
            // mealPlan,
            current_page: currentpage,
            total,
            per_page: limit,
            last_page: pages,
        }
        return res.status(200).json(apiSuccessWithData("subcription log",response))


    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }
}
exports.viewLog = async (req, res) => {

    try {

        let viewLog = await subscription_details.findOne({
            where: {
                id: req.param.id
            },
            includes: ['users']
        })
        if(!viewLog) return res.status(404).json("not found")
        console.log(viewLog)
        return res.status(200).json(apiSuccessWithData("subscription details",viewLog))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

exports.addSubsDetails = async (req, res) => {

    let { user } = req;
    try {
        let isExist = await subs_description.findOne({ where: { subscription_id: req.params.id } });
        if (!isExist) return res.status(400).json(apiError("not available"))
        let addsubs = await subscription_details.create({
            subs_id: isExist.id,
            user_id: user.id,
            amount_paid: [sequelize.fn('sum', sequelize.col('amount_paid')), 'total_amount'],
            status: req.body.status ? true : false
        })
        console.log(addsubs)
        return res.status(200).json(apiSuccess("Added successfullyy"))
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error)

    }
}

exports.updateSubscriptionStatus = async (req, res) => {

    try {

        let isExist = await subscription_details.findOne({
            where: {
                id: req.params.id,

            }
        })
        console.log(isExist)
        // console.log("ghere",isExist.dataValues.in_stock)
        if (!isExist) return res.status(404).json(apiError("not exist"))

        if (req.body.status == 1
        ) {

            isExist.status = 1
            await isExist.save()
            return res.json(apiSuccess("subscription Active"))
        }
        else {
            isExist.status = 0
            await isExist.save()
            return res.json(apiSuccess("Subscription Inactive"));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }
}

exports.viewNormalSubscriptionDetails=async(req,res)=>{


    try {

        let viewRequest= await subscription_details.findOne({
          include:["users","plan"],
            where:{
                id:req.params.id,
                approval_status:"accept"
            }
        })
        if(!viewRequest) return res.status(404).json(apiError("Not found"));


        let mealPlan= await subscription_plan.findOne({
          include:["meal_plan"],
          where:{
              id:viewRequest.subs_id,
          }
        })
let response={
  subscription:viewRequest,
  mealPlan:mealPlan
}
        return res.status(200).json(apiSuccessWithData("Subscription detail as per id", response))
        
    } catch (error) {
        console.log(error)
    }
}


