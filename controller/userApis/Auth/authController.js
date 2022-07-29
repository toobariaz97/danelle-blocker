const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { admin, users } = require('../../../models');
const moment = require('moment');
const createNotifications = require("../../../utils/createNotfication");
const { apiError, apiLogin, apiSuccess } = require("../../../helpers/apiHelpers");

exports.login = async (req, res) => {

    try {

        let auth = await users.findOne({
            where: {
                email: req.body.email,

            }
        })

        if (!auth) return res.status(404).json(apiError("This email is not exist"))

        let token = jwt.sign({ user_id: auth.id, expiry: moment().utc().add(1, 'year') }, 'danyelly_api')
        let hashPassword = await bcrypt.compare(req.body.password, auth.password)

        if (!hashPassword) return res.status(403).json("Incorrect password")

        // delete auth.dataValues.password;

        return res.status(200).json(apiLogin("login succssefully",token));
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }



}
exports.userRegistration = async (req, res) => {

    let { first_name, last_name, phone, email, password, DOB ,status} = req.body;
    hashPassword = await bcrypt.hash(password, 12)
    try {
        let phoneExist = await users.findOne({
            where: {
                phone: req.body.phone
            }
        })
        if (phoneExist) return res.status(403).json(apiError( "phone number already exist"))
        let emailExist = await users.findOne({
            where: {
                email: req.body.email
            }
        })

        if (emailExist) return res.status(403).json(apiError( 'Email is already exist'));
        // if (req.file == undefined) {
        //     return res.json("select image")
        // }
        console.log()
        let userData = await users.create({
            first_name,
            last_name,
            email,
            phone,
            password: hashPassword,
            gender: req.body.gender ? "male" : "female",
            DOB,
            status:status?true:false
            
        })
        if(req.file)
        {
            userData.image=req.file.originalname
            await userData.save()
        }

        const notification = {
            notifiable_id: null,
            title: "new User registered",
            body: `new user registered ${userData.first_name} with the Id: ${userData.id}`,
            notifiable_type: "Admin",
            
                name: "user",
                name_id: userData.id
        
        }

        createNotifications(notification)
        
        console.log(userData)
        return res.status(200).json(apiSuccess(( "Registered Successfully..!")));
    }

    catch (e) {
        console.log(e)
    }

}


// exports.register = async (req, res) => {

//     let { first_name, last_name, email, password, gender, DOB, phone } = req.body;
//     try {

//         hashPassword = await bcrypt.hash(password, 12)
//         let auth = await users.create({
//             first_name,
//             last_name,
//             email,
//             gender,
//             DOB,
//             phone,
//             password: hashPassword
//         })
//         // auth.password = hashPassword;
//         // await auth.save();
//         console.log(auth);

      
//         return res.status(200).json("Registered Successfully..!");
//     }



//     catch (e) {
//         console.log(e)
//     }
// }

