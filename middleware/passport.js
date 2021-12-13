const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const GoogleUser = require('../models/GoogleUser')

//98814536232-d60s35shoeqktteofjg2b8n7c6tfqcab.apps.googleusercontent.com

module.exports = function(passport){
    console.log("checkpoint 1 ======")
    passport.use(
        new GoogleStrategy(
            {
                clientID:process.env.GOOGLE_CLIENT_ID,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:'/auth/google/callback',
               // accessType: 'offline',
               // userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
            },
            async (accessToken,refreshToken,profile,done) => {
                console.log("we were here ===========");
                console.log(profile);
                const newUser = {
                    googleId:profile.id,
                    displayName:profile.displayName,
                    firstName:profile.name.givenName,
                    lastName:profile.name.familyName,
                    image:profile.photos[0].value
                }
                try {
                    let user = await GoogleUser.findOne({googleId:profile.id})

                    if(user){
                        return done(null,user);
                    } else {
                        user = await GoogleUser.create(newUser)
                        return done(null,user);
                    }
                }catch(err){
                    console.log("errrrrrrr")
                    console.log(err)
                }
            }
        )
    )

    passport.serializeUser((user,done) => {
        done(null,user.googleId||user.id)
    })

    passport.deserializeUser((id,done) => {
        GoogleUser.findById(id,(err,user) => done(err,user))
    })
}