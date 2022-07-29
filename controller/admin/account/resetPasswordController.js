const { admin, password_reset } = require('../../../models');
const { passwordReset } = require('../../../utils/mail');
const bcrypt = require('bcrypt');
const { mt_rand } = require('../../../utils/helpers');
const { apiError, apiSuccess } = require('../../../helpers/apiHelpers');


exports.verfiyEmail = async (req, res) => {

    try {
        let emailExist = await admin.findOne(

            {
                where: {
                    email: req.body.email
                }
            }
        )
        if (!emailExist) return res.status(404).json(apiError("email is not exist"));
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
        return res.status(200).json(apiSuccess("email is verified"));

    } catch (error) {
        console.log(error)
        return res.status(500).json(apiError("server error"))
    }
}

exports.verifyCode = async (req, res) => {

    try {
        
        
        let emailExist = await password_reset.findOne(
            {
                where: {
                    
                    token: req.body.token
                }
            })
            
            if (!emailExist) return res.status(403).json(apiError("Incorrect code"));
            
            return res.status(200).json(apiSuccess("code is verified"));
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(apiError("server error"))
        }
        
    }
    
    exports.resetPassword = async (req, res) => {
        
        try {
            
            let codeVerify = await password_reset.findOne({
                where: {
                    token: req.params.code
                }
        })
        if (!codeVerify) return res.status(403).json(apiError("Incorrect code"));

        req.body.password = await bcrypt.hash(req.body.password, 12)

        await admin.update(req.body, {
            where: {
                email: codeVerify.email
            }
        })
        return res.status(200).json(apiSuccess("password reset successfully"))
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json(apiError("server error"))
    }

    

}