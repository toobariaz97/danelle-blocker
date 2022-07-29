const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    
    no_of_glasses: "required",
    interval: "required",
    reminder: "required",



 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}

