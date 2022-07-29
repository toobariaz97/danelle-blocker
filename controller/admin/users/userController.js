const { users: userModel,orders, subscription_plan, subscription_details, sequelize ,order_details} = require('../../../models')
const bcrypt = require('bcrypt');
const { Op, where, literal } = require('sequelize');
const moment = require('moment');
const users = require('../../../models/users');
const { apiSuccess, apiError, apiSuccessWithData } = require('../../../helpers/apiHelpers');
const createNotifications = require('../../../utils/createNotfication');


exports.userRegistration = async (req, res) => {

    let { first_name, last_name, phone, email, password, DOB } = req.body;
    hashPassword = await bcrypt.hash(password, 12)
    try {
        let phoneExist = await userModel.findOne({
            where: {
                phone: req.body.phone
            }
        })
        if (phoneExist) return res.status(403).json({ error: "phone number already exist" })
        let emailExist = await userModel.findOne({
            where: {
                email: req.body.email
            }
        })
        if (emailExist) return res.status(403).json({ error: 'Email is already exist' })

        if (req.file == undefined) {
            return res.status(422).json(apiError("select image"))
        }
        console.log()
        let userData = await userModel.create({
            first_name,
            last_name,
            email,
            phone,
            password: hashPassword,
            gender: req.body.gender ? "male" : "female",
            image: req.file.originalname,
            DOB,
            status: true
        })

        console.log(userData)
        return res.status(200).json(apiSuccess(("Registered Successfully..!")));
    }

    catch (e) {
        console.log(e);
        return res.status(500).json(e)
    }
}

exports.updateUserProfile = async (req, res) => {
    let { first_name, last_name, phone, password, DOB, gender } = req.body;
    try {

        let isExist = await userModel.findOne({ where: { id: req.params.id } });
        if (!isExist) return res.status(404).json("not exist");
        if (password) {
            hashPassword = await bcrypt.hash(password, 12)
            isExist.password = hashPassword;
        } else {
            isExist.password = isExist.password
        }
        isExist.first_name = first_name;
        isExist.last_name = last_name;
        isExist.gender = gender;
        isExist.DOB = DOB;

        if (req.file == undefined) {
            isExist.image = null
        }
        else {
            isExist.image = req.file.originalname
        }

        await isExist.save()
        const notification = {
            notifiable_id: null,
            title: "Profile Updated",
            body: `Your profile is updated user id: ${isExist.id}`,
            notifiable_type: "User",
            name: "Admin",
            name_id: isExist.id
        }

        createNotifications(notification)
        return res.status(200).json(apiSuccess("user profile updated successfully"))


    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: "server error", error })
    }
}

exports.getUserProfile = async (req, res) => {
    try {


        let userProfile = await userModel.findOne({
            include:["subscription_plan","orders"],
            where: {
                id: req.params.id
            }
        })
        if (!userProfile) return res.status(404).json(apiError("not exist"));

        return res.status(200).json(apiSuccessWithData("user Profile", userProfile))



    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }
}
exports.getAllUsers = async (req, res) => {

    try {
        const whereStatement = {}

        const { status, startDate, endDate, search, subscription, entries, page } = req.query;

        if (subscription) {
            // let sub = sequelize.escape(`%${subscription}%`);
            // console.log(parseInt(sub), typeof sub, sub)
            whereStatement.id = {
                [Op.in]: sequelize.literal(`(SELECT user_id FROM subscription_details WHERE subscription_details.user_id = users.id AND subs_id = ${subscription})`)
            }
        }

        if (status) {
            whereStatement.status = { [Op.like]: `${status}` };
        }
        if (startDate && endDate) {
            whereStatement.createdAt = { [Op.between]: [startDate, endDate] }
        }
        if (search) {
            whereStatement.first_name = { [Op.like]: `%${search}%` }

        }
 
        var currentpage = page ? parseInt(page) : 1;

        var per_page = entries ? parseInt(entries) : 10;


        let { docs: data, total, pages } = await userModel.paginate({
            include:["subscription_plan","orders"],
            where: whereStatement,
            page: currentpage,
            paginate: per_page,
            // Datefilter
        })
        //         data.forEach(async(element) => {
//     let order= await order_details.findOne({
//         where:{user_id:element.id}
//     })
    
// });
        let response = {
           data,
            // order,
            current_page: currentpage,
            total,
            per_page: entries,
            last_page: pages,
        }
        return res.status(200).json(apiSuccessWithData("all user profiles", response))

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)

    }
}


exports.updateStatusUser = async (req, res) => {

    try {

        let isExist = await userModel.findOne({
            where: {
                id: req.params.id,

            }
        })
        console.log(isExist)
        if (!isExist) return res.status(404).json(apiError("not exist"))

        if (req.body.status == 1) {

            isExist.status = 1
            await isExist.save()
            return res.status(200).json(apiSuccess("User Active"));
        }
        else {
            isExist.status = 0
            await isExist.save()
            return res.status(200).json(apiSuccess("User Inactive"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)

    }


}