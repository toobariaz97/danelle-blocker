const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    
    card_holde_name:"required",
   card_number:"required",
   card_month:"required",
   quantity:"required"


 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}