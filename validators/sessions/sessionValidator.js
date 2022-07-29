const Validator = require('validatorjs')

module.exports = (req, res, next) => {

    let validation = new Validator(req.body, {

        session_name: "required",
        price: "required",
        date: "required",
        time: "required",
        duration: "required",
        total_seats: "required",
        description: "required",



    })
    if (validation.fails()) {

        return res.status(422).json(validation.errors.all())
    }
    next();
}