const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    first_name:"required",
    last_name:"required"

 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}