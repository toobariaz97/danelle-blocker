const { apiSuccess } = require('../../../helpers/apiHelpers');
const { feedbacks } = require('../../../models')

exports.createFeedback = async (req, res) => {

    let { firstName, lastName,email,phone,subject, message } = req.body;

    try {
        let msg = await feedbacks.create({
            username: firstName,
            email: lastName,
            phone:email,
            subject: phone,
            message: message,
            status:true
        });
        return res.status(200).json(apiSuccess("Feedback added successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }


}