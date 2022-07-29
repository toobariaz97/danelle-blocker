const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const models = require('../../../models');

module.exports.facebookOAuth = (req, res, next) => {
  if (req.user.email !== null && req.user.id !== null) {
   let email = req.user.email;
   let fbid = req.user.facebookid;
   res.status(200).json({ emailid: email, facebookid: fbid })
   }
 };

 module.exports.googleCurl = (req, res) => {
   try {
     googlevalue(req.body.idToken, res);
   } catch (err) {
     console.log(`error: ${err}`);
   }
 };

 async function googlevalue(tokenid, res) {
   await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenid}`)
     .then(res => res.json())
     .then(async gUser => {
       const existingUser = await models.users.findOne({
         where: {
           email: { [Sequelize.Op.eq]: gUser.email },
         },
         attributes: ['id', 'email'],
       });

       if (typeof existingUser === 'undefined' || existingUser === null) {
         await models.users
           .create({
             email: gUser.email,
           })
           .then(async emailregister => {
             if (typeof emailregister !== 'undefined' && emailregister !== null) {
                console.log(`email registration created`);
               res.status(200).json({ emailid: emailregister.email });
             } else {
               res
                 .status(500)
                 .json('email registration not created');
             }
           });
       }
     });
 }