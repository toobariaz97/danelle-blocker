const Validator = require('validatorjs')

module.exports = (req, res, next) => {

    let validation = new Validator(req.body, {

        current_weight: "required",
        createdAt: "required"


    })
    if (validation.fails()) {

        return res.status(422).json(validation.errors.all())
    }
    return next();
}