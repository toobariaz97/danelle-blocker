const Sequelize = require('sequelize');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const {users} = require('../models');

//facebookToken is the custom name of facebookstrategy
//FACEBOOK_APP_ID and FAEBOOK_APP_SECRET are set in .env file
passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID:"737591730892264",
      clientSecret:"b9e590a5548ce11b712ec0d26fa05c91",
    },
    async (accessToken, refreshToken, profile, done, res) => {
      console.log(`inside facebook strategy`);
      //log to view the profile email
      console.log(`profile email: ${profile.emails[0].value}`);

      //check if there is a existing user in database either
      //with the user email or corresponding facebookid
      const existingUser = await users.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: { [Sequelize.Op.eq]: profile.emails[0].value } },
            { social_id: { [Sequelize.Op.eq]: profile.id } },
          ],
        },
        attributes: ['id', 'email', 'social_id'],
      });
      //if user exists, then return the existing user
      if (existingUser) {
        return done(null, existingUser);
      }

      //if user does not exist, then create a new record in database
      //with user email and facebookid.
      const newuser = await users.create({
        email: profile.emails[0].value,
        social_id: profile.id !== null ? profile.id : null,
      });

      if (typeof newuser !== 'undefined' && newuser !== null) {
         console.log(`record inserted successfully`);
        done(null, newuser);
      }
    }
  )
);

