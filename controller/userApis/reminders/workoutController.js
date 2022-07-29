const { apiSuccess, apiError } = require('../../../helpers/apiHelpers');
const { reminder_settings, reminders } = require('../../../models');

exports.addWorkout = async (req, res) => {

    let { user } = req;
    let { interval, days, place, reminder, choose } = req.body;
    try {
        let type = await reminders.findOne({ where: { type: "Workout" } });

        let add = await reminder_settings.create({
            reminder_id: type.id,
            reminder_interval: interval,
            reminder_value: null,
            reminder_times: reminder,
            reminder_days: days,
            choose_place: choose,
            user_id: user.id,

        })
        return res.json(apiSuccess("Added successfully"))

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


exports.editWorkout = async (req, res) => {
    
    let { interval, days, remindMe, choose } = req.body;
    
    try {
        
        let exist = await reminders.findOne({ where: { type: "Workout" } })
        
        let reminder = await reminder_settings.findOne({
            where: {
                id: req.params.id,
                reminder_id: exist.id
            }
        });
        if (!reminder) return res.status(404).json(apiError("no reminder found"));
        
        reminder.reminder_interval = interval;
        reminder.reminder_times = remindMe;
        reminder.reminder_days = days;
        reminder.choose_place = choose;
        await reminder.save()
        return res.status(200).json(apiSuccess("Updated successfully"))
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.workoutConfirmation = async (req, res) => {
    
    try {
        
        let done = await reminder_settings.findOne({ where: { id: req.param.id } })
        if (done) {
            done.status = false;
            await done.save()
        }
        return res.json(apiSuccess("successfully done"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}