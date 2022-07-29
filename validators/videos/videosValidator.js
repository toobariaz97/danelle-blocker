const Validator = require('validatorjs')

module.exports = (req, res, next) => {

    let validation = new Validator(req.body, {

        title:"required",
        description:"required",
        video_name:"required",
        thumbnail_name:"required"
    })
    if (validation.fails()) {

        return res.status(422).json(validation.errors.all())
    }
    return next();
}