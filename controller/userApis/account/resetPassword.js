const { users, password_reset } = require('../../../models');
const { passwordReset } = require('../../../utils/mail');
const bcrypt = require('bcrypt');
const { mt_rand } = require('../../../utils/helpers');
const { apiError, apiSuccess } = require('../../../helpers/apiHelpers');


exports.verfiyEmail = async (req, res) => {

    try {
        let emailExist = await users.findOne(

            {
                where: {
                    email: req.body.email
                }
            }
        )
        if (!emailExist) return res.status(403).json(apiError("email is not exist"));
        let generateCode = mt_rand(1111, 9999)

        await password_reset.destroy({
            where: {
                email: req.body.email
            }
        })
        let codeData = await password_reset.create({
            email: req.body.email,
            token: generateCode
        })
        console.log(codeData)
        //mail
        passwordReset(req.body.email, generateCode)
        return res.status(200).json(apiSuccess("Email sent, please check your email for security code"));

    } catch (error) {
        console.log(error)
    return res.status(500).json(error)
}



}


exports.verifyCode = async (req, res) => {
    
    try {
        

        let emailExist = await password_reset.findOne(
            {
                where: {

                    token: req.body.token,
                    email:req.params.email
                }
            })

            if (!emailExist) return res.status(403).json(apiError("incorrect code"));
            
            return res.status(200).json(apiSuccess("code accepted"));
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
        
    }
    
    exports.resetPassword = async (req, res) => {
        
        try {

            let codeVerify = await password_reset.findOne({
                where: {
                    token: req.body.code,
                    email:req.body.email,
            
                }
        })
        
        if (!codeVerify) return res.status(403).json(apiError("Incorrect code"));

        req.body.password = await bcrypt.hash(req.body.password, 12)

        await users.update(req.body, {
            where: {
                email: codeVerify.email
            }
        })
        
        
        return res.status(200).json(apiSuccess("password reset successfully"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }



}