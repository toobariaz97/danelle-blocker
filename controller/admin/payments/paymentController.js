
const { Op } = require('sequelize');
const { apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers');
const { payments, order_details, session_details, online_session, orders,subscription_details, users, subscription_plan, sequelize } = require('../../../models');
// const online_session = require('../../../models/online_session');

exports.getPayments = async (req, res) => {
    try {

        let whereStatement = {};

        const { status, startDate, endDate, search, entries, page, payment_type } = req.query;

        if (status) {
            whereStatement.status = { [Op.like]: `${status}` };
        }
        if (startDate && endDate) {
            whereStatement.createdAt = { [Op.between]: [startDate, endDate] }
        }
        if (search) {
            whereStatement = {
                ...whereStatement,
                [Op.or]: [
                    {
                        // [Op.in]: sequelize.literal(`(SELECT id FROM users WHERE first_name like "%${search}%") `),            

                        // payable_id: {
                        //     [Op.in]: sequelize.literal(`(SELECT id from subscription_plan where title like "%${search}")`)
                        // },
                        // payable_id: {
                        //     [Op.in]: sequelize.literal(`(SELECT  id from users where first_name like "%${search}")`)
                        // },
                        payable_id: {
                            [Op.in]: sequelize.literal(`(SELECT  id from users where first_name like "%${search}")`)
                        }
                    }
                ]
            }

        }
        if (payment_type) {
            whereStatement.payable_type = { [Op.like]: `%${payment_type}%` };
        }


        var currentpage = page ? parseInt(page) : 1;

        var per_page = entries ? parseInt(entries) : 10;
        let { docs: data, total, pages } = await payments.paginate({
            include: [
                {
                    model: session_details,
                    as: "sessions",
                    attributes: ["user_id", "session_id"],
                    include: [{
                        model: users, as: "users", attributes: ["id", "first_name"],
                    }, {
                        model: online_session, as: "online_session", attributes: ["id", "session_name"],
                    }]
                },
                {
                    model: orders,
                    as: "orders",
                    attributes: ["customer_id"],
                    include: [{
                        model: users, as: "users", attributes: ["id", "first_name"],
                    }]
                },
                {
                    model:subscription_details,
                    as:"meal_plan",
                    attributes:["user_id","subs_id"],
                    include:[
                        {
                            model: users, as: "users", attributes: ["id", "first_name"],
                        }, {
                            model: subscription_plan, as: "plan", attributes: ["id", "title"],
                        }
                    ]
                }
            ],
            where: whereStatement,
            page: currentpage,
            paginate: per_page,

        })
        let response = {
            data,
            current_page: currentpage,
            total,
            per_page: entries,
            last_page: pages,

        }

        return res.status(200).json(apiSuccessWithData("All payment records", response))
    } catch (error) {
        console.log(error)
    }
}