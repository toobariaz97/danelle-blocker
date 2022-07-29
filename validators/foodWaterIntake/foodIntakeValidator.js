const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    
   dated:"required",
   breakfast:"required",
   snacks1:"required",
   lunch:"required",
   snacks2:"required",
   dinner:"required"


 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}

