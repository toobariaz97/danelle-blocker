const Validator= require('validatorjs')

module.exports =(req, res, next) => {

let validation=new Validator(req.body,{
    
    customer_name:"required",
   customer_email:"required",
   customer_Phone:"required",
   shipping_address:"required"


 })
 if (validation.fails()) {

    return res.status(422).json(validation.errors.all())
}
next();
}