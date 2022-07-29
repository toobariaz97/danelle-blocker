const { Op } = require('sequelize');
const { feedbacks: feedbackModel, admin: adminModel } = require('../../../models');
const moment = require('moment');
const { apiSuccess, apiError, apiSuccessWithData } = require('../../../helpers/apiHelpers');

exports.getFeedback = async (req, res) => {

    let { user } = req;
    let feedback;
    try {
        const whereStatement = {}
        const { startDate, endDate, search, entries, page } = req.query;
    
        if (startDate && endDate) {
            whereStatement.createdAt = { [Op.between]: [startDate, endDate] }
        }
        if (search) {
            whereStatement.username = { [Op.like]: `%${search}%` }

        }
        let Datefilter = "";

        if (startDate && endDate) {
            Datefilter =
                startDate && endDate
                    ? {
                        createdAt: {
                            $gte: moment(startDate).startOf("day").toDate(),
                            $lte: moment(endDate).endOf("day").toDate(),
                        },
                    }
                    : {};
            console.log("startDateto", Datefilter);
        } else if (startDate) {
            console.log("startDate");
            Datefilter = startDate
                ? {
                    createdAt: {
                        $gte: moment(startDate).startOf("day").toDate(),

                        $lte: moment(new Date()).endOf("day").toDate(),
                    },
                }
                : {};
        }
        var currentpage = page ? parseInt(page) : 1;

        var per_page = entries ? parseInt(entries) : 10;

        let { docs: data, total, pages } = await feedbackModel.paginate({
            where: whereStatement,
            page: currentpage,
            paginate: per_page,
            Datefilter
        });

        let response = {
            data,
            current_page: currentpage,
            total,
            per_page: entries,
            last_page: pages,
        }

        return res.json(apiSuccessWithData("feedbacks",response))

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.deleteFeedback = async (req, res) => {

    try {

        let feedback = await feedbackModel.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!feedback)
            return res.status(404).json(apiError("feedback not found"))

        await feedback.destroy();

        return res.status(200).json(apiSuccess("deleted successfully"))

    } catch (error) {
        console.log(error)
    }
}
exports.viewFeedback = async (req, res) => {

    try {
        let feedback = await feedbackModel.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!feedback) return res.status(401).json('no feedback available by this id');
        return res.json(feedback)
    } catch (error) {
        console.log(error)
    }
}
