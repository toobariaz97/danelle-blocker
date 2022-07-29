const Validator= require('validatorjs')

module.exports = (req, res, next) => {

let validation=new Validator(req.body,{
    title: "required",
    prices_per_hour: "required",
    image: "required",
    description: "required",
    status: "required"

 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
return next();
}