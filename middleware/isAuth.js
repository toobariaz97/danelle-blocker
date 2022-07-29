const { getAuthId } = require("../utils/helpers");
const { users, admin:adminModel } = require('../models')
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {

    let userId = await getAuthId(req.headers.authorization);
    console.log(userId, "userId")
    if (!userId)
        return res.status(401).json({ message: `unathorized` })

    let admin = await adminModel.findByPk(userId);

    if (!userId) return res.status(401).json({ message: `unathorized` })
    console.log(userId)
    req.admin = admin;
    console.log(admin , "admin from middleware")
    return next();
}