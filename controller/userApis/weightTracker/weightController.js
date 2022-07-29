
const { apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers');
const { weight_tracker } = require('../../../models');


exports.weightTracker = async (req, res) => {

    let { user } = req;
    let {
        current_weight,
        desire_weight } = req.body;
    try {
        let currentWeight = await weight_tracker.findOne({ where: { user_id: user.id } })

        if (!currentWeight) {
            let setGoal = await weight_tracker.create({

                current_weight: current_weight,
                desire_weight: desire_weight,
                user_id: user.id
            })
            return res.json(apiSuccess("Your weight goal has been set"))
        }
        else{
            currentWeight.current_weight=current_weight;
            currentWeight.desire_weight=desire_weight;
            await currentWeight.save();
            return res.json(apiSuccess("Your weight goal has been set"))

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.addWeight = async (req, res) => {


    let { user } = req;
    let {
        current_weight,
        setDate } = req.body;
    try {

        let currentWeight = await weight_tracker.findOne({ where: { user_id: user.id } })
        if (!currentWeight) {
            await weight_tracker.create({
                current_weight: current_weight,
                createdAt: setDate
            })
            return res.status(200).json(apiSuccess("Weight added..!"))

        }
        else {
            currentWeight.current_weight=current_weight;
            currentWeight.createdAt=setDate;
            await currentWeight.save();
            return res.status(200).json(apiSuccess("Weight added..!"))
        }

    } catch (error) {
 
        console.log(error)
        return res.status(500).json(error)
    }
}