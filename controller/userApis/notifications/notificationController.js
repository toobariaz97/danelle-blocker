const userAuthorization = require('../../../middleware/userAuthorization');
const { notifications } = require('../../../models');
const { apiSuccessWithData } = require('../../../helpers/apiHelpers')

exports.getNotifications = async (req, res) => {
    try {
        let notification = await notifications.findAll({
            where: {
                notifiable_type: "User",

            }
        })

        return res.status(200).json(apiSuccessWithData("users Notifiactions", notification))

    } catch (error) {
        console.log(error)
    }
}