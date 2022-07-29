const Validator = require('validatorjs')

module.exports = (req, res, next) => {

    let validation = new Validator(req.body, {

        current_password: "required",
        password: "required|confirmed",

    })
    if (validation.fails()) {

        return res.status(422).json(validation.errors.all())
    }
    next();
}