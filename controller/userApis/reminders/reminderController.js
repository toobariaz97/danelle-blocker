const { reminders } = require('../../../models');



exports.addReminder = async (req, res) => {

    try {
        let remind = await reminders.create(req.body);
        return res.json((remind))

    } catch (error) {
        console.log(error)
    }
}
