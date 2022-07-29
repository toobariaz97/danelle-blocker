const { apiSuccessWithData, apiError } = require('../../../helpers/apiHelpers');
const { privacy_policy, terms_and_conditions } = require('../../../models')

exports.privacyPolicy = async (req, res) => {


    try {
        let privacy = await privacy_policy.findOne({});
        return res.json(apiSuccessWithData("privacy and policy", privacy))


    } catch (error) {
        console.log(error)
    }
}

exports.createtermsAndCondition = async (req, res) => {

    try {

        let terms = await terms_and_conditions.create(req.body);
        if (!terms) return res.status(404).json(apiError("no terms and condtions seted yet..!"))
        return res.status(200).json(terms)

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)

    }
}
exports.termsAndCondition = async (req, res) => {

    try {

        let terms = await terms_and_conditions.findAll({});
        if (!terms) return res.json(apiError("no terms and condtions seted yet..!"))
        return res.status(200).json(apiSuccessWithData("terms and conditions", terms))

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }
}