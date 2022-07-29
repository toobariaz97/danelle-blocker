const { apiSuccess, apiError } = require('../../../helpers/apiHelpers');
const { reminder_settings, reminders } = require('../../../models');

exports.addInterval = async (req, res) => {
    let data = [
        {
            id: 0,
            title: "Every 60 mins"
        },
        {
            id: 1,
            title: "Every 30 mins"
        },
        {
            id: 2,
            title: "Every 15 mins"
        },
        {
            id: 3,
            title: "other"
        }
    ];

    return res.json(data)
}


exports.remindMe = async (req, res) => {
    let data = [
        {
            id: 0,
            title: "Once"
        },
        {
            id: 1,
            title: "Twice"
        },
        {
            id: 2,
            title: "Thrice"
        },
        {
            id: 3,
            title: "4 Times"
        },
        {
            id: 4,
            title: "5 Times"
        }
    ];

    return res.json(data)

}


exports.addWaterIntake = async (req, res) => {

    let { user } = req;

    let type = await reminders.findOne({ where: { type: "water" } })

    let { no_of_glasses, interval, reminder, } = req.body;
    try {

        let add = await reminder_settings.create({
            reminder_id: type.id,
            reminder_interval: interval,
            reminder_value: no_of_glasses,
            reminder_times: reminder,
            reminder_days: "daily",
            user_id: user.id,
            status:true
        })

        return res.json(apiSuccess("Record added successfully"))

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.editWaterReminder = async (req, res) => {

    let { no_of_glasses, interval, remindMe, } = req.body;

    try {

        let exist = await reminders.findOne({ where: { type: "water" } })
        let reminder = await reminder_settings.findOne({
            where: {
                id: req.params.id,
                reminder_id: exist.id
            }
        });
        if (!reminder) return res.status(404).json(apiError("no reminder found"));

        reminder.reminder_value = no_of_glasses;
        reminder.reminder_interval = interval;
        reminder.reminder_times = remindMe;
        await reminder.save()
        return res.status(200).json(apiSuccess("Updated successfully"))
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}