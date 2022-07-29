const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    
    title:"required",
   description:"required",
   prices:"required",
   quantity:"required"


 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}