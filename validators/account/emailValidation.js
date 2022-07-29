const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    email:"required|email"
 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}