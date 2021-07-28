const passport =require('passport')
var LocalStrategy=require('passport-local').Strategy;
// var JwtStrategy = require('passport-jwt').Strategy;
// var  ExtractJwt = require('passport-jwt').ExtractJwt;
const User=require('./models/user')
// const config=require('./config')


exports.local=passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = config.secretKey;


// exports.jwtPassport=passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
//     User.findOne({_id: jwt_payload._id}, (err, user)=>{
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));

// exports.verifyUser=passport.authenticate('jwt',{session:false})