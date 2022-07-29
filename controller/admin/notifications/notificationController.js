const { apiSuccessWithData } = require('../../../helpers/apiHelpers');
const { notifications } = require('../../../models');


exports.getNotifications = async (req, res) => {

    try {
        var currentpage = req.query.page ? parseInt(req.query.page) : 1;

        let { docs: data, total, pages } = await notifications.paginate({ page: currentpage });

        let response = {
            data,
            current_page: currentpage,
            total,
            last_page: pages,
        }

        return res.json( apiSuccessWithData("Notifiactions",response))

    } catch (error) {
        console.log(error)
    }

}

exports.getNotificationLimit = async (req, res) => {

    try {

        let notify = await notifications.findAll({
            limit: 3
        })

        return res.json(apiSuccessWithData("Dashboard Notifications",notify))

    } catch (error) {
        console.log(error)
    }

}


