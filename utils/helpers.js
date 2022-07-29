const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const moment = require('moment');


module.exports = {

    getAuthId(authorizationHeader = null) {
        if (!authorizationHeader)
            return null;

        let authHeaderArray = authorizationHeader.split(' ');
        console.log(authHeaderArray)
        if (authHeaderArray.length == 2) {

            let isTOkenVerified = jwt.verify(authHeaderArray[1], 'danyelly_api');
            console.log(isTOkenVerified);
            if (isTOkenVerified) {
                const decodedValue = jwt.decode(authHeaderArray[1])
                if (moment(decodedValue.expiry).isAfter(moment.now())) {
                    return decodedValue.user_id;
                }
                return null;
            }
            return null;
        }

        return null;
    },
    mt_rand(min, max) {

        const args = arguments.length
        if (args === 0) {
            min = 0
            max = 2147483647

        } else if (args === 1) {
            throw new Error(`warning :mt_rand() excepts exactly 2 parameters,1 given`)
        } else {
            min = parseInt(min, 10)
            max = parseInt(max, 10)
        }
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    deleteJwt(authorizationHeader) {
        jwt.destroy(authorizationHeader)
        return res.json('token is not valid')
    }

    

}