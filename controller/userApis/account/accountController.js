const { admin, users } = require('../../../models')
const bcrypt = require('bcrypt');
const { apiError, apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers');

exports.getAccount = async (req, res) => {

    let { user } = req;

    try {

        let userData = await users.findOne({
            where: {
                id: user.id
            }
        })
        if (!userData
        )
            return res.status(404).json(apiError("user is not exist"))

        return res.status(200).json(apiSuccessWithData("Auth profile", userData))
    } catch (error) {
        console.log(error)
    }
}


exports.updateAccount = async (req, res) => {

    let { user } = req;
    console.log(user)
    try {
        let profile = await users.findOne({
            where: {
                id: user.id
            }
        })
        console.log(profile, "profiless")
        let userData = await profile.update(req.body)
        if (!userData) return res.status(401).json("user is not exist")

        if (req.file) {
            userData.image = req.file.originalname;
        } await userData.save();
        console.log(userData, "user data")

        return res.status(200).json(apiSuccess("profile updated successfully"))
    } catch (error) {
        console.log(error)
    }
}

// exports.updateImage = async (req, res) => {


//     let { user } = req;
//     console.log(user)
//     try {

//         user.image = req.file.originalname;
//         await user.save();

//         // if (!admin) return res.status(401).json("user is not exist")

//         return res.status(200).json("image Updated successfully successfully")
//     } catch (error) {
//         console.log(error)
//     }


// }

exports.changePassword = async (req, res) => {

    let { user } = req;

    try {

        let isMatch = await bcrypt.compare(req.body.current_password, user.password)
        if (!isMatch) {
            return res.status(403).json(apiError("Incorrect password"))
        }

        user.password = await bcrypt.hash(req.body.password, 12)
        await user.save();
        // let userData= await adminModel.update(req.body,{
        //      where:{
        //          id:user.id
        //      }
        // })
        if (!admin) return res.status(404).json(apiError("user is not exist"))

        return res.status(200).json(apiSuccess("password change successfully"))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

