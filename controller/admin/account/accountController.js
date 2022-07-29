const { admin: adminModel } = require('../../../models')
const bcrypt = require('bcrypt');
const { apiError, apiSuccess, apiSuccessWithData } = require('../../../helpers/apiHelpers');



exports.getAccount = async (req, res) => {

    let { admin } = req;
    try {
        let adminData = await adminModel.findOne({
            where: {
                id: admin.id
            }
        })
        delete adminData.password;
        console.log(adminData)
        if (!adminData) return res.status(404).json(apiError("User not exist"))

        return res.status(200).json(apiSuccessWithData("Admin Profile", adminData))
    }
    catch (error) {
        console.log(error)
    }
}


exports.updateAccount = async (req, res) => {

    let { admin } = req;
    console.log(admin)
    try {

        let { first_name, last_name } = req.body;
        if (!admin) return res.status(404).json(apiError("admin is not exist"))

        admin.first_name = first_name;
        admin.last_name = last_name;

        await admin.save()
        if (req.file) {
            admin.image = req.file.originalname
            await admin.save()
        }


        return res.status(200).json(apiSuccess("profile updated successfully"))
    } catch (error) {
        console.log(error)
    }
}

// exports.updateImage = async (req, res) => { 


//     let { admin } = req;
//     console.log(admin)
//     try {

//         admin.image = req.file.originalname;
//         await admin.save();

//         // if (!admin) return res.status(401).json("admin is not exist")

//         return res.status(200).json("image Updated successfully successfully")
//     } catch (error) {
//         console.log(error)
//     }
// }
exports.changePassword = async (req, res) => {

    let { admin } = req;

    try {

        let isMatch = await bcrypt.compare(req.body.current_password, admin.password)
        if (!isMatch) {
            return res.status(403).json(apiError("Incorrect password"))
        }

        admin.password = await bcrypt.hash(req.body.password, 12)

        if (!admin) return res.status(404).json(apiError("Not exist"))
        await admin.save();
        // let adminData= await adminModel.update(req.body,{
        //      where:{
        //          id:admin.id
        //      }
        // })

        return res.status(200).json(apiSuccess("Password change successfully.."))
    } catch (error) {
        console.log(error)
    }

}

