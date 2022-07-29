const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { admin } = require('../../../models');
const moment = require('moment');
const { apiError, apiLogin, apiSuccess } = require("../../../helpers/apiHelpers");

exports.login = async (req, res) => {

    try {

        let auth = await admin.findOne({
            where: {
                email: req.body.email,

            }
        })
        if (!auth) return res.status(404).json(apiError("Email not exist"))

        let token = jwt.sign({ user_id: auth.id, expiry: moment().utc().add(1, 'year') }, 'danyelly_api')
        let hashPassword = await bcrypt.compare(req.body.password, auth.password)

        if (!hashPassword) return res.status(403).json(apiError("Incorrect password"))

        // delete auth.dataValues.password;

        return res.status(200).json(apiLogin("login succssefully", token))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }



}

exports.register = async (req, res) => {

    let { first_name, last_name, email, password } = req.body;
    try {
        let saltRound=10;
    
let hashPassword=await bcrypt.hash(req.body.password,saltRound)
        let auth = await admin.create({
          first_name: "Tooba",
          last_name:"Riaz",
          password:"hell0",
          email: "tooba@gmail.com",
          password: hashPassword,
        //   image:req.file.originalname
        });
    
        if (!auth) return res.status(404).json(apiError("something went wrong"));
        return res.status(200).json(apiSuccess("Registration successfully..."));
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
}