const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy

const User=require("./models/user")

var JwtStrategy = require('passport-jwt').Strategy;
var  ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt=require('jsonwebtoken')
const config=require('./config')


exports.local=passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())


//Here user is payload
exports.getToken=(user)=>{
    return jwt.sign(user,config.secretKey)
}

var opts={}

opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey=config.secretKey


//New passport jwt strategy with the corresponding logic


exports.jwtPassport=passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log("JWT payload",jwt_payload);

    User.findOne({_id:jwt_payload._id},(err,user)=>{
       if(err){
           return done(err,false)
       }
       else if(user){
           return done(null,user)
       }
       else{
           return done(null,false)
       }
    })

    }
    ))

    //For verifying any user ,without creating any sessions
    exports.verifyUser=passport.authenticate('jwt',{session:false})

    // exports.verifyAdmin=
    exports.verifyAdmin=(req,res,next)=>{
        if(req.user.admin){
            next();
        }
        else{
            var err=new Error("You are not authorized to perform this operation")
            err.status=403;
            next(err);
        }
    }