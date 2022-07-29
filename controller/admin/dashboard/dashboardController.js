const moment = require('moment');
const { Op, where } = require('sequelize');
const { apiSuccessWithData } = require('../../../helpers/apiHelpers');
const { subscription_details, order_details, session_details, sequelize, Sequelize, payments } = require('../../../models')


exports.subscriptionsSale = async (req, res) => {

    try {

        let subscriptionSale = await subscription_details.count();
        let productSale = await order_details.count();


        let sum = await payments.sum('amount_paid')
        let productSales= await payments.sum('amount_paid',{where:{payable_type:"Orders"}})
        let serviceSale= await payments.sum('amount_paid',{where:{payable_type:"Services"}})
        

        const response = {

            totals: sum,
            totalProducSale:productSales,
            totalServicesSale:serviceSale
        }
        return res.json(apiSuccessWithData("Total amount", response))

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.getGraph = async (req, res) => {

    let { year } = req.query;

    try {
        let year = req.query.year || (new Date()).getFullYear();
        let from = `${year}-01-01 00:00:00`;
        let to = `${year}-12-31 00:00:00`;

        /* let data = await payments.findAll({
            attributes: {
                include: [
                    [sequelize.fn('month', sequelize.col('createdAt')), 'month'],
                    [sequelize.fn('sum', sequelize.col('amount_paid')), 'count']],
            },
            where: {
                createdAt: {
                    [Op.between]: [from, to],
                },
            },
            group: ['month'],
        }); */
        let months = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };
        // $graphData = Payment::selectRaw('IFNULL(sum(amount),0) as sum_amount,MONTHNAME(created_at) as month')
        // ->whereRaw('MONTH(created_at) = MONTH(NOW())');
        // $graphData = $graphData->whereRaw('YEAR(created_at) = ?',['year'=>request('year',date('Y'))]);
        let data = await payments.findAll({
            attributes: {
                include: [
                    [sequelize.fn('IFNULL', sequelize.fn('MONTHNAME', sequelize.col('createdAt')), 0), 'month'],
                    [sequelize.fn('IFNULL', sequelize.fn('sum', sequelize.col('amount_paid')), 0), 'sum_amount']],
            },

            where: {
                createdAt: {
                    [Op.between]: [from, to],
                },
                createdAt: sequelize.where(Sequelize.fn("YEAR", sequelize.col("createdAt")), "=", year),
            },
            order: sequelize.literal("FIELD(MONTH,'January','February','March','April','May','June','July','August','September','November','December')"),
        });


        for (let month of data) {
            if (month.dataValues.month) {
                months[month.dataValues.month] = month.dataValues.sum_amount;
            }

        }
        months = Object.values(months);
        return res.status(200).json(apiSuccessWithData(`Graph data as per year`, months));
    } catch (error) {
        console.log(error)
    }
}




exports.getGraphOfSubscriptionSale = async (req, res) => {

    let { year } = req.query;

    try {
        let year = req.query.year || (new Date()).getFullYear();
        let from = `${year}-01-01 00:00:00`;
        let to = `${year}-12-31 00:00:00`;

        /* let data = await payments.findAll({
            attributes: {
                include: [
                    [sequelize.fn('month', sequelize.col('createdAt')), 'month'],
                    [sequelize.fn('sum', sequelize.col('amount_paid')), 'count']],
            },
            where: {
                createdAt: {
                    [Op.between]: [from, to],
                },
            },
            group: ['month'],
        }); */
        let months = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };
        // $graphData = Payment::selectRaw('IFNULL(sum(amount),0) as sum_amount,MONTHNAME(created_at) as month')
        // ->whereRaw('MONTH(created_at) = MONTH(NOW())');
        // $graphData = $graphData->whereRaw('YEAR(created_at) = ?',['year'=>request('year',date('Y'))]);
        let data = await payments.findAll({
            attributes: {
                include: [
                    [sequelize.fn('IFNULL', sequelize.fn('MONTHNAME', sequelize.col('createdAt')), 0), 'month'],
                    [sequelize.fn('IFNULL', sequelize.fn('sum', sequelize.col('amount_paid')), 0), 'sum_amount']],
            },

            where: {
                payable_type: "subscription",
                createdAt: {
                    [Op.between]: [from, to],
                },
                createdAt: sequelize.where(Sequelize.fn("YEAR", sequelize.col("createdAt")), "=", year),
            },
            order: sequelize.literal("FIELD(MONTH,'January','February','March','April','May','June','July','August','September','November','December')"),
        });


        for (let month of data) {
            if (month.dataValues.month) {
                months[month.dataValues.month] = month.dataValues.sum_amount;
            }

        }
        months = Object.values(months);
        return res.status(200).json(apiSuccessWithData(`Graph data of subscription sale`, months));
    } catch (error) {
        console.log(error)
    }
}

