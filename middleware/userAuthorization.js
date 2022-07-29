const { getAuthId } = require("../utils/helpers");
const { users ,admin} = require('../models')
const bcrypt = require('bcrypt');

module.exports = async(req, res, next) => {

        let userId = await getAuthId(req.headers.authorization);
        console.log(userId,"userId")
        if (!userId)
            return res.status(401).json({ message: `unathorized` })

        let user = await users.findByPk(userId);

        if (!userId) return res.status(401).json({ message: `unathorized` })
        console.log(userId)
       
       
        req.user = user;
        // console.log(user, "admin from middleware")
        return next();
    }